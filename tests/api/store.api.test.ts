import { test, expect } from './fixtures/storeApiFixture';

const RESPONSE_THRESHOLD_MS = 1000;

test.describe('Store API', () => {
  test('GET /store2/ responds within acceptable time', async ({ storeApi }) => {
    await test.step('Measure response time for /store2/', async () => {
      const duration = await storeApi.measureResponseTimeMs();
      expect(duration).toBeLessThan(RESPONSE_THRESHOLD_MS);
    });
  });
});
