/**
 * Franchise-specific configuration used when constructing player payloads.
 */
const franchises = {
  SWEDEN_COMEON: {
    license: 'gga',
    siteCode: 'comeon-se',
    countryCode: 'SE',
    currencyId: 'SEK',
    defaultCountry: 'SE',
    defaultCountryId: 'SE',
    locale: 'sv_SE',
    callingCode: '+46',
    nationalNumberLength: 9,
    postalCode: '11111'
  },
  POLAND_PZBUK: {
    license: 'plga',
    siteCode: 'pz-buk',
    countryCode: 'PL',
    currencyId: 'PLN',
    defaultCountry: 'PL',
    defaultCountryId: 'PL',
    locale: 'pl_PL',
    callingCode: '+48',
    nationalNumberLength: 9,
    postalCode: '00-001'
  },
  CANADA_ONTARIO_COMEON: {
    license: 'gga',
    siteCode: 'comeon-ca-on',
    countryCode: 'CA_ON',
    currencyId: 'CAD',
    defaultCountry: 'CA',
    defaultCountryId: 'CA_ON',
    locale: 'en_CA',
    callingCode: '+1',
    nationalNumberLength: 10,
    state: 'ON',
    postalCode: 'M4B1B3'
  }
};

/**
 * Retrieves the configuration for a given franchise.
 */
function getFranchiseConfig(code) {
  const base = franchises[code];
  if (!base) {
    return null;
  }

  return { ...base };
}

module.exports = {
  franchises,
  getFranchiseConfig
};

