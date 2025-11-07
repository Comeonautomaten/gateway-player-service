const { getFranchiseConfig } = require('../config/franchises');
const { getLicenseDefaults } = require('../config/defaults');
const { generatePlayerProfile } = require('../utils/dataGenerator');

/**
 * Build the Gateway payload using franchise defaults, license rules
 * and randomly generated player profile data.
 */

/**
 * Produces the payload expected by the Gateway `/player/` endpoint.
 * @param {Object} options
 * @returns {{payload: Object, profile: Object}}
 */
function buildPlayerPayload(options) {
  const { franchiseCode } = options;

  if (!franchiseCode) {
    throw new Error('franchiseCode is required to build player payload');
  }

  const franchiseConfig = getFranchiseConfig(franchiseCode);

  if (!franchiseConfig) {
    throw new Error(`Unsupported franchise code: ${franchiseCode}`);
  }

  const licenseDefaults = getLicenseDefaults(franchiseConfig.license);

  const profile = generatePlayerProfile({ franchiseConfig, licenseDefaults });

  const basePayload = {
    frameworkType: licenseDefaults.frameworkType,
    password: licenseDefaults.password,
    franchiseCode,
    siteCode: franchiseConfig.siteCode,
    countryCode: franchiseConfig.countryCode,
    currencyId: franchiseConfig.currencyId,
    birthPlace: franchiseConfig.defaultCountry,
    citizenship: franchiseConfig.defaultCountryId,
    locale: franchiseConfig.locale,
    isLocalRun: licenseDefaults.isLocalRun,
    isTestUser: licenseDefaults.isTestUser,
    skipDepositLimitMessage: licenseDefaults.skipDepositLimitMessage,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    email: profile.email,
    birthDate: profile.birthDate,
    personalNumber: profile.personalNumber,
    address: profile.address,
    city: profile.city,
    postalCode: profile.postalCode,
    state: profile.state,
    gender: 'MALE',
    mobile: profile.mobile.international,
    mobileCountryCode: profile.mobile.countryCode,
    lossLimits: { ...licenseDefaults.lossLimits },
    depositLimits: { ...licenseDefaults.depositLimits },
    timeLimits: { ...licenseDefaults.timeLimits }
  };

  if (licenseDefaults.spendingLimits) {
    basePayload.spendingLimits = { ...licenseDefaults.spendingLimits };
  }

  if (licenseDefaults.balanceLimit) {
    basePayload.balanceLimit = licenseDefaults.balanceLimit;
  }

  const payload = { ...basePayload };

  return {
    payload,
    profile
  };
}

module.exports = {
  buildPlayerPayload
};

