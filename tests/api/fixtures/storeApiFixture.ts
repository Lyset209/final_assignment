import { test as base, expect, APIRequestContext } from '@playwright/test';
import { StoreApi } from '../../../api/storeApi';

type ApiFixtures = {
  apiRequestContext: APIRequestContext;
  storeApi: StoreApi;
};

export const test = base.extend<ApiFixtures>({
  // Shared APIRequestContext with base URL set for all API tests
  apiRequestContext: async ({ playwright }, use) => {
    const requestContext = await playwright.request.newContext({
      baseURL: 'https://hoff.is',
    });

    try {
      await use(requestContext);
    } finally {
      await requestContext.dispose();
    }
  },

  // StoreApi client built on top of the shared request context
  storeApi: async ({ apiRequestContext }, use) => {
    const storeApi = new StoreApi(apiRequestContext);
    await use(storeApi);
  },
});

export { expect };
