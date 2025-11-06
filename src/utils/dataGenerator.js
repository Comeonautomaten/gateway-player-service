const { faker } = require('@faker-js/faker');
const { generate: generatePesel } = require('pesel');

/**
 * Utility helpers for generating repeatable yet realistic player data values.
 */

function createEmail(domain) {
  const timestamp = Date.now();
  const random = faker.string.alphanumeric(6).toLowerCase();
  return `autotest_reg+${timestamp}${random}@${domain}`;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function pad(number, size) {
  return number.toString().padStart(size, '0');
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSwedishPersonalNumber(isUnderAge) {
  const day = pad(randomIntFromInterval(1, 31), 2);
  const month = pad(randomIntFromInterval(1, 12), 2);
  const year = isUnderAge
    ? pad(randomIntFromInterval(10, 20), 2)
    : pad(randomIntFromInterval(0, 99), 2);
  const digits = pad(randomIntFromInterval(0, 999), 3);

  const partial = `${year}${month}${day}${digits}`;
  const parts = partial.split('').map(Number);

  let checksum = 0;
  let multiplicator = 2;

  for (const value of parts) {
    const product = value * multiplicator;
    checksum += product > 9 ? product - 9 : product;
    multiplicator = multiplicator === 1 ? 2 : 1;
  }

  let control = 10 - (checksum % 10);
  if (control === 10) {
    control = 0;
  }

  const century = isUnderAge ? '20' : '19';
  return `${century}${partial}${control}`;
}

function generatePersonalNumber(franchiseConfig, birthDate) {
  const { license, countryCode, defaultCountry } = franchiseConfig;

  if (license === 'plga') {
    const [year, month, day] = birthDate.split('-').map(Number);
    return generatePesel({
      year,
      month,
      day,
      sex: 'M'
    });
  }

  if (countryCode === 'CA_ON' || defaultCountry === 'CA') {
    // Canadian SIN style (9 digits)
    return faker.string.numeric({ length: 9 });
  }

  if (license === 'gga') {
    return generateSwedishPersonalNumber(false);
  }

  return faker.string.numeric({ length: 10 });
}

function generatePhoneNumber({ countryCallingCode, nationalNumberLength = 8 }) {
  const countryCode = countryCallingCode || '+46';
  const number = faker.string.numeric({ length: nationalNumberLength });
  return {
    international: `${countryCode}${number}`,
    countryCode,
    nationalNumber: number
  };
}

function generatePlayerProfile({ franchiseConfig, licenseDefaults }) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const emailDomain = franchiseConfig.emailDomain || 'comeon.com';
  const email = createEmail(emailDomain);
  const usernamePrefix = (franchiseConfig.siteCode || 'user').replace(/[^a-zA-Z]/g, '').slice(0, 5).toLowerCase();
  const username = `${usernamePrefix}cy${faker.number.int({ min: 10000, max: 99999 })}`;
  const password = franchiseConfig.password || licenseDefaults.password;
  const address = faker.location.streetAddress();
  const city = faker.location.city();
  const postalCode = franchiseConfig.postalCode || faker.location.zipCode();
  const state = franchiseConfig.state || licenseDefaults.state || 'NA';
  const birthDate = formatDate(
    faker.date.birthdate({ min: 23, max: 55, mode: 'age' })
  );
  const personalNumber = generatePersonalNumber(franchiseConfig, birthDate);
  const mobile = generatePhoneNumber({
    countryCallingCode: franchiseConfig.callingCode,
    nationalNumberLength: franchiseConfig.nationalNumberLength
  });

  return {
    firstName,
    lastName,
    email,
    username,
    password,
    birthDate,
    personalNumber,
    address,
    city,
    postalCode,
    state,
    mobile
  };
}

module.exports = {
  generatePlayerProfile
};

