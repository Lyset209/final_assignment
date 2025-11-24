import { test, expect } from './fixtures/storeFixture';
import { VAT_RATE, PRODUCT_TEST_CASES } from '../config/testData';

// Tolerance used when comparing numeric values (to account for minor rounding)
const PRICE_TOLERANCE = 0.01;

test.describe('Store – functional behavior', () => {
  test('consumer can add each product and verify totals', async ({ storePage }) => {
    // Collect all mismatches so we can print a summary at the end
    const mismatches: {
      productId: string;
      productName: string;
      issue: string;
      expected: number;
      actual: number;
    }[] = [];

    // Loop through all configured product test cases
    for (const { id, name, quantity } of PRODUCT_TEST_CASES) {
      const productId = String(id);

      await test.step(`Add ${quantity} × ${name} (ID: ${productId}) and verify totals`, async () => {
        // Reset to a clean store page for each product to avoid cart accumulation
        await storePage.goto();

        // Step 1: Add the selected product to the cart
        await storePage.addProductToCart(productId, quantity);

        // Step 2: Read all calculated totals from the UI
        const { totalSum, totalVAT, grandTotal } = await storePage.getTotals();

        // Step 3: Verify product price shown in the table matches totalSum
        const tablePrice = await storePage.getPriceFromTableByProductId(productId);
        expect.soft(
          totalSum,
          `totalSum should match table price for product ${productId} (${name})`
        ).toBeCloseTo(tablePrice, 2);

        if (Math.abs(totalSum - tablePrice) > PRICE_TOLERANCE) {
          mismatches.push({
            productId,
            productName: name,
            issue: 'Table price mismatch',
            expected: tablePrice,
            actual: totalSum,
          });
        }

        // Step 4: VAT should equal totalSum × VAT_RATE
        const expectedVAT = totalSum * VAT_RATE;
        expect.soft(
          totalVAT,
          `totalVAT should be ${VAT_RATE * 100}% of totalSum for product ${productId} (${name})`
        ).toBeCloseTo(expectedVAT, 2);

        if (Math.abs(totalVAT - expectedVAT) > PRICE_TOLERANCE) {
          mismatches.push({
            productId,
            productName: name,
            issue: 'VAT mismatch',
            expected: expectedVAT,
            actual: totalVAT,
          });
        }

        // Step 5: Grand total should equal subtotal + VAT
        const expectedGrandTotal = totalSum + totalVAT;
        expect.soft(
          grandTotal,
          `grandTotal should equal totalSum + totalVAT for product ${productId} (${name})`
        ).toBeCloseTo(expectedGrandTotal, 2);

        if (Math.abs(grandTotal - expectedGrandTotal) > PRICE_TOLERANCE) {
          mismatches.push({
            productId,
            productName: name,
            issue: 'Grand total mismatch',
            expected: expectedGrandTotal,
            actual: grandTotal,
          });
        }
      });
    }

    // After looping all products, print a summary of any mismatches
    if (mismatches.length > 0) {
      console.error('Functional total mismatches found:');
      for (const m of mismatches) {
        console.error(
          `  - Product ${m.productId} (${m.productName}): ${m.issue} – expected ${m.expected}, got ${m.actual}`
        );
      }
    }
    // Note: any failed expect.soft above will still cause the test to fail overall,
    // but only after all products have been processed.
  });
});
