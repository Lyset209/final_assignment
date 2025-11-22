import { test, expect } from './fixtures/storeFixture';

test.describe('Store – accessibility', () => {
  test('structure and controls accessible', async ({ page, storePage }) => {
    // Confirm that the user is on the correct page after fixture login
    await expect(page).toHaveURL(/store2/i);

    // The main landmark helps screen readers identify primary page content
    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    // A visible H1 heading provides structure and context for assistive tools
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Core interactive controls that must be accessible and usable
    const controls = [
      storePage.productSelect,
      storePage.amountInput,
      storePage.addToCartButton,
    ];

    // Validate that each control is visible and interactive for keyboard/AT users
    for (const ctrl of controls) {
      await expect(ctrl).toBeVisible();
      await expect(ctrl).toBeEnabled();
    }

    // Ensure the add-to-cart button is exposed with the correct ARIA role
    await expect(storePage.addToCartButton).toHaveRole('button');
  });
});
