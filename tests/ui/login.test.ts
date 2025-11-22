import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { STORE_PASSWORD } from '../config/env';
import { LOGIN_USER } from '../config/testData';

type Fixtures = {
  loginPage: LoginPage;
};

const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// Valid login
test('user can log in successfully', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(LOGIN_USER.username, STORE_PASSWORD, LOGIN_USER.role);
  await expect(page).toHaveURL(/\/store/i);
});

// Invalid login
test('invalid credentials show error', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(LOGIN_USER.username, 'wrong_password', LOGIN_USER.role);

  const error = page.getByTestId('error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Incorrect password');

  await expect(page).toHaveURL(/\/login/i);
});
