import { test, expect } from './fixtures/storeFixture';
import { VAT_RATE } from '../config/testData';

const productTestCases = [
  { id: '10', name: 'TV', quantity: 1 },
];

test.describe('Store – functional behavior', () => {
  for (const { id, name, quantity } of productTestCases) {
    test(`consumer can add ${name} and verify totals`, async ({ storePage }) => {
      await test.step(`Add ${quantity} × ${name}`, async () => {
        await storePage.addProductToCart(id, quantity);
      });

      const { totalSum, totalVAT, grandTotal } = await storePage.getTotals();

      // Table price check
      const tablePrice = await storePage.getPriceFromTableByProductId(id);
      expect(totalSum).toBeCloseTo(tablePrice, 2);

      // VAT check
      const expectedVAT = totalSum * VAT_RATE;
      expect(totalVAT).toBeCloseTo(expectedVAT, 2);

      // grandTotal = totalSum + VAT
      expect(grandTotal).toBeCloseTo(totalSum + totalVAT, 2);
    });
  }
});
