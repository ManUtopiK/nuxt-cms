<script lang="ts" setup>
import { version } from '../package.json'
const state = useCmsPanelsState()

const DEFAULT = ['md', 'editor']
const availablePanels = ['md', 'editor', 'html', 'content']

const panels = computed({
  get: () => state.value || DEFAULT,
  set: (v) => { state.value = v },
})


function onClick(panel: string) {
  if (panels.value.includes(panel) && panels.value.length > 1) {
    panels.value = panels.value.filter(item => item !== panel)
  } else {
    panels.value = availablePanels.filter(item => item === panel || panels.value.includes(item))
  }
}

function isActive(panel) {
  return panels.value.includes(panel) ? 'solid' : ''
}

</script>

<template>
  <div relative n-bg-base>
    <div flex justify-between border-b border-base p-2>
      <div flex items-center gap-2>
        <div text-xl>
          nuxt-content-editor
        </div>
        <sup text-xs>
          <code>v{{ version }}</code>
        </sup>
      </div>

      <ClientOnly>
        <div flex gap-2 v-if="panels.length">
          <NDarkToggle v-slot="{ toggle, isDark }">
            <NButton n="sm primary" @click="toggle()">
              <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
            </NButton>
          </NDarkToggle>

          <NButton v-for="panel of availablePanels" :key="panel" :n="'blue6 ' + isActive(panel)" @click="onClick(panel)">
            {{ panel }}
          </NButton>
        </div>
      </ClientOnly>
    </div>
    <div class="flex">
    </div>
  </div>
</template>

<style style="postcss" scoped></style>
