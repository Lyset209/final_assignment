import { Page, Locator } from '@playwright/test';

export class StorePage {
  // Reference to the Playwright Page instance
  readonly page: Page;

  // Form controls for selecting a product and adding it to the cart
  readonly productSelect: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;

  // Cart summary fields displayed after adding items
  readonly totalSum: Locator;
  readonly totalVAT: Locator;
  readonly grandTotal: Locator;

  // Table listing all available products and their prices
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;

    // UI locators for interacting with the product form
    this.productSelect = page.getByTestId('select-product');
    this.amountInput = page.getByRole('textbox', { name: 'Amount' });
    this.addToCartButton = page.getByTestId('add-to-cart-button');

    // Locators for the calculated totals displayed on the page
    this.totalSum = page.locator('#totalSum');
    this.totalVAT = page.locator('#totalVAT');
    this.grandTotal = page.locator('#grandTotal');

    // Locator for the product table shown on the page
    this.productList = page.locator('#productList');
  }

  // Navigates directly to the Store page
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/store2/');
  }

  // Adds a product to the shopping cart using its product ID and a specified amount
  async addProductToCart(productId: string, amount: number): Promise<void> {
    await this.productSelect.selectOption(productId);
    await this.amountInput.fill(String(amount));
    await this.addToCartButton.click();
  }

  // Converts text from a price cell into a clean numeric value
  private async parsePrice(loc: Locator): Promise<number> {
    const raw = (await loc.textContent()) ?? '';                 // Extract text
    const normalized = raw.replace(/[^\d.,-]/g, '').replace(',', '.'); // Remove currency symbols etc.
    const num = parseFloat(normalized);
    return Number.isNaN(num) ? 0 : num;                          // Fallback to 0 for safety
  }

  // Reads and parses all total-related fields from the UI
  async getTotals() {
    return {
      totalSum: await this.parsePrice(this.totalSum),
      totalVAT: await this.parsePrice(this.totalVAT),
      grandTotal: await this.parsePrice(this.grandTotal),
    };
  }

  // Retrieves the price from the product table that matches a given product ID
  async getPriceFromTableByProductId(productId: string): Promise<number> {
    // Find the <option> for this product to extract its name
    const option = this.productSelect.locator(`option[value="${productId}"]`);
    const productName = (await option.textContent())?.trim();

    if (!productName) {
      throw new Error(`No product found for productId=${productId}`);
    }

    // Locate the row in the table that contains the product name
    const row = this.productList.locator('tr', { hasText: productName });
    await row.waitFor({ state: 'visible' });

    // Price is expected to be in the last cell of the row
    const cell = row.getByRole('cell').last();
    await cell.waitFor({ state: 'visible' });

    // Parse the cell text into a number
    return this.parsePrice(cell);
  }
}
