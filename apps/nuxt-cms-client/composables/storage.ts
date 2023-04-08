import { toRefs, useLocalStorage } from '@vueuse/core'

import type { CmsFrameState, CmsUISettings } from '~/types/ui-state'

export const isFirstVisit = useLocalStorage('nuxt-cms-first-visit', true)

const cmsSettings = useLocalStorage<CmsUISettings>('nuxt-cms-settings', {
  componentsView: 'list',
  componentsGraphShowNodeModules: false,
  componentsGraphShowPages: false,
  componentsGraphShowLayouts: false,
  componentsGraphShowWorkspace: true,
  interactionCloseOnOutsideClick: false,
  showExperimentalFeatures: false,
  scale: 1,
}, { mergeDefaults: true })

const cmsSettingsRefs = toRefs(cmsSettings)

const cmsChanges = useLocalStorage('nuxt-cms-changes', [])

const cmsFrameState = useLocalStorage<CmsFrameState>('nuxt-cms-frame-state', {
  width: 0,
  lastWidth: 0,
  position: 'left',
  open: true
} as any, { listenToStorageChanges: true })

const cmsPanelsState = useLocalStorage<Record<string, number>>('nuxt-cms-panels-state', {} as any, { listenToStorageChanges: false })

export function useCmsSettings() {
  return cmsSettingsRefs
}

export function useCmsChanges() {
  return cmsChanges
}

export function useCmsFrameState() {
  return cmsFrameState
}

export function useCmsPanelsState() {
  return cmsPanelsState
}