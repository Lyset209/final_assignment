import { test, expect } from './fixtures/storeFixture';

test.describe('Store – accessibility', () => {
  // Accessibility: Assistive technology compatibility
  test(
    'Assistive technology compatibility – structure and core controls are accessible',
    async ({ page, storePage }) => {
      await test.step('Page main structure is accessible for assistive technology', async () => {
        // We should already be on /store2 thanks to the fixture, but we assert it explicitly
        await expect(page).toHaveURL(/store2/i);

        // Main content landmark (either <main> or role="main")
        const mainRegion = page.getByRole('main');
        await expect(mainRegion).toBeVisible();

        // Page should have a visible primary heading (h1)
        const heading1 = page.getByRole('heading', { level: 1 });
        await expect(heading1).toBeVisible();
      });

      await test.step('Form controls are visible and usable', async () => {
        const controls = [
          { locator: storePage.productSelect, name: 'product selector' },
          { locator: storePage.amountInput, name: 'amount input' },
          { locator: storePage.addToCartButton, name: '"Add to cart" button' },
        ];

        for (const control of controls) {
          await expect(control.locator).toBeVisible();
          await expect(control.locator).toBeEnabled();
        }

        // Ensure "Add to cart" button is correctly exposed as a button
        await expect(storePage.addToCartButton).toHaveRole('button');
      });
    }
  );
});
