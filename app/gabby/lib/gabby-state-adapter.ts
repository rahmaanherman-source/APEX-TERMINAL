import type { GabbyOrbViewModel, GodspeedRuntimeState, ConfidenceLevel, RiskLevel, OrbMode, HaloState } from './gabby-types';

export function toGabbyOrbViewModel(state: GodspeedRuntimeState, now = new Date().toISOString()): GabbyOrbViewModel {
  const riskLevel: RiskLevel = state.riskScore >= 80 ? 'critical' : state.riskScore >= 50 ? 'high' : state.riskScore > 20 ? 'medium' : state.riskScore > 0 ? 'low' : 'none';
  const confidence: ConfidenceLevel = state.confidenceScore < 40 ? 'low' : state.confidenceScore < 75 ? 'medium' : 'high';
  let mode: OrbMode = 'rest';
  let halo: HaloState = 'none';

  if (state.policyHoldActive || riskLevel === 'critical' || riskLevel === 'high' || state.currentActivity === 'blocked' || state.currentActivity === 'error') {
    mode = 'protect'; halo = 'protective';
  } else if (state.currentActivity === 'executing' && state.activeActionId) {
    mode = 'execute'; halo = 'double';
  } else if (state.currentActivity === 'verified' && state.verificationState === 'verified') {
    mode = 'success'; halo = 'single';
  } else if (state.currentActivity === 'listening') {
    mode = 'learn'; halo = 'single';
  } else if (state.currentActivity === 'processing' || state.currentActivity === 'awaiting_approval') {
    mode = 'focus'; halo = 'single';
  }

  const canRenderExecution = mode === 'execute' && state.currentActivity === 'executing' && Boolean(state.activeActionId);
  const canRenderSuccess = mode === 'success' && state.verificationState === 'verified';
  const accessibleStatus: Record<OrbMode, string> = {
    focus: 'Focus: APEX is analyzing and planning.',
    learn: 'Learn: authorized knowledge ingestion is active.',
    create: 'Create: generative construction is active.',
    execute: 'Execute: an approved action is running; verification is pending.',
    protect: 'Protect: execution is blocked by verified risk or policy state.',
    success: 'Success: the action has been verified.',
    rest: 'Rest: background monitoring is nominal and awaiting input.',
  };

  return {
    mode,
    activityStatus: state.currentActivity,
    intensity: mode === 'rest' ? 30 : mode === 'execute' ? 95 : 75,
    halo,
    confidence,
    riskLevel,
    approvedActionId: state.activeActionId ?? undefined,
    verificationState: state.verificationState,
    accessibleStatus: accessibleStatus[mode],
    canRenderExecution,
    canRenderSuccess,
    updatedAt: now,
  };
}
