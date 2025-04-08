import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // vite 相关配置
  server: {
    port: 80,
    host: true,
    open: true,
    proxy: {
      '/dev-api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, '')
      },
      '/prod-api': {
        target: 'http://14.103.226.91:8088',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/prod-api/, '')
      }
    }
  },
})
