import { test, expect } from './fixtures/storeApiFixture';

// Maximum allowed response time in milliseconds for the API call
const RESPONSE_THRESHOLD_MS = 1000;

test.describe('Store API', () => {
  test('GET /store2/ responds within acceptable time', async ({ storeApi }) => {

    // Measure how long the request takes and ensure it stays under the threshold
    await test.step('Measure response time for /store2/', async () => {
      const duration = await storeApi.measureResponseTimeMs();

      // Assert that the API endpoint responds quickly enough
      expect(duration).toBeLessThan(RESPONSE_THRESHOLD_MS);
    });
  });
});
