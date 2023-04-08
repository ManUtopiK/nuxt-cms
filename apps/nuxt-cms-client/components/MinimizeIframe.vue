<script lang="ts" setup>
const { nuxtCms } = useRuntimeConfig().public
const frameState = useCmsFrameState()

function onClick() {
  if (frameState.value.width !== 0) {
    frameState.value.lastWidth = frameState.value.width
    frameState.value.width = 0
  } else {
    frameState.value.width = frameState.value.lastWidth
  }
}
</script>

<template>
  <VTooltip v-if="nuxtCms.mode === 'embedded'" placement="right">
    <slot>
      <button @click="onClick" flex="~" hover="bg-active" relative items-center justify-center p1 select-none w-10
        text-secondary rounded-xl h-10 exact-active-class="!text-primary bg-active">

        <TabIcon text-xl
          :icon="frameState.width ? 'i-carbon-side-panel-close-filled' : 'i-carbon-side-panel-open-filled'" />
      </button>
    </slot>

    <template #popper>
      <div>
        {{ 'Minimize to sidebar' }}
      </div>
    </template>
  </VTooltip>
</template>