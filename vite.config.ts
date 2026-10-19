/// <reference types="vitest/config" />
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Writes sw.js next to the build, listing every file it produced (and the files from
// public/) so the service worker can save the whole app for offline use.
const serviceWorker = (): Plugin => ({
  name: 'lage-landen-service-worker',
  apply: 'build',
  writeBundle(options, bundle) {
    const publicFiles = ['manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']
    const files = ['./', ...[...Object.keys(bundle), ...publicFiles].filter((f) => f !== 'index.html').map((f) => `./${f}`)]
    const version = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 12)
    const source = readFileSync(join(import.meta.dirname, 'scripts/sw.js'), 'utf8')
      .replace('__VERSION__', version)
      .replace('__FILES__', JSON.stringify(files))
    writeFileSync(join(options.dir!, 'sw.js'), source)
  },
})

// `npm run build:single` bundles everything into one HTML file for previews.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react(), serviceWorker()],
  test: {
    include: ['src/**/*.test.ts'],
  },
}))
