import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: '@nuxt-themes/elements',

  modules: [
    '@nuxt/devtools-ui-kit',
    '@nuxt/devtools',
    'nuxt-monaco-editor',
    '@nuxt/content',
    '../../modules/nuxt-cms',
    '../../components/nuxt-content-editor',
  ],

  nuxtCms: {
    devSource: 'local'
  },

  // nitro: {
  //   rootDir: resolve(__dirname, '..'),
  // },

  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts'),
  },
  alias: {
    '@nuxt/devtools-kit/iframe-client': resolve(__dirname, './stub/iframe-client.ts'),
  },
})
