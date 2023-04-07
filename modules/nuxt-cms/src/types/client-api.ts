import type { AppConfig } from 'nuxt/schema'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { Hookable } from 'hookable'
import type { GitConnectClientOptions, GitConnectClient } from 'git-connect-lib'
import type { Remote } from './module'

export interface NuxtCmsClientHooks {
  /**
   * When the user navigates, used for persisting the current tab
   */
  'host:navigate': (path: string) => void
  /**
   * Triggers reactivity manually, since Vue won't be reactive across frames)
   */
  'host:update:reactivity': () => void
  /**
   * Triggers reactivity manually, since Vue won't be reactive across frames)
   */
  'host:content:edit': (path: string) => void
}

/**
 * Host client from the App
 */
export interface NuxtCmsHostClient {
  nuxt: NuxtApp
  appConfig: AppConfig
  hooks: Hookable<NuxtCmsClientHooks>
  user: any

  closePanel: () => void

  // TODO Fix this type
  git: Remote & GitConnectClient & GitConnectClientOptions
}

export interface NuxtCmsClient {
  colorMode: string
}

export interface NuxtCmsIframeClient {
  host: NuxtCmsHostClient
  cms: NuxtCmsClient
}

export interface NuxtCmsGlobal {
  setClient(client: NuxtCmsHostClient): void
}
