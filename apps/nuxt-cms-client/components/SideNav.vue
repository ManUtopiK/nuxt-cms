<script setup lang="ts">
const client = useClient()
const tabs = useTabs()

const frameState = useCmsFrameState()
const vertical = computed(() => {
  return ['left', 'right'].includes(frameState.value.position)
})
</script>

<template>
  <div flex="~ gap-0.5" items-center bg-base z-100>
    <div flex="~ col" items-center bg-base top-0 w-10 :class="vertical ? 'mt-2' : 'mt-1.5 ml-1.2'">
      <VDropdown placement="left-start" :distance="10" flex-1>
        <button bg-transparent>
          <!-- :class="client.user ? '' : 'saturate-0'" :title="client.user ? 'Nuxt CMS' : 'Nuxt CMS Client not connected, try open it in iframe mode'" -->
          <Transition name="fade" mode="out-in">
            <img v-if="client && client.user" :src="client.user.avatar_url" alt="client.user.username" rounded-full h-8
              w-8 of-h>
            <div v-else op50 i-carbon-circle-dash animate-spin h-8 w-8 mb-7px />
          </Transition>
        </button>

        <template #popper>
          <DockingPanel />
        </template>
      </VDropdown>

      <div v-if="vertical" h-1px w-8 mt-1 border="b base" />
    </div>

    <SideNavItem :tab="{ title: 'Home', name: 'home', path: '/', icon: 'i-carbon-home' }" />
    <SideNavItem v-for="tab of tabs.builtin.value" :key="tab.name" :tab="tab" />
    <template v-if="tabs.custom.value.length">
      <div h-1px w-8 my1 border="b base" />
      <SideNavItem v-for="tab of tabs.custom.value" :key="tab.name" :tab="tab" />
      <div flex-auto />
    </template>
  </div>
</template>
