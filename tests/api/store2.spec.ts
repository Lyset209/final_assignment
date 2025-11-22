import { test, expect, APIRequestContext } from '@playwright/test';
import { Store2Api } from '../../api/store2Api';

test.describe('Store2 API', () => {
  // APIRequestContext is used to send HTTP requests in tests
  let requestContext: APIRequestContext;

  // Instance of our API POM that encapsulates logic for /store2/
  let store2Api: Store2Api;

  /**
   * beforeAll:
   * Runs once before all tests.
   * Creates a request context and initializes the API client.
   */
  test.beforeAll(async ({ playwright }) => {
    // Base URL is set here so we don't need to specify it for each request
    requestContext = await playwright.request.newContext({
      baseURL: 'https://hoff.is',
    });

    store2Api = new Store2Api(requestContext);
  });

  /**
   * afterAll:
   * Disposes the request context when testing is complete.
   */
  test.afterAll(async () => {
    await requestContext.dispose();
  });

  /**
   * Test: Verifies that the endpoint responds within 1000 ms.
   */
  test('GET /store2/ responds within an acceptable time', async () => {
    // test.step provides clearer structured logging in reports and Trace Viewer
    await test.step('Measure response time for /store2/', async () => {
      const durationMs = await store2Api.measureResponseTimeMs();

      expect(
        durationMs,
        `Response took too long: ${durationMs} ms`
      ).toBeLessThan(1000);
    });
  });
});
