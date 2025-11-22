import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Test data / constants
const USERNAME = 'Johan';
const PASSWORD = 'sup3rs3cr3t';
const ROLE = 'consumer';

// Type for fixtures
type Fixtures = {
  loginPage: LoginPage;
};

// Extend Playwright’s test with a fixture that provides LoginPage
const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

// Test: verifies that a user with correct credentials can log in successfully
test('user can log in successfully', async ({ page, loginPage }) => {
  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
  });

  await test.step('Log in with valid credentials', async () => {
    await loginPage.login(USERNAME, PASSWORD, ROLE);
  });

  await test.step('Verify successful login', async () => {
    await expect(page).toHaveURL(/\/store/i);
  });
});

// Test: verifies that an error message is shown when using invalid credentials
test('displays an error message for invalid credentials', async ({ page, loginPage }) => {
  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
  });

  await test.step('Attempt login with invalid credentials', async () => {
    await loginPage.login(USERNAME, 'wrong_password', ROLE);
  });

  await test.step('Verify error message is displayed', async () => {
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Incorrect password');
  });
});
