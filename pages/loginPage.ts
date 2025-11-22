import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.roleSelect = page.getByLabel('Select Role');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/login/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(this.username).toBeVisible();
  }

  async login(username: string, password: string, role: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);

    await expect(this.roleSelect).toBeEnabled();
    await this.roleSelect.selectOption(role);

    await this.loginButton.click();
  }
}
