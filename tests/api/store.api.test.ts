import { test, expect } from './fixtures/storeApiFixture';

// Threshold in milliseconds for acceptable response time
const RESPONSE_THRESHOLD_MS = 1000;

test.describe('Store API', () => {
  test('GET /store2/ responds within an acceptable time', async ({ storeApi }) => {
    await test.step('Measure response time for /store2/', async () => {
      const durationMs = await storeApi.measureResponseTimeMs();

      expect(
        durationMs,
        `Response took too long: ${durationMs} ms`
      ).toBeLessThan(RESPONSE_THRESHOLD_MS);
    });
  });
});
