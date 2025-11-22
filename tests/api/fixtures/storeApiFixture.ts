import { test as base, expect, APIRequestContext } from '@playwright/test';
import { StoreApi } from '../../../api/storeApi';
import { BASE_URL } from '../../config/testData';

type ApiFixtures = {
  apiRequestContext: APIRequestContext;
  storeApi: StoreApi;
};

export const test = base.extend<ApiFixtures>({
  apiRequestContext: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: BASE_URL });

    try {
      await use(ctx);
    } finally {
      await ctx.dispose();
    }
  },

  storeApi: async ({ apiRequestContext }, use) => {
    const api = new StoreApi(apiRequestContext);
    await use(api);
  },
});

export { expect };
