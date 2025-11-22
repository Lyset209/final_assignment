import { Page, Locator } from '@playwright/test';

export class StorePage {
  readonly page: Page;

  readonly productSelect: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;

  readonly totalSum: Locator;
  readonly totalVAT: Locator;
  readonly grandTotal: Locator;

  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productSelect = page.getByTestId('select-product');
    this.amountInput = page.getByRole('textbox', { name: 'Amount' });
    this.addToCartButton = page.getByTestId('add-to-cart-button');

    this.totalSum = page.locator('#totalSum');
    this.totalVAT = page.locator('#totalVAT');
    this.grandTotal = page.locator('#grandTotal');

    this.productList = page.locator('#productList');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/store2/');
  }

  async addProductToCart(productId: string, amount: number): Promise<void> {
    await this.productSelect.selectOption(productId);
    await this.amountInput.fill(String(amount));
    await this.addToCartButton.click();
  }

  private async parsePrice(loc: Locator): Promise<number> {
    const raw = (await loc.textContent()) ?? '';
    const normalized = raw.replace(/[^\d.,-]/g, '').replace(',', '.');
    const num = parseFloat(normalized);
    return Number.isNaN(num) ? 0 : num;
  }

  async getTotals() {
    return {
      totalSum: await this.parsePrice(this.totalSum),
      totalVAT: await this.parsePrice(this.totalVAT),
      grandTotal: await this.parsePrice(this.grandTotal),
    };
  }

  async getPriceFromTableByProductId(productId: string): Promise<number> {
    const option = this.productSelect.locator(`option[value="${productId}"]`);
    const productName = (await option.textContent())?.trim();

    if (!productName) {
      throw new Error(`No product found for productId=${productId}`);
    }

    const row = this.productList.locator('tr', { hasText: productName });
    await row.waitFor({ state: 'visible' });

    const cell = row.getByRole('cell').last();
    await cell.waitFor({ state: 'visible' });

    return this.parsePrice(cell);
  }
}
