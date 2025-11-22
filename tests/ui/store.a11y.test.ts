import { test, expect } from './fixtures/storeFixture';

test.describe('Store – accessibility', () => {
  test('structure and controls accessible', async ({ page, storePage }) => {
    await expect(page).toHaveURL(/store2/i);

    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    const controls = [
      storePage.productSelect,
      storePage.amountInput,
      storePage.addToCartButton,
    ];

    for (const ctrl of controls) {
      await expect(ctrl).toBeVisible();
      await expect(ctrl).toBeEnabled();
    }

    await expect(storePage.addToCartButton).toHaveRole('button');
  });
});
