import path from 'node:path';

import { defineConfig } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '..');
const backendWorkdir = path.join(repoRoot, 'backend');
const mavenUserHome = path.join(repoRoot, '.m2home');

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
      command: `cd ${backendWorkdir} && SPRING_PROFILES_ACTIVE=local MAVEN_USER_HOME=${mavenUserHome} ./mvnw spring-boot:run`,
      url: 'http://127.0.0.1:8081/api/health',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 180_000
    },
    {
      command: 'npm run dev -- --port 3025',
      url: 'http://127.0.0.1:3025',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120_000
    }
  ]
});
