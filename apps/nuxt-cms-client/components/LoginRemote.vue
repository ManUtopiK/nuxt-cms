<script lang="ts" setup>
import { createClient, } from 'git-connect-lib'
import type { GitConnectClientOptions, GitConnectClient } from 'git-connect-lib'

const api = ref('https://gitlab.com')

async function onLoginGithub() {
  // TODO Login with github
  // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
}
async function onLogin() {
  console.log(appId.value, api.value)

  const gitConnectClient = createClient({ api: api.value, appId: appId.value }) as GitConnectClient
  console.log(gitConnectClient)

  // Set a cookie for temporary store the credentials and use it in the redirect page
  const gitConnectCookie = useCookie<GitConnectClientOptions | null>('git-connect-temp')
  gitConnectCookie.value = { api: api.value, appId: appId.value }

  const user = await gitConnectClient.auth.login()
  // We got the user, we don't need the cookie
  gitConnectCookie.value = null

  const client = useClient()
  console.log(client)
  !client.value ? client.value = { user } : client.value.user = user
  // Clear cookie
}
</script>

<template>
  <form class="flex flex-col items-start gap-2 ">
    <NTextInput v-model="api" n="lime6 dark:lime5" min-w-100 icon="i-carbon-checkmark-outline" placeholder="Api" />
    <NTextInput v-model="repo" n="lime6 dark:lime5" min-w-100 icon="i-carbon-checkmark-outline" placeholder="Repo" />
    <NTextInput v-model="appId" n="lime6 dark:lime5" min-w-100 icon="i-carbon-password" type="password"
      placeholder="appId" />
    <div flex gap-2>
      <NButton @click.prevent="onLogin">Login with gitlab</NButton>
      <NButton @click.prevent="onLoginGithub">Login with github (TODO)</NButton>
    </div>
  </form>
</template>

<style style="postcss" scoped></style>
