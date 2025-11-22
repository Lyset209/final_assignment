import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { Store2Page } from '../../pages/storePage';

// Read password from environment (GitHub Secret: STORE_PASSWORD)
const PASSWORD = process.env.STORE_PASSWORD;
if (!PASSWORD) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

// Test data / constants
const USERNAME = 'markus';
const ROLE = 'consumer';

// Type for fixtures
type Fixtures = {
  store2Page: Store2Page;
};

// Extend Playwright’s `test` with a fixture that logs in and creates Store2Page
const test = base.extend<Fixtures>({
  store2Page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD, ROLE);

    await expect(page).toHaveURL(/store2/i);

    const store2Page = new Store2Page(page);
    await use(store2Page);
  },
});

// Accessibility: Assistive technology compatibility
test(
  'Assistive technology compatibility – structure and core controls are accessible',
  async ({ page, store2Page }) => {
    await test.step('Page main structure is accessible for assistive technology', async () => {
      await expect(page).toHaveURL(/store2/i);

      const mainRegion = page.getByRole('main');
      await expect(mainRegion).toBeVisible();

      const heading1 = page.getByRole('heading', { level: 1 });
      await expect(heading1).toBeVisible();
    });

    await test.step('Form controls are visible and usable', async () => {
      const controls = [
        { locator: store2Page.productSelect, name: 'product selector' },
        { locator: store2Page.amountInput, name: 'amount input' },
        { locator: store2Page.addToCartButton, name: '"Add to cart" button' },
      ];

      for (const control of controls) {
        await expect(control.locator).toBeVisible();
        await expect(control.locator).toBeEnabled();
      }

      await expect(store2Page.addToCartButton).toHaveRole('button');
    });
  }
);
