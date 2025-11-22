// Default store user used in UI tests that require login
export const STORE_USER = {
  username: 'Johan',
  role: 'consumer',
};

// User credentials specifically for login-focused tests
export const LOGIN_USER = {
  username: 'Johan',
  role: 'consumer',
};

// VAT rate applied in price calculations throughout the store
// All customers at The Hoff Store are located in Armenia or Bulgaria, where a 20% VAT rate is standard."
// https://www.globalvatcompliance.com/globalvatnews/world-countries-vat-rates-2020/
export const VAT_RATE = 0.2;

// Base URL for both UI navigation and API requests
export const BASE_URL = 'https://hoff.is';
