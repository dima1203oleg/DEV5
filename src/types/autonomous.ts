/**
 * Autonomous Data Discovery & Connector Evolution Engine Types
 * PREDATOR Analytics OSINT Architecture
 */

export type AgentRole =
  | "CEO Agent"
  | "CTO Agent"
  | "Solution Architect Agent"
  | "Research Agent"
  | "Discovery Agent"
  | "Source Intelligence Agent"
  | "Connector Agent"
  | "Parser Agent"
  | "Entity Extraction Agent"
  | "Knowledge Graph Agent"
  | "Data Engineer Agent"
  | "Backend Agent"
  | "Frontend Agent"
  | "QA Agent"
  | "Security Agent"
  | "DevOps Agent"
  | "Infrastructure Agent"
  | "Performance Agent"
  | "Cost Optimizer Agent"
  | "Documentation Agent"
  | "Reviewer Agent"
  | "Release Manager Agent"
  | "Monitoring Agent"
  | "Memory Agent"
  | "Evolution Agent";

export interface AgentStatus {
  id: string;
  name: AgentRole;
  category: "Leadership" | "Intelligence" | "Engineering" | "Operations" | "Evolution";
  status: "IDLE" | "ANALYZING" | "GENERATING" | "TESTING" | "HEALING" | "ACTIVE";
  currentTask: string;
  confidence: number;
  cpuUsage: number;
  vramMB: number;
  completedJobs: number;
  lastActive: string;
  avatarIcon: string;
}

export type SourceProtocol =
  | "CKAN"
  | "OData"
  | "REST API"
  | "GraphQL"
  | "SOAP"
  | "OpenAPI"
  | "Swagger"
  | "WSDL"
  | "RSS/Atom"
  | "FTP/SFTP"
  | "S3"
  | "Azure Blob"
  | "GCS"
  | "CSV/JSON/XML"
  | "Parquet/ORC"
  | "ArcGIS/GeoServer"
  | "GitHub/GitLab"
  | "HuggingFace/Kaggle"
  | "Zenodo/DataHub";

export interface DiscoveredSource {
  id: string;
  name: string;
  url: string;
  protocol: SourceProtocol;
  country: string;
  owner: string;
  businessValue: number; // 0-100
  analyticalValue: number; // 0-100
  riskScore: number; // 0-100
  dataQuality: "HIGH" | "MEDIUM" | "LOW";
  updateFrequency: string;
  authMethod: "None" | "API Key" | "OAuth2" | "Bearer Token" | "mTLS";
  status: "DISCOVERED" | "EVALUATING" | "CONNECTOR_GENERATED" | "TESTED" | "DEPLOYED" | "DRIFT_DETECTED";
  schemaFieldsCount: number;
  detectedEntities: string[];
  recommendedStorage: ("PostgreSQL" | "ClickHouse" | "Neo4j" | "Qdrant" | "OpenSearch" | "Redis" | "MinIO")[];
  lastScanned: string;
}

export interface GeneratedConnectorArtifact {
  id: string;
  sourceId: string;
  sourceName: string;
  version: string;
  connectorCode: string;
  parserCode: string;
  jsonSchema: string;
  etlPipelineYaml: string;
  unitTestsCode: string;
  dockerfile: string;
  helmChartYaml: string;
  openApiSpec: string;
  createdDate: string;
  status: "SANDBOX" | "PRODUCTION" | "DEPRECATED";
}

export interface SchemaDriftEvent {
  id: string;
  sourceId: string;
  sourceName: string;
  detectedAt: string;
  driftType: "FIELD_ADDED" | "FIELD_REMOVED" | "TYPE_MUTATED" | "AUTH_FAILED" | "RATE_LIMIT_EXCEEDED";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  details: string;
  autoPatchStatus: "PENDING" | "PATCH_GENERATED" | "TESTING" | "SELF_HEALED" | "FAILED";
  patchCode?: string;
}

export interface FunctionalEngine {
  id: number;
  name: string;
  category: "Discovery" | "Intelligence" | "Generation" | "Pipeline" | "Testing" | "Monitoring" | "Security" | "Governance" | "Evolution" | "Operations";
  status: "OPERATIONAL" | "OPTIMIZING" | "STANDBY" | "SELF_HEALING";
  metrics: string;
  throughput: string;
  health: number; // 0-100%
  description: string;
}

export interface PolyglotStorageNode {
  type: "PostgreSQL" | "ClickHouse" | "Neo4j" | "Qdrant" | "OpenSearch" | "Redis" | "MinIO";
  role: string;
  recordCount: string;
  storageUsed: string;
  latencyMs: number;
  health: "HEALTHY" | "REINDEXING" | "SYNCING";
}

export interface AIMemoryLog {
  id: string;
  timestamp: string;
  category: "API Pattern" | "Connector Success" | "Schema Migration" | "Drift Resolution" | "Architectural Learning";
  summary: string;
  details: string;
  tags: string[];
}
