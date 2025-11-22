import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Read password from environment (GitHub Secret: STORE_PASSWORD)
const VALID_PASSWORD = process.env.STORE_PASSWORD;
if (!VALID_PASSWORD) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

// Test data / constants
const VALID_USERNAME = 'Johan';
const ROLE = 'consumer';

// Types
type LoginCredentials = {
  username: string;
  password: string;
  role: string;
  description: string;
  shouldSucceed: boolean;
};

type Fixtures = {
  loginPage: LoginPage;
  loginWith: (credentials: LoginCredentials) => Promise<void>;
};

// Extend Playwright’s test with fixtures for LoginPage and a login helper
const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  loginWith: async ({ loginPage }, use) => {
    const fn = async (credentials: LoginCredentials) => {
      await loginPage.goto();
      await loginPage.login(credentials.username, credentials.password, credentials.role);
    };

    await use(fn);
  },
});

// Data-driven login scenarios
const loginScenarios: LoginCredentials[] = [
  {
    description: 'valid username and valid password',
    username: VALID_USERNAME,
    password: VALID_PASSWORD,
    role: ROLE,
    shouldSucceed: true,
  },
  {
    description: 'valid username and wrong password',
    username: VALID_USERNAME,
    password: 'wrong_password',
    role: ROLE,
    shouldSucceed: false,
  },
  {
    description: 'empty password',
    username: VALID_USERNAME,
    password: '',
    role: ROLE,
    shouldSucceed: false,
  },
];

// Data-driven tests
for (const scenario of loginScenarios) {
  test(`login behavior – ${scenario.description}`, async ({ page, loginWith }) => {

    await test.step(`Attempt login with: ${scenario.description}`, async () => {
      await loginWith(scenario);
    });

    if (scenario.shouldSucceed) {
      await test.step('Verify successful login', async () => {
        await expect(page).toHaveURL(/\/store/i);
      });
    } else {
      await test.step('Verify error message is displayed', async () => {
        const errorMessage = page.getByTestId('error-message');
        await expect(errorMessage).toBeVisible();

        if (scenario.description === 'empty password') {
          await expect(errorMessage).toContainText('Please fill in all fields.');
        } else {
          await expect(errorMessage).toContainText('Incorrect password');
        }

        await expect(page).toHaveURL(/\/login/i);
      });
    }
  });
}
