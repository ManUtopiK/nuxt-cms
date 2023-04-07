/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  test: {
    globals: true,
    environment: 'jsdom', //'happy-dom',
  },
  resolve: {
    alias: {
      '#build/components.client': resolve(__dirname, '../../apps/playground-editor/.nuxt/components.d.ts')
    }
  }
})
