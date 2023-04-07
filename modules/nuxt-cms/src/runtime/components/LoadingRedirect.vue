<template>
  <slot :git="git" :should-finalize="shouldFinalize">
    <div class="loading">{{ text }}</div>
  </slot>
</template>

<script setup lang="ts">
import { onMounted, useCms } from '#imports'

const props = withDefaults(
  defineProps<{
    shouldFinalize?: boolean
    text?: string
  }>(), {
  shouldFinalize: true,
  text: 'Loading...'
})

const { git } = useCms()
onMounted(() => {
  if (props.shouldFinalize) git.value.auth.finalizeAuth()
})
</script>

<style scoped>
.loading {
  height: min(600px, 100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: #606060;
}
</style>
