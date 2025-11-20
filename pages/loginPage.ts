import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

   // Initierar klassen och definierar UI-element på sidan.
  constructor(page: Page) {
    this.page = page;

    // Fält för användarnamn och lösenord
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });

    // Dropdown för rollval
    this.roleSelect = page.getByLabel('Select Role');

    // Login-knapp
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }


   //Navigerar till login-sidan och verifierar att sidan är redo.   
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/login/', { waitUntil: 'domcontentloaded' });

    // Säkerställ att sidan laddat korrekt genom att verifiera att username-fältet är synligt
    await expect(this.username).toBeVisible();
  }

  
   //Utför login-flödet genom att fylla i användarnamn, lösenord och roll.
  async login(username: string, password: string, role: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);

    // Säkerställ att rollalternativet finns innan val
    await expect(this.roleSelect).toBeEnabled();
    await this.roleSelect.selectOption(role);

    // Klicka på Login-knappen
    await this.loginButton.click();
  }
}