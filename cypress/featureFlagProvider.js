import { DISABLED_FEATURE_FLAGS, FEATURE_FLAGS } from './featureFlags';

let instance = null;

export class FeatureFlagProvider {
  isFeatureEnabled(featureFlag) {
    if (DISABLED_FEATURE_FLAGS.includes(featureFlag)) return false;

    return FEATURE_FLAGS.includes(featureFlag);
  }
}

export function getFeatureFlagProvider() {
  if (!instance) {
    instance = new FeatureFlagProvider();
  }

  return instance;
}
