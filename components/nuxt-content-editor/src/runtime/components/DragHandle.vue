<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { Tippy } from 'vue-tippy'

const props = defineProps<{
  editor?: Editor
}>()
</script>

<template>
  <div class="flex group -ml-[30px]">
    <div class="handle pr-2 invisible" contenteditable="false" draggable="true" data-drag-handle>
      <tippy :hide-on-click="true" trigger="click" interactive placement="bottom-start" :offset="[0, 5]">
        <div
          class="-mb-[100%] p1 px-1.5 rounded cursor-grab transition opacity-20 bg-base text-black dark:text-white hover:opacity-40 hover:bg-gray hover:bg-opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" class="w-[10px]">
            <path fill="currentColor"
              d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>

        <template #content="tippy">
          <div class="rounded border z-10 border-base shadow bg-base py-2">
            <slot name="menu" :editor="editor" />
          </div>
        </template>
      </tippy>
    </div>

    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.group:hover>.handle {
  visibility: visible;
}
</style>
