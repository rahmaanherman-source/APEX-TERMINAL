import assert from 'node:assert/strict';
import { applyCustomization, DEFAULT_MODE_NAMES } from './customization-profile';

const profile = applyCustomization({ intensity: 150, modeNames: { focus: 'AUTONOMOUS' } as never });
assert.equal(profile.intensity, 100);
assert.deepEqual(profile.modeNames, DEFAULT_MODE_NAMES);
