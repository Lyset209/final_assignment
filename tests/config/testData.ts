// Default test user
export const TEST_USER = {
  username: 'Johan',
  role: 'consumer',
};

// VAT rate applied in price calculations throughout the store
// All customers at The Hoff Store are located in Armenia or Bulgaria, where a 20% VAT rate is standard."
// https://www.globalvatcompliance.com/globalvatnews/world-countries-vat-rates-2020/
export const VAT_RATE = 0.2;

// Base URL for both UI navigation and API requests
export const BASE_URL = 'https://hoff.is';

// Type used for product-based functional test cases
export type ProductTestCase = {
  id: number;
  name: string;
  quantity: number;
};

// Product list used in the functional store tests
export const PRODUCT_TEST_CASES: ProductTestCase[] = [
  { id: 1, name: 'Apple',        quantity: 1 },
  { id: 2, name: 'Banana',       quantity: 1 },
  { id: 3, name: 'Orange',       quantity: 1 },
  { id: 4, name: 'Grape',        quantity: 1 },
  { id: 5, name: 'Bicycle',      quantity: 1 },
  { id: 6, name: 'Samsung S5',   quantity: 1 },
  { id: 7, name: 'Toy Train',    quantity: 1 },
  { id: 8, name: 'Cup of coffee',quantity: 1 },
  { id: 9, name: 'Chair',        quantity: 1 },
  { id: 10, name: 'TV',          quantity: 1 },
];