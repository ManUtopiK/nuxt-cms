import { eventHandler } from "h3"
import { version } from "../../../../package.json"

import { useRuntimeConfig } from "#imports"
import components from "#nuxt-component-meta/nitro"

export default eventHandler(async (event) => {
  const filteredComponents = Object.values(components).filter((c) => c.global).filter((c) => !c.pascalName.startsWith("Content")).filter((c) => !c.pascalName.startsWith("DocumentDriven")).filter((c) => !c.pascalName.startsWith("Markdown")).filter((c) => !c.pascalName.startsWith("Prose")).map(({ pascalName, filePath, meta }) => {
    return {
      name: pascalName,
      path: filePath,
      meta: {
        props: meta.props,
        slots: meta.slots,
        events: meta.events
      }
    }
  })
  const runtimeConfig = useRuntimeConfig()
  const { app, content: { sources, ignores, locales, highlight, navigation, documentDriven, experiment } } = runtimeConfig
  // const appConfigSchema = runtimeConfig?.appConfigSchema;
  // let appConfig = {};
  // if (appConfigSchema) {
  //   appConfig = await $fetch.native(joinURL(app.baseURL, "/__app_config.json")).then((r) => r.json());
  // }
  return {
    // nuxt-content-editor version
    version,

    // // app.config
    // appConfigSchema: appConfigSchema || {},
    // appConfig,
    // // @nuxt/content

    // nuxt-content
    content: { sources, ignores, locales, highlight, navigation, documentDriven, experiment },

    // nuxt-component-meta
    components: filteredComponents
  }
})
