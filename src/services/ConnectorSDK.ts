export interface ConnectorMetadata {
  id: string;
  name: string;
  type: string;
  version: string;
  description: string;
  baseUrl: string;
  supportedFormats: string[];
  capabilities: string[];
}

export interface ConnectorHealthStatus {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastChecked: Date;
  details?: string;
}

export interface ConnectorSearchParams {
  query: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}

export interface ConnectorSearchResult<T = any> {
  success: boolean;
  total: number;
  items: T[];
  error?: string;
  raw?: any;
}

export interface NormalizedRecord {
  id: string;
  title: string;
  source: string;
  entityType: 'COMPANY' | 'PERSON' | 'TENDER' | 'SANCTION' | 'REGISTRY_ENTRY' | 'DOCUMENT' | 'OTHER';
  identifiers: {
    edrpou?: string;
    ipn?: string;
    code?: string;
    [key: string]: any;
  };
  details: Record<string, any>;
  timestamp: string;
  rawRecord?: any;
}

/**
  * Універсальний інтерфейс для SDK Конекторів даних
  */
export interface UniversalConnectorSDK {
  metadata(): ConnectorMetadata;
  health(): Promise<ConnectorHealthStatus>;
  search(params: ConnectorSearchParams): Promise<ConnectorSearchResult>;
  normalize(rawItem: any): NormalizedRecord;
}

/**
  * CKAN Connector Implementation для data.gov.ua
  */
export class CKANConnector implements UniversalConnectorSDK {
  private config: ConnectorMetadata = {
    id: 'ckan_data_gov_ua',
    name: '🇺🇦 CKAN Data.gov.ua Connector',
    type: 'REST / CKAN API',
    version: '2.4.0',
    description: 'Прямий конектор до Національного порталу відкритих даних України',
    baseUrl: '/api/v1/ckan',
    supportedFormats: ['JSON', 'CSV', 'DataStore API'],
    capabilities: ['package_search', 'datastore_search', 'datastore_sql', 'schema_discovery']
  };

  metadata(): ConnectorMetadata {
    return { ...this.config };
  }

  async health(): Promise<ConnectorHealthStatus> {
    const startTime = performance.now();
    try {
      const res = await fetch(`${this.config.baseUrl}/datasets?q=healthcheck&rows=1`);
      const latencyMs = Math.round(performance.now() - startTime);
      if (res.ok) {
        return {
          status: 'ONLINE',
          latencyMs,
          lastChecked: new Date(),
          details: "З'єднання з API data.gov.ua активне"
        };
      }
      return {
        status: 'DEGRADED',
        latencyMs,
        lastChecked: new Date(),
        details: `Сервер відповів зі статусом ${res.status}`
      };
    } catch (err: any) {
      return {
        status: 'OFFLINE',
        latencyMs: Math.round(performance.now() - startTime),
        lastChecked: new Date(),
        details: err.message || "Втрачено зв'язок з CKAN API"
      };
    }
  }

  async search(params: ConnectorSearchParams): Promise<ConnectorSearchResult> {
    const rows = params.limit || 15;
    try {
      const res = await fetch(`${this.config.baseUrl}/datasets?q=${encodeURIComponent(params.query)}&rows=${rows}`);
      const data = await res.json();

      if (data.error) {
        return {
          success: false,
          total: 0,
          items: [],
          error: data.error
        };
      }

      const items = Array.isArray(data) ? data : (data.results || []);
      return {
        success: true,
        total: items.length,
        items,
        raw: data
      };
    } catch (err: any) {
      return {
        success: false,
        total: 0,
        items: [],
        error: err.message || 'Помилка виконання пошуку CKAN'
      };
    }
  }

  async fetchResourceSchema(resourceId: string): Promise<{ success: boolean; schema?: any; error?: string }> {
    try {
      const schemaRes = await fetch(`${this.config.baseUrl}/schema/${resourceId}`);
      const schemaData = await schemaRes.json();
      if (schemaData.error) throw new Error(schemaData.error);
      return { success: true, schema: schemaData };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async fetchResourceData(resourceId: string, limit: number = 50): Promise<{ success: boolean; records?: any[]; total?: number; error?: string }> {
    try {
      const recordsRes = await fetch(`${this.config.baseUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: resourceId, limit })
      });
      const recordsData = await recordsRes.json();
      if (recordsData.error) throw new Error(recordsData.error);
      return {
        success: true,
        records: recordsData.records || [],
        total: recordsData.total || 0
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  normalize(rawItem: any): NormalizedRecord {
    if (!rawItem) {
      return {
        id: 'unknown',
        title: 'Невідомий запис',
        source: this.config.id,
        entityType: 'OTHER',
        identifiers: {},
        details: {},
        timestamp: new Date().toISOString()
      };
    }

    // Якщо це dataset з CKAN
    if (rawItem.dataset_id || rawItem.id) {
      return {
        id: rawItem.dataset_id || rawItem.id,
        title: rawItem.title || 'Набір даних CKAN',
        source: 'Data.gov.ua (CKAN)',
        entityType: 'REGISTRY_ENTRY',
        identifiers: {
          code: rawItem.dataset_id || rawItem.name,
        },
        details: {
          organization: rawItem.organization || (rawItem.organization?.title) || 'Міністерство юстиції України',
          resourcesCount: rawItem.resources_count || rawItem.resources?.length || 0,
          format: rawItem.resources?.[0]?.format || 'JSON/CSV',
          modified: rawItem.metadata_modified || new Date().toISOString()
        },
        timestamp: rawItem.metadata_modified || new Date().toISOString(),
        rawRecord: rawItem
      };
    }

    // Якщо це окремий запис з DataStore
    const edrpou = rawItem.edrpou || rawItem.code || rawItem.ЄДРПОУ;
    const name = rawItem.name || rawItem.title || rawItem.Назва || 'Суб\'єкт господарювання';

    return {
      id: String(edrpou || Math.random().toString(36).substring(7)),
      title: String(name),
      source: 'DataStore CKAN API',
      entityType: edrpou ? 'COMPANY' : 'OTHER',
      identifiers: {
        edrpou: edrpou ? String(edrpou) : undefined,
      },
      details: { ...rawItem },
      timestamp: new Date().toISOString(),
      rawRecord: rawItem
    };
  }
}

/** Інстанс універсального CKAN конектора */
export const ckanConnector = new CKANConnector();
