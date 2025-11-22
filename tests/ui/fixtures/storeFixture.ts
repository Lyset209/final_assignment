import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { StorePage } from '../../../pages/storePage';
import { STORE_PASSWORD } from '../../config/env';
import { STORE_USER } from '../../config/testData';

type Fixtures = {
  // Exposes a logged-in StorePage instance to all tests that use this fixture
  storePage: StorePage;
};

export const test = base.extend<Fixtures>({
  // Automatically logs in before each test and provides a ready StorePage
  storePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto(); // Navigate to the login page
    await loginPage.login(   // Log in using shared test credentials
      STORE_USER.username,
      STORE_PASSWORD,
      STORE_USER.role
    );

    await expect(page).toHaveURL(/store2/i); // Confirm successful redirect to the store

    const storePage = new StorePage(page); // Create StorePage POM instance
    await use(storePage);                  // Make it available to the test
  },
});

// Re-export expect so tests using this fixture can import from a single source
export { expect };
