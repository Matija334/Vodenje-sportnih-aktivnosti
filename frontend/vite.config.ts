import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8'
    },
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/setupTest.ts']
  },
})
  