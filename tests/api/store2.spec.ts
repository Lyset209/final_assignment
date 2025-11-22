import { test, expect, APIRequestContext } from '@playwright/test';
import { Store2Api } from '../../api/store2Api';

test.describe('Store2 API', () => {
  // APIRequestContext används för att skicka HTTP-anrop i tester
  let requestContext: APIRequestContext;

  // Instans av vår API-POM som kapslar logiken för /store2/
  let store2Api: Store2Api;

  /**
   * beforeAll:
   * Körs en gång innan alla tester.
   * Skapar en ny request-context och instansierar vår API-klient.
   */
  test.beforeAll(async ({ playwright }) => {
    // Bas-URL sätts här så vi slipper ange den vid varje request
    requestContext = await playwright.request.newContext({
      baseURL: 'https://hoff.is',
    });

    store2Api = new Store2Api(requestContext);
  });

  /**
   * afterAll:
   * Stänger requestContext när testerna är klara.
   */
  test.afterAll(async () => {
    await requestContext.dispose();
  });

  /**
   * Test: Verifierar att endpointen svarar inom 1000 ms.
   */
  test('GET /store2/ svarar inom rimlig tid', async () => {
    // test.step gör testloggen mer strukturerad i rapporter och trace viewer
    await test.step('Mät svarstid för /store2/', async () => {
      const durationMs = await store2Api.measureResponseTimeMs();

      expect(
        durationMs,
        `Svaret tog för lång tid: ${durationMs} ms`
      ).toBeLessThan(1000);
    });
  });
});

