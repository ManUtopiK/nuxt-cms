import type { ModuleCustomTab } from './custom-tabs'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    /**
     * Called before cms starts. Useful to detect if cms is enabled.
     */
    'cms:before': () => void

    /**
     * Called after cms is initialized.
     */
    'cms:initialized': () => void

    /**
     * Hooks to extend cms tabs.
     */
    'cms:customTabs': (tabs: ModuleCustomTab[]) => void

    /**
     * Retrigger update for custom tabs, `cms:customTabs` will be called again.
     */
    'cms:customTabs:refresh': () => void
  }
}

export { }
