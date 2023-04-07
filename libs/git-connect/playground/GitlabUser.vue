<template>
  <div>
    <pre v-if="auth">{{ auth }}</pre>
    <pre v-if="me">{{ me }}</pre>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useGitX } from '../src/index'

const { auth, query } = useGitX()
const me = ref()

watch(auth, async () => {
  const resp = await query(`#graphql
  {
    me: currentUser {
      id
      name
      avatarUrl
    }
  }`)
  me.value = resp
})
</script>
