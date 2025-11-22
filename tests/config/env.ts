// Read the password from the environment (GitHub Secret: STORE_PASSWORD)
let pwd = process.env.STORE_PASSWORD;

// If the variable is missing, throw a friendly, actionable error
if (!pwd) {
  const isCi = process.env.CI === 'true';

  const helpMessage = isCi
    ? [
        'STORE_PASSWORD environment variable is not set.',
        '',
        'You are running in CI (e.g. GitHub Actions).',
        'Make sure you have added STORE_PASSWORD as a repository secret:',
        '  Settings → Secrets and variables → Actions → New repository secret',
      ].join('\n')
    : [
        'STORE_PASSWORD environment variable is not set.',
        '',
        'You are running tests locally.',
        'Set STORE_PASSWORD in your environment before running tests. Examples:',
        '',
        '  # macOS / Linux (bash)',
        '  export STORE_PASSWORD="your-password-here"',
        '',
        '  # Windows PowerShell',
        '  $env:STORE_PASSWORD="your-password-here"',
        '',
        'Or create a .env file and load it with dotenv / dotenv-cli.',
      ].join('\n');

  throw new Error(helpMessage);
}

// Export as a guaranteed string for use across the test suite
export const STORE_PASSWORD: string = pwd;
