import { TEST_MODE } from '../config';

export const PLANS = {
  free: {
    id: 'free',
    label: 'Free',
    price: 0,
    videosPerMonth: 1,
    features: {
      noiseRemoval: true,
      voiceBoost: false,
      volumeBalance: false,
      allExportFormats: false,
    },
  },
  starter: {
    id: 'starter',
    label: 'Starter',
    price: 49,
    videosPerMonth: 15,
    features: {
      noiseRemoval: true,
      voiceBoost: false,
      volumeBalance: false,
      allExportFormats: false,
    },
  },
  plus: {
    id: 'plus',
    label: 'Plus ⚡',
    price: 100,
    videosPerMonth: 50,
    features: {
      noiseRemoval: true,
      voiceBoost: true,
      volumeBalance: true,
      allExportFormats: true,
    },
  },
  creator: {
    id: 'creator',
    label: 'Creator',
    price: 99,
    videosPerMonth: 40,
    features: {
      noiseRemoval: true,
      voiceBoost: true,
      volumeBalance: true,
      allExportFormats: true,
    },
  },
  pro: {
    id: 'pro',
    label: 'Pro 🔥',
    price: 199,
    videosPerMonth: 999,
    features: {
      noiseRemoval: true,
      voiceBoost: true,
      volumeBalance: true,
      allExportFormats: true,
    },
  },
};

export function canProcess(userPlan, usedThisMonth) {
  if (TEST_MODE) return true;
  return usedThisMonth < PLANS[userPlan].videosPerMonth;
}

export function hasFeature(userPlan, featureKey) {
  if (TEST_MODE) return true;
  return PLANS[userPlan]?.features[featureKey] === true;
}
