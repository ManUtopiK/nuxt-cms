<template>
  <node-view-wrapper class="relative my-5 px-2 bg-light-300 dark:bg-dark-300 rounded">
    <button @click="isVisible = !isVisible" contenteditable="false"
      class="font-mono text-xs text-left select-none w-full py-2">Frontmatter</button>

    <div v-show="isVisible" class="pb-2">
      <node-view-content class="p-2 w-full bg-gray bg-opacity-10 text-sm" />
    </div>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({ nodeViewProps })

const isVisible = ref(false)
</script>

<style></style>
