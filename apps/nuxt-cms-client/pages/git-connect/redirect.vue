<template>
  <div class="h-screen flex items-center justify-center">Chargement...</div>
</template>

<script setup lang="ts">
import { createClient } from 'git-connect-lib'
import type { GitConnectClientOptions, GitConnectClient } from 'git-connect-lib'

onMounted(() => {
  const options = useCookie<GitConnectClientOptions>('git-connect-temp')

  const gitConnect = createClient({ api: options.value.api, appId: options.value.appId }) as GitConnectClient
  gitConnect.auth.finalizeAuth()
})

definePageMeta({
  layout: false,
})
</script>
