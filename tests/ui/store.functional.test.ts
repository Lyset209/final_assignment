import { test, expect } from './fixtures/storeFixture';
import { VAT_RATE } from '../config/testData';

// Test data for different product scenarios (expandable for more cases)
const productTestCases = [
  { id: '10', name: 'TV', quantity: 1 },
];

test.describe('Store – functional behavior', () => {
  for (const { id, name, quantity } of productTestCases) {
    
    test(`consumer can add ${name} and verify totals`, async ({ storePage }) => {
      
      // Step 1: Add the selected product to the cart
      await test.step(`Add ${quantity} × ${name}`, async () => {
        await storePage.addProductToCart(id, quantity);
      });

      // Step 2: Read all calculated totals from the UI
      const { totalSum, totalVAT, grandTotal } = await storePage.getTotals();

      // Step 3: Verify product price shown in the table matches totalSum
      const tablePrice = await storePage.getPriceFromTableByProductId(id);
      expect(totalSum).toBeCloseTo(tablePrice, 2);

      // Step 4: VAT should equal totalSum × VAT_RATE
      const expectedVAT = totalSum * VAT_RATE;
      expect(totalVAT).toBeCloseTo(expectedVAT, 2);

      // Step 5: Grand total should equal subtotal + VAT
      expect(grandTotal).toBeCloseTo(totalSum + totalVAT, 2);
    });
  }
});
