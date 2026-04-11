import path from 'node:path';

import { defineConfig } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '..');
const backendWorkdir = path.join(repoRoot, 'backend');

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: 'http://127.0.0.1:3025',
    trace: 'retain-on-failure'
  },
  webServer: [
    {
      command:
        `cd ${backendWorkdir} && ` +
        `SPRING_PROFILES_ACTIVE=production ` +
        `DB_URL='jdbc:h2:file:./data/eungeum-prod-e2e;MODE=PostgreSQL;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1' ` +
        `DB_DRIVER=org.h2.Driver ` +
        `DB_USERNAME=sa ` +
        `DB_PASSWORD='' ` +
        `AUTH_PUBLIC_BASE_URL='http://127.0.0.1:3025' ` +
        `AUTH_ALLOWED_ORIGINS='http://127.0.0.1:3025,http://localhost:3025' ` +
        `AUTH_COOKIE_SECURE=false ` +
        `AUTH_TEST_LOGIN_ENABLED=true ` +
        `NAVER_CLIENT_ID='e2e-provider' ` +
        `java -jar target/backend-0.0.1-SNAPSHOT.jar`,
      url: 'http://127.0.0.1:8081/api/health',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 180_000
    },
    {
      command:
        'BACKEND_INTERNAL_URL=http://127.0.0.1:8081 PORT=3025 HOSTNAME=127.0.0.1 node .next/standalone/server.js',
      url: 'http://127.0.0.1:3025',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120_000
    }
  ]
});
