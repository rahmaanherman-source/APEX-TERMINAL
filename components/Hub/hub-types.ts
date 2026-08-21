export type HubDestination =
  | 'DASHBOARD' | 'PROJECTS' | 'TOOLS' | 'ENGINES' | 'CONNECTIONS'
  | 'MARKETPLACE' | 'AUDIT_LOG' | 'MEMORY_SLABS' | 'SETTINGS'
  | 'CHARACTER_STUDIO' | 'TERMINAL' | 'VAULT';

export type HubAction = 'BUILD' | 'RUN' | 'TEST' | 'VERIFY' | 'DEPLOY' | 'PUBLISH';

export type TruthState =
  | 'VERIFIED' | 'OBSERVED' | 'BLOCKED' | 'FAILED' | 'UNKNOWN'
  | 'CONNECTED_NOT_VERIFIED' | 'REQUIRES_CONFIGURATION' | 'MISSING_CONNECTOR'
  | 'UNAVAILABLE' | 'STALE' | 'ADAPTER_MOUNTED';

export interface ConnectedApp {
  id: string;
  name: string;
  iconKey: string;
  category: string;
  status: TruthState;
  workspaceRoute?: HubDestination;
  capabilitySummary: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  message: string;
  state: TruthState;
}
