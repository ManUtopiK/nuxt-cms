// import type { Lang } from 'shiki-es'
// import { renderMarkdown } from './client-services/markdown'
// import { renderCodeHighlight } from './client-services/shiki'
import type { NuxtCmsClient, NuxtCmsHostClient, NuxtCmsIframeClient } from '../../../modules/nuxt-cms/src/types'

export function useClient() {
  return useState<NuxtCmsHostClient>('nuxt-cms-client')
}

export function useClientRoute() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$route)
}

export function useClientRouter() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$router)
}

// export function useComponentInspectorData() {
//   return useState<VueInspectorData>('devtools-component-inspector-data')
// }

const connectionTimeout = ref(false)
setTimeout(() => {
  connectionTimeout.value = true
}, 2000)

export const showConnectionWarning = computed(() => {
  return connectionTimeout.value && !useClient().value
})

export function useInjectionClient(): ComputedRef<NuxtCmsIframeClient> {
  const client = useClient()
  const mode = useColorMode()

  console.log('[nuxt-cms-client] Client injected')
  return computed(() => ({
    host: client.value,
    cms: <NuxtCmsClient>{
      colorMode: mode.value,
      // renderCodeHighlight(code, lang) {
      //   return renderCodeHighlight(code, lang as Lang)
      // },
      // renderMarkdown(code) {
      //   return renderMarkdown(code)
      // },
    },
  }))
}
