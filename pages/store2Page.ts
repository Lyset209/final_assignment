import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model för /store2/-sidan.
 * Kapslar all interaktion med produkttabell, kundvagn och totalsummor.
 */
export class Store2Page {
  readonly page: Page;

  // Locators för interaktion med formuläret
  readonly productSelect: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;

  // Locators för totalsummor
  readonly totalSum: Locator;
  readonly totalVAT: Locator;
  readonly grandTotal: Locator;

  // Locator för produkttabellen
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;

    // Produktval (select)
    this.productSelect = page.getByTestId('select-product');

    // Antalsfält
    this.amountInput = page.getByRole('textbox', { name: 'Amount' });

    // "Lägg till i kundvagn"-knapp
    this.addToCartButton = page.getByTestId('add-to-cart-button');

    // Totalsummor
    this.totalSum = page.locator('#totalSum');
    this.totalVAT = page.locator('#totalVAT');
    this.grandTotal = page.locator('#grandTotal');

    // Produkttabell längre ner på sidan
    this.productList = page.locator('#productList');
  }

  /**
   * Navigerar till Store2-sidan.
   * Kan användas om login inte redirectar automatiskt.
   */
  async goto(): Promise<void> {
    await this.page.goto('https://hoff.is/store2/');
  }

   //Lägger till en produkt i kundvagnen baserat på productId.
  async addProductToCart(productId: string, amount: number): Promise<void> {
    await this.productSelect.selectOption(productId);
    await this.amountInput.fill(String(amount));
    await this.addToCartButton.click();
  }

  /**
   * Hjälpmetod för att extrahera ett numeriskt pris från en locator.
   * Tar bort valutasymboler och andra icke-siffror, hanterar både . och , som decimaltecken.
   */
  private async parsePrice(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? '';
    const numeric = text
      .replace(/[^\d.,-]/g, '') // ta bort allt utom siffror, punkt, komma, minus
      .replace(',', '.');       // normalisera komma till punkt

    const value = parseFloat(numeric || '0');
    return Number.isNaN(value) ? 0 : value;
  }

  /**
   * Hämtar totalsummorna från sidan som numeriska värden.
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

   //Hämtar produktens pris från tabellen (#productList) baserat på productId.
  async getPriceFromTableByProductId(productId: string): Promise<number> {
    // 1. Hämta optionen för productId och dess text (produktnamnet)
    const option = this.productSelect.locator(`option[value="${productId}"]`);
    const productName = (await option.textContent())?.trim();

    if (!productName) {
      throw new Error(`Kunde inte hitta produktnamn för productId=${productId}`);
    }

    // 2. Hitta tabellrad som innehåller produktnamnet
    const row = this.productList.locator('tr', { hasText: productName });

    // Säkerställ att raden finns och är synlig
    await row.waitFor({ state: 'visible' });

    // 3. Pris antas ligga i sista cellen i raden
    const priceCell = row.getByRole('cell').last();
    await priceCell.waitFor({ state: 'visible' });

    // Använd samma parse-logik som för totalsummor
    const priceText = (await priceCell.textContent()) ?? '';
    const normalized = priceText
      .replace(/[^\d.,-]/g, '')
      .replace(',', '.');

    const price = parseFloat(normalized || '0');
    return Number.isNaN(price) ? 0 : price;
  }
}
