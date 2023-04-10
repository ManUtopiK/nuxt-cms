<script setup lang="ts">
const client = useClient()
// const waiting = computed(() => !client.value && !showConnectionWarning.value)
const waiting = false // computed(() => !client.value)

const frameState = useCmsFrameState()
const vertical = computed(() => {
  return ['left', 'right'].includes(frameState.value.position)
})
const reverse = computed(() => {
  return ['bottom', 'right'].includes(frameState.value.position)
})
</script>

<template>
  <div bg-base of-hidden font-sans>
    <!-- <Notification /> -->
    <div v-if="waiting" h-full w-full flex>
      <div flex="~ col" text-lg items-center ma animate-pulse>
        <div op50 i-carbon-circle-dash animate-spin text-4xl />
        Connecting...
      </div>
    </div>

    <div
      v-else
      class="default-layout absolute grid h-full w-full of-hidden border-base"
      :class="[`layout-${frameState.position || 'left'}`, vertical ? `${reverse ? 'border-l' : 'border-r'}` : `${reverse ? 'border-t' : 'border-b'}`]"
    >
      <SideNav
        class="side-nav grid-area-[sidebar] sticky top-0 border-base"
        :class="vertical ? `h-screen flex-col of-y-auto ${reverse ? 'border-l' : 'border-r'}` : `w-screen flex-row ${reverse ? 'border-t' : 'border-b'}`"
      />

      <div class="grid-area-[body]" :class="vertical ? 'h-full' : 'w-full'" of-auto>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.default-layout.layout-left {
  grid: "sidebar body" 1fr / 50px 1fr;
}

.default-layout.layout-right {
  grid: "body sidebar" 1fr / 1fr 50px;
}

.default-layout.layout-top {
  grid: "sidebar" 50px "body" 1fr / 1fr;
}

.default-layout.layout-bottom {
  grid: "body" 1fr "sidebar" 50px / 1fr
}
</style>
