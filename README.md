# Final Assignment – Automated Test Suite (Playwright)

This project contains UI tests, API tests, Page Objects, and shared test configuration. The goal is to maintain a clean, scalable, and maintainable automation structure.

---

## 📁 Project Structure

```
final_assignment/
│
├── api/                    # API clients used by tests
│   └── storeApi.ts
│
├── pages/                  # Page Object Models (POMs) for UI tests
│   ├── loginPage.ts
│   └── storePage.ts
│
├── tests/
│   ├── config/             # Shared test config, test data, secrets
│   │   ├── env.ts
│   │   └── testData.ts
│   │
│   ├── api/
│   │   ├── fixtures/       # API-specific fixtures
│   │   │   └── storeApiFixture.ts
│   │   └── store.api.test.ts
│   │
│   └── ui/
│       ├── fixtures/       # UI-specific fixtures
│       │   └── storeFixture.ts
│       ├── login.test.ts
│       ├── store.a11y.test.ts
│       └── store.functional.test.ts
```

---

## 🔐 Environment Variables

The following environment variable **must be set** locally or in CI:

```
STORE_PASSWORD=<your secret password>
```

In GitHub Actions, configure it under:

```
Settings → Secrets → Actions → New Repository Secret
```

---

## 🧪 Running Tests

Run all tests:

```
npx playwright test
```

Run only UI tests:

```
npx playwright test tests/ui
```

Run only API tests:

```
npx playwright test tests/api
```

---

## 🧱 Fixtures

Fixtures are used to share setup logic:

### UI fixtures
`storeFixture.ts`:

- logs in using the shared test user & secret
- exposes `storePage` for UI tests

### API fixtures
`storeApiFixture.ts`:

- creates shared `APIRequestContext`
- exposes `storeApi`

This ensures no duplication in your test files.

---

## 🧩 Page Objects

Stored in `pages/`, following standard POM principles:

- `loginPage.ts`
- `storePage.ts`

---

## 📡 API Clients

Stored in `api/`, using Playwright's `APIRequestContext`.

---

## 📌 Summary

This structure ensures:

- Clean separation of UI & API layers  
- No duplicated login logic  
- Centralized secrets & test data  
- Professional maintainability & scalability  

Enjoy testing 🚀
