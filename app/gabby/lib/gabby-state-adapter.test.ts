import assert from 'node:assert/strict';
import { toGabbyOrbViewModel } from './gabby-state-adapter';

const base = { currentActivity: 'idle' as const, riskScore: 0, confidenceScore: 98, activeActionId: null, verificationState: 'not_required' as const, policyHoldActive: false };

const blockedExecute = toGabbyOrbViewModel({ ...base, currentActivity: 'executing', verificationState: 'pending', activeActionId: null });
assert.equal(blockedExecute.canRenderExecution, false);
assert.equal(blockedExecute.mode, 'rest');

const approvedExecute = toGabbyOrbViewModel({ ...base, currentActivity: 'executing', verificationState: 'pending', activeActionId: 'ACT-1' });
assert.equal(approvedExecute.canRenderExecution, true);
assert.equal(approvedExecute.mode, 'execute');
assert.equal(approvedExecute.halo, 'double');

const unverifiedSuccess = toGabbyOrbViewModel({ ...base, currentActivity: 'verified', verificationState: 'pending', activeActionId: 'ACT-1' });
assert.equal(unverifiedSuccess.canRenderSuccess, false);
assert.notEqual(unverifiedSuccess.mode, 'success');

const verifiedSuccess = toGabbyOrbViewModel({ ...base, currentActivity: 'verified', verificationState: 'verified', activeActionId: 'ACT-1' });
assert.equal(verifiedSuccess.canRenderSuccess, true);
assert.equal(verifiedSuccess.mode, 'success');

const protectedState = toGabbyOrbViewModel({ ...base, currentActivity: 'blocked', verificationState: 'failed', riskScore: 90, policyHoldActive: true });
assert.equal(protectedState.mode, 'protect');
assert.equal(protectedState.halo, 'protective');
