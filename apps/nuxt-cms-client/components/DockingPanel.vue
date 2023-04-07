<script setup lang="ts">
const frameState = useCmsFrameState()

const client = useClient()

async function refreshData() {
  const files = await useFetchAllFiles()
  console.log(files)
  // nuxt.hooks.callHookParallel('app:data:refresh', Object.keys(nuxt.payload.data))
  // // TODO: use triggerRef after: https://github.com/vuejs/core/pull/7507
  // // triggerRef(client)
  // if (client.value)
  //   client.value = { ...client.value }
}

function refreshPage() {
  location.reload()
}
</script>

<template>
  <div>
    <div v-if="client.user" px3 py2 border="b base" flex="~ col gap-1">
      <div>
        <div class="font-bold">{{ client.user.name }}</div>
        <div class="text-xs font-light">@{{ client.user.username }}</div>
      </div>
      <div class="text-sm text-gray">{{ client.user.commit_email }}</div>
    </div>

    <div v-if="client.user && client.gitConnect" px3 py2 border="b base" flex="~ col">
      <div text-xs font-light>Provider :</div>
      <div text-sm pb-2>{{ client.gitConnect.api }}</div>
      <div text-xs font-light>Repository :</div>
      <div text-sm pb-2>{{ client.gitConnect.repo }}</div>
      <div text-xs font-light>Branch :</div>
      <div text-sm>{{ client.gitConnect.branch }}</div>
    </div>

    <div v-if="client" py2 px3 border="b base" flex justify-between items-center>
      <div>
        <div text-sm op50>
          Dock panel to
        </div>
        <div flex="~ gap-1" text-lg>
          <button i-carbon-open-panel-filled-left :class="frameState.position === 'left' ? 'text-primary' : 'op50'"
            @click="frameState.position = 'left'" />
          <button i-carbon-open-panel-filled-top :class="frameState.position === 'top' ? 'text-primary' : 'op50'"
            @click="frameState.position = 'top'" />
          <button i-carbon-open-panel-filled-bottom :class="frameState.position === 'bottom' ? 'text-primary' : 'op50'"
            @click="frameState.position = 'bottom'" />
          <button i-carbon-open-panel-filled-right :class="frameState.position === 'right' ? 'text-primary' : 'op50'"
            @click="frameState.position = 'right'" />
        </div>
      </div>
      <NDarkToggle v-slot="{ toggle, isDark }">
        <NButton n="sm primary" @click="toggle()">
          <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
        </NButton>
      </NDarkToggle>
    </div>

    <div px3 py2 flex="~ gap2">
      <NButton n="solid primary xs" @click="refreshData">
        Refetch Data
      </NButton>
      <NButton n="solid primary xs" @click="refreshPage">
        Refresh Page
      </NButton>
    </div>
  </div>
</template>
