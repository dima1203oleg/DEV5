import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from "firebase/firestore";
import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../lib/firebase";

export interface SandboxNode {
  id: string;
  name: string;
  type: 'company' | 'person' | 'cryptowallet' | 'auto' | 'custom';
  code: string;
  baseRisk: number;
  cascadedRisk: number;
  status: 'ACTIVE' | 'SUSPICIOUS' | 'SANCTIONED' | 'LIQUIDATED';
  description: string;
  x: number;
  y: number;
  isDragging?: boolean;
}

export interface SandboxLink {
  id: string;
  source: string; // node ID
  target: string; // node ID
  label: string; // e.g. "Засновник", "Транзакція"
  multiplier: number; // 0.1 - 1.0 (influence weight)
  flowDirection: 'forward' | 'backward' | 'none';
}

export interface InvestigationGraphRecord {
  id: string;
  title: string;
  nodes: SandboxNode[];
  links: SandboxLink[];
  nodesCount: number;
  linksCount: number;
  updatedAt: string;
  sha256Hash?: string;
  syncedToCloud: boolean;
}

export type SyncStatus = 'IDLE' | 'SYNCING' | 'SAVED' | 'OFFLINE' | 'ERROR';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// STORE METHODS FOR FIRESTORE GRAPH PERSISTENCE
// -------------------------------------------------------------

export async function saveInvestigationGraphToFirestore(record: InvestigationGraphRecord): Promise<boolean> {
  const path = `entity_graphs/${record.id}`;
  try {
    const docRef = doc(db, "entity_graphs", record.id);
    const payload = {
      ...record,
      syncedToCloud: true,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    // Offline local storage fallback
    try {
      const existing = JSON.parse(localStorage.getItem("predator_investigation_graphs_cache") || "[]");
      const idx = existing.findIndex((g: any) => g.id === record.id);
      if (idx >= 0) {
        existing[idx] = record;
      } else {
        existing.push(record);
      }
      localStorage.setItem("predator_investigation_graphs_cache", JSON.stringify(existing));
    } catch (e) {
      console.error("Localstorage graph fallback error:", e);
    }
    return true;
  }
}

export async function fetchInvestigationGraphFromFirestore(id: string): Promise<InvestigationGraphRecord | null> {
  const path = `entity_graphs/${id}`;
  try {
    const docRef = doc(db, "entity_graphs", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as InvestigationGraphRecord;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  // Local storage fallback
  try {
    const cached = localStorage.getItem("predator_investigation_graphs_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      const found = parsed.find((g: any) => g.id === id);
      if (found) return found;
    }
  } catch (e) {
    console.error("Local storage fallback error:", e);
  }
  return null;
}

export function subscribeInvestigationGraphFromFirestore(
  id: string,
  callback: (record: InvestigationGraphRecord) => void
): () => void {
  const path = `entity_graphs/${id}`;
  try {
    const docRef = doc(db, "entity_graphs", id);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as InvestigationGraphRecord);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// -------------------------------------------------------------
// REACT HOOK: useInvestigationSync
// -------------------------------------------------------------

export function useInvestigationSync(
  investigationId: string = "inv-sandbox-main",
  initialNodes: SandboxNode[] = [],
  initialLinks: SandboxLink[] = []
) {
  const [nodes, setNodes] = useState<SandboxNode[]>(initialNodes);
  const [links, setLinks] = useState<SandboxLink[]>(initialLinks);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('IDLE');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Monitor Network Online/Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('OFFLINE');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time listener for Firestore changes from other tabs / sessions
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeInvestigationGraphFromFirestore(investigationId, (cloudRecord) => {
      if (isMounted && cloudRecord) {
        if (Array.isArray(cloudRecord.nodes) && cloudRecord.nodes.length > 0) {
          setNodes(cloudRecord.nodes);
        }
        if (Array.isArray(cloudRecord.links) && cloudRecord.links.length > 0) {
          setLinks(cloudRecord.links);
        }
        setCloudSynced(true);
        setSyncStatus('SAVED');
        setLastSyncedAt(new Date(cloudRecord.updatedAt || Date.now()));
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [investigationId]);

  // Debounced Auto-sync execution
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const performSave = useCallback(async (currentNodes: SandboxNode[], currentLinks: SandboxLink[]) => {
    setSyncStatus('SYNCING');
    setError(null);

    const record: InvestigationGraphRecord = {
      id: investigationId,
      title: "Граф розслідування PREDATOR Sandbox",
      nodes: currentNodes,
      links: currentLinks,
      nodesCount: currentNodes.length,
      linksCount: currentLinks.length,
      updatedAt: new Date().toISOString(),
      syncedToCloud: true,
    };

    const success = await saveInvestigationGraphToFirestore(record);
    if (success) {
      setSyncStatus('SAVED');
      setLastSyncedAt(new Date());
      setCloudSynced(true);
    } else {
      setSyncStatus('ERROR');
      setError('Не вдалося зберегти граф у Firestore');
      setCloudSynced(false);
    }
  }, [investigationId]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSyncStatus('SYNCING');
    saveTimeoutRef.current = setTimeout(() => {
      performSave(nodes, links);
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, links, performSave]);

  // Mutations
  const addNode = (node: SandboxNode) => {
    setNodes(prev => [...prev.filter(n => n.id !== node.id), node]);
  };

  const updateNode = (id: string, updates: Partial<SandboxNode>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setLinks(prev => prev.filter(l => l.source !== id && l.target !== id));
  };

  const addLink = (link: SandboxLink) => {
    setLinks(prev => [...prev.filter(l => l.id !== link.id), link]);
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const manualSave = () => performSave(nodes, links);

  return {
    nodes,
    links,
    setNodes,
    setLinks,
    addNode,
    updateNode,
    deleteNode,
    addLink,
    deleteLink,
    syncStatus,
    lastSyncedAt,
    error,
    cloudSynced,
    isOnline,
    saveNow: manualSave,
  };
}
