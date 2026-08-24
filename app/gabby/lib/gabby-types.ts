export type OrbMode = 'focus' | 'learn' | 'create' | 'execute' | 'protect' | 'success' | 'rest';
export type ActivityStatus = 'idle' | 'listening' | 'processing' | 'awaiting_approval' | 'executing' | 'verified' | 'blocked' | 'error';
export type HaloState = 'none' | 'single' | 'double' | 'protective';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type VerificationState = 'not_required' | 'pending' | 'verified' | 'failed';

export interface GodspeedRuntimeState {
  currentActivity: ActivityStatus;
  riskScore: number;
  confidenceScore: number;
  activeActionId: string | null;
  verificationState: VerificationState;
  policyHoldActive: boolean;
}

export interface GabbyOrbViewModel {
  mode: OrbMode;
  activityStatus: ActivityStatus;
  intensity: number;
  halo: HaloState;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  approvedActionId?: string;
  verificationState: VerificationState;
  accessibleStatus: string;
  canRenderExecution: boolean;
  canRenderSuccess: boolean;
  updatedAt: string;
}
