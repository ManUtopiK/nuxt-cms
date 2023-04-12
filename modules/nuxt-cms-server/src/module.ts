import defu from 'defu'

import { addServerHandler, defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-cms-server',
    configKey: 'nuxtCmsServer'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {

    // Prevent running this module in production
    if (process.env.NODE_ENV !== 'production') {

      nuxt.options.runtimeConfig.public.nuxtCmsServer = defu(
        nuxt.options.runtimeConfig.public.nuxtCmsServer,
        options
      )

      const { resolve } = createResolver(import.meta.url)

      addServerHandler({
        route: '/api/_local_files/**:name',
        handler: resolve('runtime/server/api/handler')
      })

    }
  }
})

