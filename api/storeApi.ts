import { APIRequestContext, expect } from '@playwright/test';

export class StoreApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Measures how long it takes to send a GET request to /store2/.
   * Returns duration in milliseconds.
   */
  async measureResponseTimeMs(): Promise<number> {
    const start = Date.now();
    const response = await this.request.get('/store2/');
    const duration = Date.now() - start;

    await expect(response.status(), 'Expected HTTP 200').toBe(200);

    return duration;
  }
}