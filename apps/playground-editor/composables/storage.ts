import { useLocalStorage } from '@vueuse/core'

export const isFirstVisit = useLocalStorage('playground-editor-first-visit', true)

const cmsPanelsWidth = useLocalStorage<Record<string, number>>('playground-editor-panels-width', {} as any, { listenToStorageChanges: false })

const cmsPanelsState = useLocalStorage<string[]>('playground-editor-panels-state', ['editor'] as any, { listenToStorageChanges: false })

export function useCmsPanelsWidth() {
  return cmsPanelsWidth
}

export function useCmsPanelsState() {
  return cmsPanelsState
}