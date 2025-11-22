import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { Store2Page } from '../../pages/store2Page';

// Read password from environment (GitHub Secret: STORE_PASSWORD)
const PASSWORD = process.env.STORE_PASSWORD;
if (!PASSWORD) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

// Test data / constants
const USERNAME = 'markus';
const ROLE = 'consumer';
const VAT_RATE = 0.2;

// Data-driven product cases
const productTestCases = [
  {
    id: '10',
    name: 'TV',
    quantity: 1,
  },
];

// Type for fixtures
type Fixtures = {
  store2Page: Store2Page;
};

// Extend Playwright’s `test` with a fixture that logs in and creates Store2Page
const test = base.extend<Fixtures>({
  store2Page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Log in once per test through the fixture
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD, ROLE);

    // Verify that the app redirects to /store2 after login
    await expect(page).toHaveURL(/store2/i);

    const store2Page = new Store2Page(page);

    // Make Store2Page available inside the test
    await use(store2Page);
  },
});

// Data-driven test: runs the same logic for each product in productTestCases
for (const { id, name, quantity } of productTestCases) {
  test(
    `consumer can add ${name} and grandTotal is correct + price matches table`,
    async ({ store2Page }) => {
      // 1. Add product to the cart
      await test.step(`Add ${quantity} ${name}(s) to the cart`, async () => {
        await store2Page.addProductToCart(id, quantity);
      });

      // 2. Fetch totals from the page
      const { totalSum, totalVAT, grandTotal } = await test.step(
        'Fetch totals from the cart',
        () => store2Page.getTotals()
      );

      // 3. Verify table price matches totalSum
      await test.step(`Verify table price for ${name} matches totalSum`, async () => {
        const tablePrice = await store2Page.getPriceFromTableByProductId(id);

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
