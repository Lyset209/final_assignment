import { test, expect } from './fixtures/storeApiFixture';
import { LoginPage } from '../../pages/loginPage';
import { StorePage } from '../../pages/storePage';
import { StoreApi } from '../../api/storeApi';
import { STORE_PASSWORD } from '../config/env';
import { TEST_USER, BASE_URL } from '../config/testData';

const RESPONSE_THRESHOLD_MS = 1000;

// Simple type for the product info we care about
type ProductInfo = {
  id: number;
  name?: string;
};

// Populated once in beforeAll
let products: ProductInfo[] = [];

// Fetch product list once before all tests in this file
test.beforeAll(async ({ playwright }) => {
  const requestContext = await playwright.request.newContext({ baseURL: BASE_URL });

  try {
    const storeApi = new StoreApi(requestContext);
    products = await storeApi.getProductList();
  } finally {
    await requestContext.dispose();
  }
});

test.describe('Store API', () => {
  test('GET /store2/ responds within acceptable time', async ({ storeApi }) => {
    await test.step('Measure response time for /store2/', async () => {
      const duration = await storeApi.measureResponseTimeMs();
      expect(duration).toBeLessThan(RESPONSE_THRESHOLD_MS);
    });
  });

  test('API prices match UI totals for all products', async ({ page, storeApi }) => {
    // Sanity check that beforeAll actually fetched something
    expect(products.length, 'Expected at least one product from API').toBeGreaterThan(0);

    // Log in once and reuse the same StorePage
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.username, STORE_PASSWORD, TEST_USER.role);
    await expect(page).toHaveURL(/store2/i);

    const storePage = new StorePage(page);

    // Loop over all products and compare API price with UI total for quantity 1
    for (const product of products) {
      const productId = String(product.id);
      const label = product.name ? `${product.id} (${product.name})` : String(product.id);

      await test.step(`Validate price for product ${label}`, async () => {
        // 1. Get price from API
        const apiPrice = await storeApi.getProductPrice(productId);

        // 2. Reset to a clean store page for each product
        await storePage.goto();

        // 3. Add 1 item of this product in the UI
        await storePage.addProductToCart(productId, 1);

        // 4. Read total sum from UI
        const { totalSum } = await storePage.getTotals();

        // 5. Soft-assert: UI total should match API price
        //    - Uses expect.soft so all products are checked, even if some fail.
        expect.soft(
          totalSum,
          `UI total should match API price for product ${label}`
        ).toBeCloseTo(apiPrice, 2);
      });
    }
    // If any expect.soft failed, Playwright will still mark this test as failed,
    // but only after all products have been processed.
  });
});
