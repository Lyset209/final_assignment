import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Testfall: Verifierar att en användare med korrekta uppgifter kan logga in.
test('consumer can log in successfully', async ({ page }) => {
  const login = new LoginPage(page);

  // Steg: Navigera till login-sidan
  await test.step('Navigate to login page', async () => {
    await login.goto();
  });

  // Steg: Utför inloggning
  await test.step('Perform login as consumer', async () => {
    await login.login('markus', 'sup3rs3cr3t', 'consumer');
  });

  // Verifiera att användaren har navigerats till store-sidan
  await test.step('Verify successful login', async () => {
    await expect(page).toHaveURL(/\/store/i);
  });
});


// Testfall: Verifierar att ett felmeddelande visas vid felaktiga användaruppgifter.
test('shows an error with invalid credentials', async ({ page }) => {
  const login = new LoginPage(page);

  // Steg: Navigera till login-sidan
  await test.step('Navigate to login page', async () => {
    await login.goto();
  });

  // Steg: Försök logga in med ogiltiga uppgifter
  await test.step('Attempt login with invalid credentials', async () => {
    await login.login('markus', 'wrongpassword', 'consumer');
  });

  // Verifiera felmeddelande
  await test.step('Verify error message is displayed', async () => {
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Incorrect password');
  });
});
