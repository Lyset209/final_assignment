import { APIRequestContext, expect } from '@playwright/test';

export class StoreApi {
  // Playwright API context used for all HTTP requests
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    // Store the injected request context for reuse
    this.request = request;
  }

  /**
   * Sends a GET request to /store2/ and measures the total response time.
   * Ensures the endpoint returns HTTP 200 before returning the duration.
   */
  async measureResponseTimeMs(): Promise<number> {
    const start = Date.now();                            // Capture the start time
    const response = await this.request.get('/store2/'); // Execute the API request
    const duration = Date.now() - start;                 // Calculate elapsed time

    await expect(response.status(), 'Expected HTTP 200').toBe(200); // Assert success status

    return duration;                                     // Return the elapsed time
  }

  /**
   * Fetches the list of products from the store API.
   * Tries to normalize different possible response shapes into a list of { id, name }.
   */
  async getProductList(): Promise<Array<{ id: number; name?: string }>> {
    const response = await this.request.get('/store2/api/v1/product/list');

    await expect(response.status(), 'Expected HTTP 200 from product list').toBe(200);

    const data = await response.json();

    // The exact shape is unknown, so we handle a few common patterns:
    // - [ { id, name, ... }, ... ]
    // - [ 1, 2, 3 ]
    // - { products: [ ... ] }
    let rawList: any = data;

    if (rawList && Array.isArray(rawList.products)) {
      rawList = rawList.products;
    }

    if (!Array.isArray(rawList)) {
      throw new Error(`Unexpected product list response shape: ${JSON.stringify(data)}`);
    }

    const products: Array<{ id: number; name?: string }> = [];

    for (const item of rawList) {
      if (typeof item === 'number') {
        products.push({ id: item });
      } else if (item && typeof item === 'object' && 'id' in item) {
        const idValue = (item as any).id;
        if (typeof idValue === 'number') {
          products.push({ id: idValue, name: (item as any).name });
        }
      }
    }

    if (products.length === 0) {
      throw new Error(`No valid products found in response: ${JSON.stringify(data)}`);
    }

    return products;
  }

  /**
   * Fetches the price for a specific product ID from the API.
   * Expects the API to return a JSON object with a numeric "price" field.
   */
  async getProductPrice(productId: number | string): Promise<number> {
    const id = String(productId);
    const response = await this.request.get(`/store2/api/v1/price/${id}`);

    await expect(
      response.status(),
      `Expected HTTP 200 when fetching price for product ${id}`
    ).toBe(200);

    const data = await response.json() as any;

    if (typeof data?.price !== 'number') {
      throw new Error(`Invalid price payload for product ${id}: ${JSON.stringify(data)}`);
    }

    return data.price;
  }
}
