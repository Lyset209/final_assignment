import { APIRequestContext, expect } from '@playwright/test';

export class Store2Api {
  // APIRequestContext is used to perform HTTP requests
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * measureResponseTimeMs():
   * Measures how long it takes to send a GET request to /store2/.
   * Returns the response time in milliseconds.
   */
  async measureResponseTimeMs(): Promise<number> {
    const start = Date.now();
    const response = await this.request.get('/store2/');
    const duration = Date.now() - start;

    // Ensure the API responded with a successful status
    await expect(response.status(), 'HTTP status should be 200').toBe(200);

    return duration;
  }
}
