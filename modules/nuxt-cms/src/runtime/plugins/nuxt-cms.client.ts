import { createApp, markRaw } from 'vue'
import { createHooks } from 'hookable'
import type { NuxtCmsHostClient } from '../../types'
import { useAppConfig, useRuntimeConfig } from '#imports'
import defu from 'defu'

import { createClient, GitConnectClient } from 'git-connect-lib'
import { useCms } from '../composables/useCms'
import { defaultOptions } from '../../constant'

import Container from './view/Container.vue'
import { closePanel, togglePanel } from './view/state'

export default defineNuxtPlugin(async (nuxtApp) => {
  // TODO: Stackblitz support?
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const { nuxtCms } = useRuntimeConfig().public
  const { remote, ...config } = nuxtCms
  // No api or appId. We can do nothing.
  if (!remote.api || !remote.appId) return

  // TODO Check if remote is an array

  // We can create a git client with the remote
  const gitConnectClient = createClient(remote) as GitConnectClient

  // Set git in the store for authentication
  const { git, user } = useCms()
  git.value = gitConnectClient

  // No cookie, no authentification possible.
  // TODO Check with getUser() ?
  console.log('cook', git.value.auth.getCookie())
  if (!git.value.auth.getCookie()) return

  // TODO add options to choose authentication with direct auto-start or by handler (a login button)

  // Get authenticated user
  user.value = await git.value.auth.getUser()

  // Check if we are in the iframe (client) or in standalone mode
  if (config.mode === 'standalone') return
  if (window.parent && window.self !== window.parent) {
    try {
      // Stop here to not mount client again and again. Aka prevent inception...
      if (window.parent.__NUXT_CMS_VIEW__ || window.parent.document.querySelector('#nuxt-cms-container')) {
        return
      }
    }
    catch (e) {
    }
  } else {
    // TODO check if we are standalone or embedded in iframe
    // console.log('Direct access', config)
    // return
  }

  console.log('nuxtApp', nuxtApp)
  // Build a non reactive client
  const client: NuxtCmsHostClient = markRaw({
    nuxt: markRaw(nuxtApp as any),
    appConfig: useAppConfig() as any,
    hooks: createHooks(),
    closePanel,
    git: git.value,
    config,
    user
  })

  const holder = document.createElement('div')
  holder.id = 'nuxt-cms-container'
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  // Shortcut to toggle devtools
  addEventListener('keypress', (e) => {
    if (e.key === 'y' && e.ctrlKey)
      togglePanel()
  })

  const app = createApp(Container, { client })
  app.mount(holder)
})
