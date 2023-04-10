import { createHooks } from 'hookable'
import defu from 'defu'

import { createClient, GitConnectClient } from 'git-connect-lib'
import type { GitConnectClientOptions } from 'git-connect-lib'
import { defaultOptions, ROUTE_CLIENT } from '../../../modules/nuxt-cms/src/constant'
import type { NuxtCmsGlobal } from '../../../modules/nuxt-cms-kit/src/types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const client = useClient()
  const router = useRouter()
  const route = useRoute()

  // The iframe of nuxt-cms-client is initialized
  console.log('[nuxt-cms-client] Client started', client)

  /**
   * Nuxt-cms can be mounted in different scenario :
   * - as a standalone application in production or development
   * - embed in a website, and direct access to the ROUTE_CLIENT
   * - embed in a website as an iframe
   */

  // This is a direct access (we are not in iframe), we need to populate client
  if (!client.value && (route.path === ROUTE_CLIENT || process.dev)) {
    console.log('Its direct access', route)

    // TODO Handle config
    const { nuxtCms } = useRuntimeConfig().public
    const { remote, ...config } = nuxtCms
    // const { git, user } = useCms()
    console.log(config, remote)
    // No api or appId. We can do nothing.
    if (!remote.api || !remote.appId) { return }

    // We can create a git client
    const gitConnectClient = createClient(remote) as GitConnectClient

    console.log(gitConnectClient)
    // Check if there is refresh-token cookie
    // TODO Get cookie name from git-connect-lib
    const refreshToken = useCookie<string | null>('git-connect-refresh-token')

    const clientTemp = {
      nuxt: markRaw(nuxtApp as any),
      appConfig: {},
      hooks: createHooks(),
      closePanel: () => void 0, // We are not in iframe.
      user: null,
      git: {
        ...gitConnectClient,
        branch: 'main',
        redirectPath: '/admin/redirect',
        repo: 'ManUtopiK/test-nuxt-git-cms'
      }
    }

    if (refreshToken.value) {
      await gitConnectClient.auth.refreshToken(refreshToken.value)
      const user = await gitConnectClient.auth.getUser()

      if (user) { clientTemp.user = user }
    }

    client.value = markRaw(clientTemp)

    // We can stop here
    return
  }

  window.__NUXT_CMS_VIEW__ = <NuxtCmsGlobal>{
    setClient (_client) {
      console.log('Set client', client.value === _client, client.value, _client)
      if (client.value === _client) { return }

      client.value = _client

      _client.hooks.hook('host:update:reactivity', () => {
        console.log('host:update:reactivity', _client, client)
        // TODO: use triggerRef after: https://github.com/vuejs/core/pull/7507
        // triggerRef(client)
        if (client.value) { client.value = { ...client.value } }
      })
      // _client.hooks.hook('host:inspector:close', () => {
      //   if (router.currentRoute.value.path === '/__inspecting')
      //     router.replace('/modules/components')
      // })
      _client.hooks.hook('host:navigate', (path) => {
        console.log('hook:host:navigate', path)
      })
      _client.hooks.hook('host:content:edit', (path) => {
        console.log('hook:host:content:edit', path)
      })

      console.log('[nuxt-cms] Client connected', _client)
    }
  }

  router.afterEach(() => {
    const path = router.currentRoute.value.path
    if (path.includes('__')) { return }
    client.value?.hooks.callHook('host:navigate', path)
  })
})
