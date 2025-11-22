import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // References to the Playwright Page and the UI elements used on the login screen
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Input fields and controls located using accessible roles and labels
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.roleSelect = page.getByLabel('Select Role');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  // Navigates to the login page and verifies that the page has loaded correctly
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/login/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(this.username).toBeVisible(); // Ensures page is ready for interaction
  }

  // Executes the login flow by filling in credentials and selecting the user role
  async login(username: string, password: string, role: string): Promise<void> {
    await this.username.fill(username);  // Enter username
    await this.password.fill(password);  // Enter password

    await expect(this.roleSelect).toBeEnabled(); // Ensure dropdown is usable
    await this.roleSelect.selectOption(role);    // Choose specified role

    await this.loginButton.click(); // Submit login
  }
}
