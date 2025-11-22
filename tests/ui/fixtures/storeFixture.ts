import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { StorePage } from '../../../pages/storePage';

const PASSWORD = process.env.STORE_PASSWORD;
if (!PASSWORD) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

const USERNAME = 'Johan';
const ROLE = 'consumer';

type Fixtures = {
  storePage: StorePage;
};

export const test = base.extend<Fixtures>({
  storePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD, ROLE);

    await expect(page).toHaveURL(/store2/i);

    const storePage = new StorePage(page);
    await use(storePage);
  },
});

export { expect };
