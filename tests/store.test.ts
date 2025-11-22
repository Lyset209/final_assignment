import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { Store2Page } from '../pages/store2Page';

// Testdata / konstanter
const USERNAME = 'markus';
const PASSWORD = 'sup3rs3cr3t';
const ROLE = 'consumer';
const VAT_RATE = 0.2;

// Data-drivna produkt-case
const productTestCases = [
  {
    id: '10',
    name: 'TV',
    quantity: 1,
  },
];

// Typ för fixtures
type Fixtures = {
  store2Page: Store2Page;
};

// Förläng Playwrights `test` med en fixture som loggar in och skapar Store2Page
const test = base.extend<Fixtures>({
  store2Page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Logga in en gång per test via fixture
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD, ROLE);

    // Om appen redirectar till store2 efter login kan vi verifiera det:
    await expect(page).toHaveURL(/store2/i);

    const store2Page = new Store2Page(page);

    // Om den INTE redirectar automatiskt kan du istället:
    // await store2Page.goto();

    // Gör Store2Page tillgänglig i testet
    await use(store2Page);
  },
});

// Vi kan fortfarande använda expect från base
// (inte strikt nödvändigt men tydligt)
const expectEx = expect;

// Data-drivet test: kör samma logik för varje produkt i productTestCases
for (const { id, name, quantity } of productTestCases) {
  test(`consumer kan lägga till ${name} och grandTotal är korrekt + priset matchar tabellen`, async ({
    page,
    store2Page,
  }) => {
    // --- 1. Lägg till produkt i kundvagnen ---
    await test.step(`Lägg till ${quantity} st ${name} i kundvagnen`, async () => {
      await store2Page.addProductToCart(id, quantity);
    });

    // --- 2. Hämta totalsummor ---
    const { totalSum, totalVAT, grandTotal } = await test.step(
      'Hämta totalsummor från kundvagnen',
      async () => {
        return await store2Page.getTotals();
      }
    );

    // --- 3. Verifiera att priset i tabellen matchar totalSum ---
    await test.step(`Verifiera att tabellpriset för ${name} matchar totalSum`, async () => {
      const tablePrice = await store2Page.getPriceFromTableByProductId(id);

      expectEx(
        totalSum,
        `totalSum (${totalSum}) borde matcha priset i tabellen (${tablePrice})`
      ).toBeCloseTo(tablePrice, 2);
    });

    // --- 4. Kontroll: VAT = 20% av totalSum 
    // Rimligt! Alla kunder på The Hoff Store kommer från Armenien eller Bulgarien där 20% moms är standard.
    // https://www.globalvatcompliance.com/globalvatnews/world-countries-vat-rates-2020/
    await test.step('Verifiera att totalVAT ≈ 20% av totalSum', async () => {
      const expectedVAT = totalSum * VAT_RATE;
      expectEx(
        totalVAT,
        `totalVAT (${totalVAT}) borde vara ~${VAT_RATE * 100}% av totalSum (${totalSum})`
      ).toBeCloseTo(expectedVAT, 2);
    });

    // --- 5. Kontroll: grandTotal = totalSum + totalVAT ---
    await test.step('Verifiera att grandTotal = totalSum + totalVAT', async () => {
      const expectedGrand = totalSum + totalVAT;
      expectEx(
        grandTotal,
        `grandTotal (${grandTotal}) borde vara totalSum + totalVAT (${totalSum} + ${totalVAT})`
      ).toBeCloseTo(expectedGrand, 2);
    });
  });
}

// --- Tillgänglighet: Kompatibilitet med hjälpmedel ---
test('Kompatibilitet med hjälpmedel – struktur och kontroller är anpassade för skärmläsare', async ({ page, store2Page }) => {
  await test.step('Sidan är laddad och huvudinnehåll kan hittas', async () => {
    await expect(page).toHaveURL(/store2/i);

    // Main-landmärke (antingen <main> eller role="main")
    const mainRegion = page.getByRole('main');
    await expect(mainRegion, 'Det bör finnas ett main-landmärke för huvudinnehållet').toBeVisible();

    // Minst en huvudrubrik (h1)
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1, 'Sidan bör ha en tydlig huvudrubrik (h1)').toBeVisible();
  });

  await test.step('Formulärets kontroller är synliga, fokusbara och rimligt märkta', async () => {
    // Produktväljare
    await expect(store2Page.productSelect, 'Produktväljaren ska vara synlig').toBeVisible();
    await expect(store2Page.productSelect, 'Produktväljaren ska gå att interagera med').toBeEnabled();

    // Amount-fält
    await expect(store2Page.amountInput, 'Amount-fältet ska vara synligt').toBeVisible();
    await expect(store2Page.amountInput, 'Amount-fältet ska gå att interagera med').toBeEnabled();

    // Add to cart-knappen
    await expect(store2Page.addToCartButton, '"Add to cart"-knappen ska vara synlig').toBeVisible();
    await expect(store2Page.addToCartButton, '"Add to cart"-knappen ska gå att interagera med').toBeEnabled();
    await expect(store2Page.addToCartButton, '"Add to cart"-knappen ska exponeras som en knapp').toHaveRole('button');
  });
});