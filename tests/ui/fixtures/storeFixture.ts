import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { StorePage } from '../../../pages/storePage';
import { STORE_PASSWORD } from '../../config/env';
import { STORE_USER } from '../../config/testData';

type Fixtures = {
  storePage: StorePage;
};

export const test = base.extend<Fixtures>({
  storePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(STORE_USER.username, STORE_PASSWORD, STORE_USER.role);

    await expect(page).toHaveURL(/store2/i);

    const storePage = new StorePage(page);
    await use(storePage);
  },
});

export { expect };
