<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/types/custom-tabs'

const props = defineProps<{
  tab: ModuleCustomTab | ModuleBuiltinTab
}>()

// const client = useClient()
// TODO Fix this
const isEnabled = computed(() => {
  const _tab = props.tab as ModuleBuiltinTab
  // if (_tab.requireClient && !client.value)
  //   return false
  return true
})
</script>

<template>
  <VTooltip v-if="isEnabled" placement="right">
    <NuxtLink :to="'path' in tab ? tab.path : `/modules/custom-${tab.name}`" flex="~" hover="bg-active" relative
      items-center justify-center p1 select-none w-10 text-secondary rounded-xl h-10
      exact-active-class="!text-primary bg-active">
      <TabIcon text-xl :icon="tab.icon" />
      <div v-if="tab.badge && (+toRaw(tab.badge) !== 0)" :class="tab.badgeColor || 'bg-red-600'"
        class="rounded-full text-center font-bold text-white text-xs block absolute w-4 h-4 -top-1 -right-1">
        {{ typeof tab.badge === 'function' ? tab.badge() : tab.badge }}
      </div>
    </NuxtLink>
    <template #popper>
      <div>
        {{ tab.title }}
      </div>
      <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
        <Component :is="tab.extraTabVNode" />
      </div>
    </template>
  </VTooltip>
</template>