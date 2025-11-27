import { test, expect } from './fixtures/storeFixture';
import { VAT_RATE, PRODUCT_TEST_CASES } from '../config/testData';

test.describe.parallel('Store – functional behavior', () => {
  // One test per product in PRODUCT_TEST_CASES
  PRODUCT_TEST_CASES.forEach(({ id, name, quantity }) => {
    const productId = String(id);

    test(`consumer can add ${quantity} × ${name} (ID: ${productId}) and verify totals`, async ({
      storePage,
    }) => {
      // Start from a clean store page for each product to avoid cart accumulation
      await storePage.goto();

      // 1. Add the selected product to the cart
      await storePage.addProductToCart(productId, quantity);

      // 2. Read totals from the UI
      const { totalSum, totalVAT, grandTotal } = await storePage.getTotals();

      // 3. totalSum should match the price shown in the product table
      const tablePrice = await storePage.getPriceFromTableByProductId(productId);
      expect(
        totalSum,
        `totalSum should match table price for product ${productId} (${name})`
      ).toBeCloseTo(tablePrice, 2);

      // 4. VAT should be totalSum × VAT_RATE
      const expectedVAT = totalSum * VAT_RATE;
      expect(
        totalVAT,
        `totalVAT should be ${VAT_RATE * 100}% of totalSum for product ${productId} (${name})`
      ).toBeCloseTo(expectedVAT, 2);

      // 5. grandTotal should equal totalSum + totalVAT
      const expectedGrandTotal = totalSum + totalVAT;
      expect(
        grandTotal,
        `grandTotal should equal totalSum + totalVAT for product ${productId} (${name})`
      ).toBeCloseTo(expectedGrandTotal, 2);
    });
  });
});
