<template>
  <div>
    <div>
      <label>Gitlab url:</label>
      <input type="text" v-model="base_url" />
    </div>
    <div>
      <label>Gitlab app ID:</label>
      <input type="text" v-model="app_id" />
    </div>
    <h1>Authentification</h1>

    <!-- <GitlabUser /> -->

    <button @click="onRefreshToken">refresh token</button>

    <hr />
    <button @click="onAuth">Authenticate</button>
    <button @click="onGetUser">GetUser</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createClient } from '../src/index'

// import GitlabUser from './GitlabUser.vue'

const base_url = ref('https://git.duniter.org')
const app_id = ref(
  //'bf1bf15b582fd7d1fae2281562391aef2edd862d8bb9ebe0de99116480fd2eb5'
  'd05b3c098e54707920f7412eedc1b9dfdc732b0a1121fbe3c54f10b9b5ce4bb2'
)

const gitClient = createClient({ baseUrl: base_url.value, appId: app_id.value })

const auth = ref()
async function onAuth() {
  const data = await gitClient.login()
  console.log(data)
  auth.value = data
}

function onGetUser() {
  gitClient.getUser()
}

async function onRefreshToken() {
  try {
    auth.value = await gitClient.refreshToken()
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  // await completeAuth()
  gitClient.finalizeAuth()
})
</script>
