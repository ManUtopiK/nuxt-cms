import type { ModuleCustomTab } from './custom-tabs'

export interface Remote {
  /**
   * Provider api
   *
   * @default 'https://gitlab.com'
   */
  api?: string

  /**
   * application Id
   *
   * This is the id from gitlab
   */
  appId?: string

  /**
   * Repository path
   */
  repo?: string

  /**
   * Enable Vue Component Inspector
   *
   * @default 'main'
   */
  branch?: string

  /**
   * Redirect path
   *
   * @default '/admin/redirect'
   */
  redirectPath?: string

  /**
   * Files of the repository
   */
  files?: any
}

export interface ModuleOptions {
  /**
   * Enable nuxt-cms
   *
   * @default true
   */
  enabled?: boolean

  /**
   * Enable nuxt-cms
   *
   * @default 'embedded'
   */
  mode?: 'embedded' | 'standalone'

  /**
   * One remote represent a git provider (gitlab or github) and a git repository.
   */
  remote?: Remote | Remote[]

  /**
   * Custom tabs
   *
   * This is in static format, for dynamic injection, call `nuxt.hook('devtools:customTabs')` instead
   */
  customTabs?: ModuleCustomTab[]

  /**
   * Development source of repo
   * // TODO Remove this and prompt in nuxt-cms in CommitBox.vue
   * @default 'local'
   */
  devSource?: 'local' | 'repo'
}

export interface ModuleGlobalOptions {
  /**
   * List of projects to enable nuxt-cms for. Only works when nuxt-cms is installed globally.
   */
  projects?: string[]
}
