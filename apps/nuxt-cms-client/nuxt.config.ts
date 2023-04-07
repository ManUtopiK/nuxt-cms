import { defineNuxtConfig } from 'nuxt/config'
import { ROUTE_CLIENT } from '../../modules/git-connect/src/constant'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(() => {
  const isDev = process.env.NODE_ENV === 'development'

  const nuxtCms = !isDev ? undefined : {
    mode: 'standalone',
    remote: {
      api: 'https://gitlab.com',
      repo: 'ManUtopiK/test-nuxt-git-cms'
    }
  }

  return {
    // experimental: {
    //   noScripts: true,
    // },

    ssr: false,
    // router: {
    //   options: {
    //     hashMode: true
    //   }
    // },

    modules: [
      // '@anu-vue/nuxt',
      '@nuxt/devtools-ui-kit',
      '@nuxt/devtools',
      '@vueuse/nuxt',
      // https://github.com/cssninjaStudio/nuxt-media-viewer
      // '@cssninja/nuxt-media-viewer',
      '@unocss/nuxt',
      '@nuxtjs/color-mode',
      'git-connect',
      // https://github.com/e-chan1007/nuxt-monaco-editor
      // 'nuxt-monaco-editor'
    ],

    // nitro: {
    //   output: {
    //     publicDir: 'TESTH'
    //   }
    // },

    // server: {
    //   port: 3001,
    // },

    app: {
      baseURL: !isDev ? ROUTE_CLIENT : '',
    },

    nuxtCms,

    // css: ['@anu-vue/preset-theme-default/dist/style.css'],

    devtoolsUIKit: {
      dev: true,
    },

    // unocss: {
    //   preflight: true,
    //   // configFile: resolve(__dirname, '../unocss.config.ts'),
    // },

    colorMode: {
      classSuffix: ''
    },

    monacoEditor: {
      // These are default values:
      locale: 'fr',
      componentName: {
        codeEditor: 'MonacoEditor',
        diffEditor: 'MonacoDiffEditor'
      }
    }
  }
})
