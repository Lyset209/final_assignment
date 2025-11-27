import { test, expect } from './fixtures/storeApiFixture';
import { LoginPage } from '../../pages/loginPage';
import { StorePage } from '../../pages/storePage';
import { STORE_PASSWORD } from '../config/env';
import { TEST_USER } from '../config/testData';
import { GENERATED_PRODUCTS } from '../config/generatedProducts';

type GeneratedProduct = {
  id: number;
  name?: string;
};

const RESPONSE_THRESHOLD_MS = 1000;

test.describe.parallel('Store API', () => {
  test('GET /store2/ responds within acceptable time', async ({ storeApi }) => {
    const duration = await storeApi.measureResponseTimeMs();
    expect(duration).toBeLessThan(RESPONSE_THRESHOLD_MS);
  });

  //
  // --- PARAMETERIZED TESTS (one test per product) ---
  //
  (GENERATED_PRODUCTS as unknown as GeneratedProduct[]).forEach((product) => {
    const productId = String(product.id);
    const label = product.name ? `${product.id} (${product.name})` : productId;

    test(`API price matches UI total for product ${label}`, async ({ page, storeApi }) => {
      // 1. Login once per test
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, STORE_PASSWORD, TEST_USER.role);
      await expect(page).toHaveURL(/store2/i);

      const storePage = new StorePage(page);

      // 2. Fetch API price
      const apiPrice = await storeApi.getProductPrice(productId);

      // 3. Navigate fresh for every product
      await storePage.goto();

      // 4. Add single item in UI
      await storePage.addProductToCart(productId, 1);

      // 5. Read UI total
      const { totalSum } = await storePage.getTotals();

      // 6. Assert UI matches API
      expect(
        totalSum,
        `UI price should match API price for product ${label}`
      ).toBeCloseTo(apiPrice, 2);
    });
  });
});
