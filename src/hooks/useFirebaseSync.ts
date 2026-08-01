import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface FirebaseSyncState {
  /** Чи є активне мережеве з'єднання з Firestore */
  isOnline: boolean;
  /** Чи повністю синхронізовано дані з хмарою (відсутні незавершені локальні записи) */
  isSynced: boolean;
  /** Чи є локальні зміни, що очікують відправки на сервер */
  hasPendingWrites: boolean;
  /** Чи відображаються дані з локального кешу */
  fromCache: boolean;
  /** Штамп часу останнього успішного зв'язку з сервером */
  lastSyncedAt: Date | null;
  /** Опис помилки або статусу синхронізації */
  syncError: string | null;
  /** Стан первинного або поточного опитування з'єднання */
  isChecking: boolean;
  /** Затримка з'єднання в мілісекундах (ping) */
  latencyMs: number | null;
  /** Функція примусового перетестування з'єднання */
  reconnect: () => Promise<void>;
}

export function useFirebaseSync(): FirebaseSyncState {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [hasPendingWrites, setHasPendingWrites] = useState<boolean>(false);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  /**
   * Примусова перевірка зв'язку з сервером Firestore
   */
  const reconnect = useCallback(async () => {
    setIsChecking(true);
    setSyncError(null);
    const startTime = performance.now();

    try {
      // Спроба безпосереднього запиту до сервера для перевірки мережі
      await getDocFromServer(doc(db, '_connection_test', 'ping'));
      const duration = Math.round(performance.now() - startTime);
      setLatencyMs(duration);
      setIsOnline(true);
      setIsSynced(true);
      setFromCache(false);
      setLastSyncedAt(new Date());
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const errMsg = err?.message || String(err);

      if (errMsg.includes('client is offline') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        setIsOnline(false);
        setIsSynced(false);
        setFromCache(true);
        setSyncError('Клієнт у режимі офлайн');
        setLatencyMs(null);
      } else {
        // Якщо сервер відповів помилкою права доступу або відсутністю документа, з'єднання активне
        setLatencyMs(duration);
        setIsOnline(true);
        setLastSyncedAt(new Date());
        setSyncError(null);
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // 1. Обробники стандартних системних подій браузера (online / offline)
    const handleOnline = () => {
      setIsOnline(true);
      reconnect();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSynced(false);
      setFromCache(true);
      setSyncError('Мережеве з\'єднання відсутнє');
      setLatencyMs(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 2. Слухач Firestore у реальному часі для моніторингу метаданих
    const statusDocRef = doc(db, 'system', 'status');
    const unsubscribe = onSnapshot(
      statusDocRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const cache = snapshot.metadata.fromCache;
        const pending = snapshot.metadata.hasPendingWrites;

        setFromCache(cache);
        setHasPendingWrites(pending);
        setIsSynced(!pending && !cache);

        if (!cache) {
          setIsOnline(true);
          setLastSyncedAt(new Date());
          setSyncError(null);
        } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setIsOnline(false);
        }

        setIsChecking(false);
      },
      (error) => {
        const errMsg = error.message || '';
        if (errMsg.includes('offline') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
          setIsOnline(false);
          setIsSynced(false);
          setFromCache(true);
          setSyncError('З\'єднання з Firestore втрачено');
        } else {
          // Запит досяг сервера, але відхилений правилами або відсутній doc
          setIsOnline(true);
        }
        setIsChecking(false);
      }
    );

    // Початковий тест з'єднання при монтуванні
    reconnect();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      unsubscribe();
    };
  }, [reconnect]);

  return {
    isOnline,
    isSynced,
    hasPendingWrites,
    fromCache,
    lastSyncedAt,
    syncError,
    isChecking,
    latencyMs,
    reconnect,
  };
}
