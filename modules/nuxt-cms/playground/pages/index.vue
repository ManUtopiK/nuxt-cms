<template>
  <div>
    <button @click="onAuth">Authenticate</button>
    <pre>{{ user }}</pre>
  </div>
</template>

<script setup lang="ts">
const { $git } = useNuxtApp()

const user = ref()
onMounted(async () => {
  user.value = await $git.auth.getUser()
})

async function onAuth() {
  user.value = await $git.auth.login()
}
</script>

<style scoped>

</style>
