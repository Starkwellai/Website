import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      // Legacy code-first API (utah_pricing/api.py) — Utah.tsx depends on it.
      // Left in place deliberately; it reads the pre-summary schema.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Serving API (api/serving_api.py) over the published price slice.
      // Rewritten so /serving/services hits :8001/api/services, which keeps
      // the two backends on separate paths without either one changing.
      '/serving': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/serving/, '/api'),
      },
    },
  },
})
