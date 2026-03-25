import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  optimizeDeps: {
    exclude: ['coolprop-wasm']
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('plotly.js-basic-dist-min')) return 'plotly';
          if (id.includes('html2canvas') || id.includes('jspdf')) return 'pdf-export';
          if (id.includes('coolprop-wasm')) return 'coolprop';
          if (id.includes('katex')) return 'katex';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
})
