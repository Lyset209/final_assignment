let pwd = process.env.STORE_PASSWORD;

if (!pwd) {
  throw new Error('STORE_PASSWORD environment variable is not set.');
}

export const STORE_PASSWORD: string = pwd;
