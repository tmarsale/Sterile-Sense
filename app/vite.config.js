import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// The sample data lives in ../data (shared with scripts/), so allow Vite to
// serve files from the repository root and give it a short import alias.
const dataDir = fileURLToPath(new URL('../data', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@data': dataDir },
  },
  server: {
    fs: { allow: ['..'] },
  },
})
