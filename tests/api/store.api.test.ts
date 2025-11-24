import { test, expect } from './fixtures/storeApiFixture';
import { LoginPage } from '../../pages/loginPage';
import { StorePage } from '../../pages/storePage';
import { STORE_PASSWORD } from '../config/env';
import { TEST_USER } from '../config/testData';

const RESPONSE_THRESHOLD_MS = 1000;

test.describe('Store API', () => {
  test('GET /store2/ responds within acceptable time', async ({ storeApi }) => {
    await test.step('Measure response time for /store2/', async () => {
      const duration = await storeApi.measureResponseTimeMs();
      expect(duration).toBeLessThan(RESPONSE_THRESHOLD_MS);
    });
  });

  test('API prices match UI totals for all products', async ({ page, storeApi }) => {
    // --- 1. Fetch all available products from the API ---
    const products = await storeApi.getProductList();

    // --- 2. Log in via UI and navigate to the store page ---
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.username, STORE_PASSWORD, TEST_USER.role);
    await expect(page).toHaveURL(/store2/i);

    const storePage = new StorePage(page);

    // Collect mismatches for a final summary
    const mismatches: {
      productId: string;
      productName?: string;
      apiPrice: number;
      uiPrice: number;
    }[] = [];

    // --- 3. For each product: compare API price to UI total for quantity 1 ---
    for (const product of products) {
      const productId = String(product.id);
      const productName = product.name;

      await test.step(
        `Validate price for product ID ${productId}${productName ? ` (${productName})` : ''}`,
        async () => {
          // 3.1 Get price from API
          const apiPrice = await storeApi.getProductPrice(productId);

          // 3.2 Reset state to a clean store page for each product
          await storePage.goto();

          // 3.3 Add exactly 1 item of this product in the UI
          await storePage.addProductToCart(productId, 1);

          // 3.4 Read totals from the UI
          const { totalSum } = await storePage.getTotals();

          // 3.5 Soft-assert: UI total should match API price
          //   - Soft assertion means the test continues for all products
          //   - The test will still fail at the end if any soft assertion failed
          expect.soft(
            totalSum,
            `UI total (${totalSum}) should match API price (${apiPrice}) for product ${productId}`
          ).toBeCloseTo(apiPrice, 2);

          // 3.6 Track mismatches for a summary log
          const diff = Math.abs(totalSum - apiPrice);
          const tolerance = 0.01;

          if (diff > tolerance) {
            mismatches.push({
              productId,
              productName,
              apiPrice,
              uiPrice: totalSum,
            });
          }
        }
      );
    }

    // --- 4. Final summary / status report ---
    if (mismatches.length > 0) {
      console.error('Price mismatches found between API and UI:');
      for (const m of mismatches) {
        console.error(
          `  - Product ${m.productId}${
            m.productName ? ` (${m.productName})` : ''
          }: API = ${m.apiPrice}, UI = ${m.uiPrice}`
        );
      }
    }
  });
});
