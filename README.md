
# Final Assignment – Playwright Test Suite

This project contains a complete UI + API automation setup using **Playwright**, structured for maintainability, scalability, and CI integration.

It includes:

- API tests  
- Functional UI tests  
- Accessibility tests  
- Login tests  
- Pre-run script to generate dynamic product data  
- Page Object Model (POM) structure  
- Fixtures for shared setup  
- Parameterized & parallel test execution  

---

# 📁 Project Structure

```
final_assignment/
│
├── api/
│   └── storeApi.ts
│
├── pages/
│   ├── loginPage.ts
│   └── storePage.ts
│
├── scripts/
│   └── generateProducts.mjs
│
├── tests/
│   ├── api/
│   │   ├── fixtures/
│   │   │   └── storeApiFixture.ts
│   │   └── store.api.test.ts
│   │
│   ├── ui/
│   │   ├── fixtures/
│   │   │   └── storeFixture.ts
│   │   ├── login.test.ts
│   │   ├── store.functional.test.ts
│   │   └── store.a11y.test.ts
│   │
│   └── config/
│       ├── env.ts
│       ├── testData.ts
│       └── generatedProducts.ts   (auto-generated)
│
└── playwright.config.ts
```

---

# ⚙️ Pre-Run Script – Dynamic Product Generation

The test suite retrieves **the latest product list from the live API** before Playwright starts.

The script:

```
scripts/generateProducts.mjs
```

Fetches:

```
GET https://hoff.is/store2/api/v1/product/list
```

Then writes the result to:

```
tests/config/generatedProducts.ts
```

This enables fully dynamic parameterized tests driven by real data.

### ✔ Automatic execution

Using `pretest` in `package.json`:

```json
{
  "scripts": {
    "pretest": "node scripts/generateProducts.mjs",
    "test": "playwright test"
  }
}
```

This ensures the script runs **before every test run**, both locally and in CI.

---

# 🔐 Required Environment Variables

| Variable | Required? | Description |
|----------|-----------|-------------|
| `STORE_PASSWORD` | ✔ Yes | Password used for UI login tests |

### Set locally (PowerShell):

```powershell
$env:STORE_PASSWORD="your_password"
```

### Remove locally:

```powershell
Remove-Item Env:STORE_PASSWORD
```

### Usage in CI:

```yaml
env:
  STORE_PASSWORD: ${{ secrets.STORE_PASSWORD }}
```

---

# 💻 Running Tests Locally

1. Install dependencies:

```bash
npm install
```

2. Set the required environment variable:

```bash
export STORE_PASSWORD="your_password"
```

3. Run the complete test suite:

```bash
npm test
```

This runs:

1. Pre-run script to generate product list  
2. Playwright UI & API tests  

---

# 🤖 GitHub Actions CI

Minimal working CI configuration:

```yaml
name: Playwright Tests

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          STORE_PASSWORD: ${{ secrets.STORE_PASSWORD }}
```

No extra CI steps are required — the generator runs automatically.

---

# 🧱 Test Types & Structure

## ✔ Login Tests (`tests/ui/login.test.ts`)

Covers:

- Valid login  
- Invalid login  
- Error messages  
- URL verification  

Uses the **LoginPage** POM.

---

## ✔ Functional Store Tests (`tests/ui/store.functional.test.ts`)

Parameterized with **generated product list**.

For each product:

- Add product to cart  
- Validate total sum  
- Validate VAT  
- Validate grand total  

Uses:

- `storeFixture` for logged-in StorePage  
- `GENERATED_PRODUCTS` from dynamic pre-run script  

---

## ✔ Accessibility Tests (`tests/ui/store.a11y.test.ts`)

Validates:

- `<main>` landmark  
- Heading structure (H1)  
- Visibility and accessibility of core controls  
- Button roles  

Ensures the UI is compatible with screen readers.

---

## ✔ API Tests (`tests/api/store.api.test.ts`)

Includes:

- Response time monitoring  
- Parameterized cross-check of API product price vs UI calculated total  
- Full-store coverage using generated product list  

---

# 🧩 Fixtures

Fixtures simplify repetitive setup logic:

## UI Fixture (`tests/ui/fixtures/storeFixture.ts`)

- Logs in using POM  
- Provides `storePage` to tests  
- Keeps tests clean and declarative  

## API Fixture (`tests/api/fixtures/storeApiFixture.ts`)

- Creates request context  
- Provides `storeApi`  
- Ensures proper cleanup  

---

# 🧱 Page Objects (POM)

## LoginPage

ℹ Encapsulates login page interactions  
Includes:

- Username  
- Password  
- Role select  
- Login button  
- `goto()` and `login()` helpers  

## StorePage

ℹ Full representation of the store UI:

- Product selector  
- Amount input  
- Add to cart  
- Total fields  
- Product table parsing  
- Data normalization helpers  

---

# 🚀 Parallelism & Parameterization

The suite uses:

```ts
test.describe.parallel(...)
```

And static test generation:

```ts
GENERATED_PRODUCTS.forEach(product => {
  test(...)
})
```

This results in:

- One test per product  
- Clear reporting  
- Faster CI execution  
- Better isolation  

---

# 🛠 Debugging Tips

### Open Playwright UI mode:

```bash
npx playwright test --ui
```

### Run only one test file:

```bash
npx playwright test tests/ui/store.functional.test.ts
```

### Enable trace viewer:

```bash
npx playwright test --trace on
```

---

# ✔ Summary

This project demonstrates a modern, professional Playwright test architecture:

- Dynamic test data generation using a pre-run script  
- Hybrid UI + API validation  
- Page Object Model  
- Strong TypeScript usage  
- Fixtures for clean tests  
- Parallel execution  
- GitHub Actions CI support  

It is built to be **maintainable, scalable, and reviewer-friendly**.

---

