/**
 * Global defaults applied when building the Gateway player payload.
 * These values reflect common automation assumptions across licenses.
 */
const genericDefaults = {
  frameworkType: 'automation',
  password: 'Test123!',
  isLocalRun: false,
  isTestUser: true,
  skipDepositLimitMessage: true,
  balance: undefined,
  lossLimits: {
    dailyLimit: 100,
    weeklyLimit: 200,
    monthlyLimit: 300
  },
  depositLimits: {
    dailyLimit: '1000',
    weeklyLimit: '2000',
    monthlyLimit: '3000'
  },
  timeLimits: {
    dailyLimit: '8',
    weeklyLimit: '40',
    monthlyLimit: '120',
    isMandatory: true
  }
};

/**
 * License-specific tweaks layered on top of the generic defaults.
 */
const licenseOverrides = {
  gga: {
    spendingLimits: {
      monthlyLimit: '700'
    },
    balanceLimit: '500'
  },
  plga: {
    timeLimits: {
      dailyLimit: '12',
      weeklyLimit: '100',
      monthlyLimit: '300',
      isMandatory: true
    },
    depositLimits: {
      dailyLimit: '100',
      weeklyLimit: '200',
      monthlyLimit: '300'
    }
  }
};

/**
 * Resolves payload defaults for a given license, falling back to the generic set.
 */
function getLicenseDefaults(license) {
  const overrides = license ? licenseOverrides[license] : null;

  if (!overrides) {
    return {
      ...genericDefaults,
      lossLimits: { ...genericDefaults.lossLimits },
      depositLimits: { ...genericDefaults.depositLimits },
      timeLimits: { ...genericDefaults.timeLimits }
    };
  }

  return {
    ...genericDefaults,
    ...overrides,
    lossLimits: {
      ...genericDefaults.lossLimits,
      ...(overrides.lossLimits || {})
    },
    depositLimits: {
      ...genericDefaults.depositLimits,
      ...(overrides.depositLimits || {})
    },
    timeLimits: {
      ...genericDefaults.timeLimits,
      ...(overrides.timeLimits || {})
    }
  };
}

module.exports = {
  getLicenseDefaults
};

