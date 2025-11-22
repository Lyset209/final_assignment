import { test, expect } from './fixtures/storeFixture';

// Business rules / constants
const VAT_RATE = 0.2;

// Data-driven product cases
const productTestCases = [
  {
    id: '10',
    name: 'TV',
    quantity: 1,
  },
];

test.describe('Store – functional behavior', () => {
  // Data-driven test: runs the same logic for each product in productTestCases
  for (const { id, name, quantity } of productTestCases) {
    test(
      `consumer can add ${name} and grandTotal is correct + price matches table`,
      async ({ storePage }) => {
        // 1. Add product to the cart
        await test.step(`Add ${quantity} ${name}(s) to the cart`, async () => {
          await storePage.addProductToCart(id, quantity);
        });

        // 2. Fetch totals from the page
        const { totalSum, totalVAT, grandTotal } = await test.step(
          'Fetch totals from the cart',
          () => storePage.getTotals()
        );

        // 3. Verify table price matches totalSum
        await test.step(`Verify table price for ${name} matches totalSum`, async () => {
          const tablePrice = await storePage.getPriceFromTableByProductId(id);

          expect(
            totalSum,
            `totalSum (${totalSum}) should match the table price (${tablePrice})`
          ).toBeCloseTo(tablePrice, 2);
        });

        // 4. VAT should be 20% of totalSum
        // All customers at The Hoff Store are located in Armenia or Bulgaria, where a 20% VAT rate is standard.
        // https://www.globalvatcompliance.com/globalvatnews/world-countries-vat-rates-2020/
        await test.step('Verify that totalVAT ≈ 20% of totalSum', async () => {
          const expectedVAT = totalSum * VAT_RATE;

          expect(
            totalVAT,
            `totalVAT (${totalVAT}) should be ~${VAT_RATE * 100}% of totalSum (${totalSum})`
          ).toBeCloseTo(expectedVAT, 2);
        });

        // 5. grandTotal = totalSum + totalVAT
        await test.step('Verify that grandTotal = totalSum + totalVAT', async () => {
          const expectedGrand = totalSum + totalVAT;

          expect(
            grandTotal,
            `grandTotal (${grandTotal}) should equal totalSum + totalVAT (${totalSum} + ${totalVAT})`
          ).toBeCloseTo(expectedGrand, 2);
        });
      }
    );
  }
});
