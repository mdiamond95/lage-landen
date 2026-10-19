import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 400, height: 860 },
    contextOptions: { reducedMotion: 'reduce' },
    // Cloud sandboxes ship their own Chromium; locally Playwright uses its download.
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: { command: 'npm run build && npx vite preview --port 4173', port: 4173, reuseExistingServer: true },
})
