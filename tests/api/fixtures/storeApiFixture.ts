import { test as base, expect, APIRequestContext } from '@playwright/test';
import { StoreApi } from '../../../api/storeApi';
import { BASE_URL } from '../../config/testData';

type ApiFixtures = {
  apiRequestContext: APIRequestContext; // Shared API request context for all API calls
  storeApi: StoreApi;                   // API client wrapper for the Store endpoints
};

export const test = base.extend<ApiFixtures>({
  // Creates a reusable APIRequestContext with the correct base URL
  apiRequestContext: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: BASE_URL });

    try {
      await use(ctx);        // Expose the context to the test
    } finally {
      await ctx.dispose();   // Clean up after tests finish
    }
  },

  // Provides an instance of StoreApi built on top of the request context
  storeApi: async ({ apiRequestContext }, use) => {
    const api = new StoreApi(apiRequestContext);
    await use(api); // Make the API client available to the test
  },
});

// Re-export expect so tests can import from this fixture file only
export { expect };
