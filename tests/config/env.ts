// Read the password from the environment (GitHub Secret: STORE_PASSWORD)
let pwd = process.env.STORE_PASSWORD;

// Ensure the variable exists — fail fast if missing
if (!pwd) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

// Export as a guaranteed string for use across the test suite
export const STORE_PASSWORD: string = pwd;
