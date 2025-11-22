import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the /store2/ page.
 * Encapsulates all interaction with the product table, cart, and total values.
 */
export class Store2Page {
  readonly page: Page;

  // Locators for form interaction
  readonly productSelect: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;

  // Locators for totals
  readonly totalSum: Locator;
  readonly totalVAT: Locator;
  readonly grandTotal: Locator;

  // Locator for the product table
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product selector (dropdown)
    this.productSelect = page.getByTestId('select-product');

    // Amount input field
    this.amountInput = page.getByRole('textbox', { name: 'Amount' });

    // Add-to-cart button
    this.addToCartButton = page.getByTestId('add-to-cart-button');

    // Total values
    this.totalSum = page.locator('#totalSum');
    this.totalVAT = page.locator('#totalVAT');
    this.grandTotal = page.locator('#grandTotal');

    // Product table further down the page
    this.productList = page.locator('#productList');
  }

  /**
   * Navigates to the Store2 page.
   * Useful if login does not automatically redirect.
   */
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/store2/');
  }

  // Adds a product to the cart based on its productId.
  async addProductToCart(productId: string, amount: number): Promise<void> {
    await this.productSelect.selectOption(productId);
    await this.amountInput.fill(String(amount));
    await this.addToCartButton.click();
  }

  /**
   * Helper method for extracting a numeric price from a locator.
   * Removes currency symbols and non-numeric characters, supports both . and , as decimals.
   */
  private async parsePrice(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? '';
    const numeric = text
      .replace(/[^\d.,-]/g, '') // remove everything except digits, dot, comma, minus
      .replace(',', '.');       // normalize comma to dot

    const value = parseFloat(numeric || '0');
    return Number.isNaN(value) ? 0 : value;
  }

  /**
   * Retrieves the total values (sum, VAT, grand total) from the page as numbers.
   */
  async getTotals(): Promise<{
    totalSum: number;
    totalVAT: number;
    grandTotal: number;
  }> {
    const totalSum = await this.parsePrice(this.totalSum);
    const totalVAT = await this.parsePrice(this.totalVAT);
    const grandTotal = await this.parsePrice(this.grandTotal);

    return { totalSum, totalVAT, grandTotal };
  }

  // Retrieves the product price from the product table (#productList) based on productId.
  async getPriceFromTableByProductId(productId: string): Promise<number> {
    // 1. Get the option element for the productId and its text (the product name)
    const option = this.productSelect.locator(`option[value="${productId}"]`);
    const productName = (await option.textContent())?.trim();

    if (!productName) {
      throw new Error(`Could not find a product name for productId=${productId}`);
    }

    // 2. Locate the table row containing the product name
    const row = this.productList.locator('tr', { hasText: productName });

    // Ensure the row exists and is visible
    await row.waitFor({ state: 'visible' });

    // 3. Assume the price is in the last cell of the row
    const priceCell = row.getByRole('cell').last();
    await priceCell.waitFor({ state: 'visible' });

    // Apply the same parsing logic used for totals
    const priceText = (await priceCell.textContent()) ?? '';
    const normalized = priceText
      .replace(/[^\d.,-]/g, '')
      .replace(',', '.');

    const price = parseFloat(normalized || '0');
    return Number.isNaN(price) ? 0 : price;
  }
}
