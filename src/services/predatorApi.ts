import { CanonicalEntity, DataProvenanceChain, InvestigationWorkspace, AuditLogEntry, QueryDslRequest } from "../types/predator";

export class PredatorApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": localStorage.getItem("predator_role") || "SENIOR_ANALYST",
        ...options?.headers
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      throw new Error(err.error?.message || `API Error: ${res.status}`);
    }

    return res.json();
  }

  public static async searchEntities(query: string, entityType?: string): Promise<{
    entities: CanonicalEntity[];
    total: number;
    provenanceSummary: string;
  }> {
    return this.request("/api/v1/predator/search", {
      method: "POST",
      body: JSON.stringify({ query, entityType })
    });
  }

  public static async getProvenanceChain(entityId: string): Promise<DataProvenanceChain> {
    return this.request(`/api/v1/predator/provenance/${encodeURIComponent(entityId)}`);
  }

  public static async executeQueryDsl(dsl: QueryDslRequest): Promise<any> {
    return this.request("/api/v1/predator/query-dsl", {
      method: "POST",
      body: JSON.stringify(dsl)
    });
  }

  public static async executeAiTask(task: string, prompt: string, systemInstruction?: string): Promise<{
    text: string;
    modelUsed: string;
    latencyMs: number;
    privacyLevel: string;
  }> {
    return this.request("/api/v1/ai/execute-task", {
      method: "POST",
      body: JSON.stringify({ task, prompt, systemInstruction })
    });
  }

  public static async getConnectors(): Promise<any[]> {
    return this.request("/api/v1/connectors");
  }

  public static async getAuditLogs(): Promise<{ total: number; logs: AuditLogEntry[] }> {
    return this.request("/api/v1/audit/logs");
  }

  public static async createMediaPresign(filename: string, mimeType: string, sizeBytes: number): Promise<any> {
    return this.request("/api/v1/media/presign", {
      method: "POST",
      body: JSON.stringify({ filename, mimeType, sizeBytes })
    });
  }
}
