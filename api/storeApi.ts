import { APIRequestContext, expect } from '@playwright/test';

export class StoreApi {
  // Stores the Playwright API request context used for all HTTP calls
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    // Injected context allows reuse across multiple tests
    this.request = request;
  }

  /**
   * Sends a GET request to /store2/ and measures the total response time.
   * Ensures the endpoint returns HTTP 200 before returning the duration.
   */
  async measureResponseTimeMs(): Promise<number> {
    const start = Date.now();                        // Mark start time
    const response = await this.request.get('/store2/'); // Perform the API request
    const duration = Date.now() - start;             // Calculate elapsed time

    await expect(response.status(), 'Expected HTTP 200').toBe(200); // Validate status code

    return duration;                                  // Return measured time in ms
  }
}
