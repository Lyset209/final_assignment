import { APIRequestContext, expect } from '@playwright/test';

export class Store2Api {
  // APIRequestContext används för att skicka HTTP-anrop
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * measureResponseTimeMs():
   * Mäter hur lång tid det tar att göra en GET-request till /store2/.
   * Returnerar svarstiden i millisekunder.
   */
  async measureResponseTimeMs(): Promise<number> {
    const start = Date.now();
    const response = await this.request.get('/store2/');
    const duration = Date.now() - start;

    // Säkerställ att API:t svarade korrekt
    await expect(response.status(), 'HTTP-status ska vara 200').toBe(200);

    return duration;
  }
}
