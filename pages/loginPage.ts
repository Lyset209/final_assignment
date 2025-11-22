import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

  // Initializes the class and defines the UI elements on the page.
  constructor(page: Page) {
    this.page = page;

    // Username and password fields
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });

    // Dropdown for role selection
    this.roleSelect = page.getByLabel('Select Role');

    // Login button
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  // Navigates to the login page and verifies that the page is ready.
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/login/', { waitUntil: 'domcontentloaded' });

    // Ensure that the page loaded correctly by verifying that the username field is visible
    await expect(this.username).toBeVisible();
  }

  // Performs the login flow by filling in username, password and selecting a role.
  async login(username: string, password: string, role: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);

    // Ensure the role dropdown is enabled before selecting
    await expect(this.roleSelect).toBeEnabled();
    await this.roleSelect.selectOption(role);

    // Click the login button
    await this.loginButton.click();
  }
}
