import { test, expect } from './fixtures/storeFixture';
import { VAT_RATE, PRODUCT_TEST_CASES, ProductTestCase } from '../config/testData';

// Local copy of product test cases, populated once before tests run
let products: ProductTestCase[] = [];

test.beforeAll(() => {
  // In case this file changes in the future (e.g. dynamic data),
  // we still have a single place where products are initialized.
  products = PRODUCT_TEST_CASES;
  expect(products.length, 'Expected at least one product in PRODUCT_TEST_CASES').toBeGreaterThan(0);
});

test.describe('Store – functional behavior', () => {
  test('consumer can add each product and verify totals', async ({ storePage }) => {
    for (const { id, name, quantity } of products) {
      const productId = String(id);

      await test.step(`Add ${quantity} × ${name} (ID: ${productId}) and verify totals`, async () => {
        // Start from a clean store page for each product to avoid cart accumulation
        await storePage.goto();

        // 1. Add the selected product to the cart
        await storePage.addProductToCart(productId, quantity);

        // 2. Read totals from the UI
        const { totalSum, totalVAT, grandTotal } = await storePage.getTotals();

        // 3. totalSum should match the price shown in the product table
        const tablePrice = await storePage.getPriceFromTableByProductId(productId);
        expect.soft(
          totalSum,
          `totalSum should match table price for product ${productId} (${name})`
        ).toBeCloseTo(tablePrice, 2);

        // 4. VAT should be totalSum × VAT_RATE
        const expectedVAT = totalSum * VAT_RATE;
        expect.soft(
          totalVAT,
          `totalVAT should be ${VAT_RATE * 100}% of totalSum for product ${productId} (${name})`
        ).toBeCloseTo(expectedVAT, 2);

        // 5. grandTotal should equal totalSum + totalVAT
        const expectedGrandTotal = totalSum + totalVAT;
        expect.soft(
          grandTotal,
          `grandTotal should equal totalSum + totalVAT for product ${productId} (${name})`
        ).toBeCloseTo(expectedGrandTotal, 2);
      });
    }
    // Any failed expect.soft will still cause this test to fail,
    // but only after all products have been processed.
  });
});
