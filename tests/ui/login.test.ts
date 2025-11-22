import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { STORE_PASSWORD } from '../config/env';
import { TEST_USER } from '../config/testData';

// Fixture type: exposes a LoginPage instance to the tests
type Fixtures = {
  loginPage: LoginPage;
};

// Extend Playwright's test with a fixture that creates a LoginPage POM
const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    // Provide a fresh LoginPage instance to each test
    await use(new LoginPage(page));
  },
});

// --- Valid login scenario ---
test('user can log in successfully', async ({ page, loginPage }) => {
  await loginPage.goto(); // Navigate to the login page

  // Perform login using valid credentials from shared test data
  await loginPage.login(TEST_USER.username, STORE_PASSWORD, TEST_USER.role);

  // Verify successful navigation to the store page
  await expect(page).toHaveURL(/\/store/i);
});

// --- Invalid login scenario ---
test('invalid credentials show error', async ({ page, loginPage }) => {
  await loginPage.goto(); // Load login view

  // Attempt login with a wrong password
  await loginPage.login(TEST_USER.username, 'wrong_password', TEST_USER.role);

  // Validate that an error message is shown
  const error = page.getByTestId('error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Incorrect password');

  // Ensure the user stays on the login page
  await expect(page).toHaveURL(/\/login/i);
});
