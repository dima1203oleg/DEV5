import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  getDocFromServer,
  onSnapshot
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { InvestigationWorkspace, CanonicalEntity, EntityRelationship } from "../types/predator";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

// Connection test helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline or unreachable.");
    }
    return false;
  }
}

// -------------------------------------------------------------
// INVESTIGATION WORKSPACE FIREBASE SYNC
// -------------------------------------------------------------

export async function saveInvestigationToFirestore(investigation: InvestigationWorkspace): Promise<boolean> {
  const path = `investigations/${investigation.id}`;
  try {
    const docRef = doc(db, "investigations", investigation.id);
    const payload = {
      ...investigation,
      syncedToCloud: true,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    // Fallback: save to localStorage if offline
    try {
      const existing = JSON.parse(localStorage.getItem("predator_investigations_cloud_cache") || "[]");
      const idx = existing.findIndex((i: any) => i.id === investigation.id);
      if (idx >= 0) {
        existing[idx] = { ...investigation, syncedToCloud: true };
      } else {
        existing.push({ ...investigation, syncedToCloud: true });
      }
      localStorage.setItem("predator_investigations_cloud_cache", JSON.stringify(existing));
    } catch (e) {
      console.error("Localstorage fallback error:", e);
    }
    return true;
  }
}

export async function fetchInvestigationsFromFirestore(): Promise<InvestigationWorkspace[]> {
  const path = "investigations";
  try {
    const q = collection(db, "investigations");
    const snapshot = await getDocs(q);
    const results: InvestigationWorkspace[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as InvestigationWorkspace);
    });
    if (results.length > 0) return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  // Local storage fallback
  try {
    const cached = localStorage.getItem("predator_investigations_cloud_cache");
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.error("Failed to read local cache:", e);
  }
  return [];
}

// -------------------------------------------------------------
// ENTITY RELATIONSHIP GRAPH FIREBASE SYNC
// -------------------------------------------------------------

export interface EntityGraphRecord {
  id: string;
  entityId: string;
  canonicalName: string;
  nodesCount: number;
  linksCount: number;
  nodes: any[];
  links: any[];
  sha256Hash: string;
  updatedAt: string;
  geoCoordinates?: { lat: number; lng: number; label: string }[];
}

export async function saveEntityGraphToFirestore(graphRecord: EntityGraphRecord): Promise<boolean> {
  const path = `entity_graphs/${graphRecord.id}`;
  try {
    const docRef = doc(db, "entity_graphs", graphRecord.id);
    await setDoc(docRef, graphRecord, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    try {
      const existing = JSON.parse(localStorage.getItem("predator_graphs_cloud_cache") || "[]");
      const idx = existing.findIndex((g: any) => g.id === graphRecord.id);
      if (idx >= 0) {
        existing[idx] = graphRecord;
      } else {
        existing.push(graphRecord);
      }
      localStorage.setItem("predator_graphs_cloud_cache", JSON.stringify(existing));
    } catch (e) {
      console.error("Localstorage fallback error:", e);
    }
    return true;
  }
}

export function subscribeInvestigationsFromFirestore(
  callback: (investigations: InvestigationWorkspace[]) => void
): () => void {
  const path = "investigations";
  try {
    const q = collection(db, "investigations");
    return onSnapshot(
      q,
      (snapshot) => {
        const results: InvestigationWorkspace[] = [];
        snapshot.forEach((docSnap) => {
          results.push(docSnap.data() as InvestigationWorkspace);
        });
        if (results.length > 0) {
          callback(results);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// -------------------------------------------------------------
// CUSTOM REGISTRIES FIREBASE SYNC
// -------------------------------------------------------------

export async function saveCustomRegistryToFirestore(registry: any): Promise<boolean> {
  const path = `custom_registries/${registry.id}`;
  try {
    const docRef = doc(db, "custom_registries", registry.id);
    await setDoc(docRef, registry, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export function subscribeCustomRegistriesFromFirestore(
  callback: (registries: any[]) => void
): () => void {
  const path = "custom_registries";
  try {
    const q = collection(db, "custom_registries");
    return onSnapshot(
      q,
      (snapshot) => {
        const results: any[] = [];
        snapshot.forEach((docSnap) => {
          results.push(docSnap.data());
        });
        callback(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

