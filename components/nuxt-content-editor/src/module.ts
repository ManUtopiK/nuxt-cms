import { defineNuxtModule, addPlugin, addComponent, addPrerenderRoutes, addServerHandler, createResolver, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-content-editor',
    configKey: 'nuxtContentEditor'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve('./runtime/plugin'))

    addComponent({ name: 'ContentEditor', filePath: resolve('./runtime/components/Editor.vue') })
    // addImports({ name: 'useMonaco', as: 'useMonaco', from: resolve('composables') })

    addServerHandler({
      method: "get",
      route: "/__nuxt_content_editor.json",
      handler: resolve("./runtime/server/routes/nuxt_content_editor")
    })
    addPrerenderRoutes("/__nuxt_content_editor.json")
    await installModule("nuxt-component-meta", {
      globalsOnly: true
    })
  }
})
