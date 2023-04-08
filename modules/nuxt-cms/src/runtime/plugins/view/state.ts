import { ref } from 'vue'
import type { NuxtCMSFrameState, NuxtCMSUISettings } from '../../../types'
import { useObjectStorage } from './utils'

export const PANEL_MIN = 1
export const PANEL_MAX = 100

export type ViewMode = 'default' | 'component-inspector'

export const viewMode = ref<ViewMode>('default')

export const state = useObjectStorage<NuxtCMSFrameState>('nuxt-cms-frame-state', {
  width: 0,
  lastWidth: 0,
  height: 100,
  bottom: 0,
  left: 0,
  open: true,
  route: '',
  position: 'left',
})

export const settings = useObjectStorage<NuxtCMSUISettings>('nuxt-cms-settings', {} as any, true)

export const changes = useObjectStorage<[]>('nuxt-cms-changes', [])

export function togglePanel() {
  if (state.value.open)
    closePanel()
  else
    openPanel()
}

export function closePanel() {
  if (viewMode.value !== 'default')
    viewMode.value = 'default'
  else
    state.value.open = false
}

export function openPanel() {
  state.value.open = true
}
