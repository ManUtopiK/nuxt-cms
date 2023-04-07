<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const props = defineProps<{
  /**
   * The key to use for storing the pane sizes in localStorage.
   */
  storageKey?: string
  panels: string[]
}>()

const DEFAULT = 33.3333333

const state = useCmsPanelsState()
const widths = useCmsPanelsWidth()

function size(panel) {
  return widths.value[panel] || DEFAULT
}

function onResize(event) {
  state.value.forEach((panel, index) => {
    widths.value[panel] = Array.isArray(event) ? event[index].size : event.panes[index].size
  })
}
</script>

<template>
  <client-only>
    <Splitpanes h-full of-hidden @resize="onResize" @paneRemove="onResize" @paneAdd="onResize">
      <Pane v-for="panel of panels" :key="panel" border="r base" h-full class="of-auto!" :size="size(panel)"
        min-size="10">
        <slot :name="`panel-${panel}`" />
      </Pane>
    </Splitpanes>
  </client-only>
</template>