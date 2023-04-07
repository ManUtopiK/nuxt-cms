<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
    <div class="flex gap-2 rounded border z-10 border-base shadow bg-base p-1">
      <button class="font-bold rounded px-1 text-xs hover:bg-gray hover:bg-opacity-20 dark:hover:bg-gray-700"
        @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        bold
      </button>
      <button class="font-italic rounded px-1 text-xs hover:bg-gray hover:bg-opacity-20 dark:hover:bg-gray-700"
        @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        italic
      </button>
      <button class="line-through rounded px-1 text-xs hover:bg-gray hover:bg-opacity-20 dark:hover:bg-gray-700"
        @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        strike
      </button>

      <form v-if="linkMenuIsActive" class="menububble__form" @submit.prevent="setLinkUrl">
        <input ref="linkInput" v-model="linkUrl" class="outline-none px-1 w-full focus-within:bg-light-500" type="text"
          placeholder="https://" @keydown.esc="hideLinkMenu" />
        <button class="menububble__button" type="button" @click.prevent="setLinkUrl">
          <!-- <b-icon size="is-small" icon="close-circle" /> -->
        </button>
      </form>
      <template v-else>
        <button class="menububble__button" :class="{ 'is-active': true }" @click.prevent="showLinkMenu">
          <span class="text is-size-7 is-nowrap">
            {{ true ? 'update-link' : 'add-link' }}
          </span>
          <!-- <b-icon size="is-small" icon="link-variant" /> -->
        </button>
      </template>
    </div>
  </bubble-menu>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

// BubbleMenu.configure({
//   shouldShow: ({ editor, view, state, oldState, from, to }) => {
//     // only show the bubble menu for images and links
//     return editor.isActive('image') || editor.isActive('link')
//   },
// })

const linkMenuIsActive = ref(true)
const linkUrl = ref('')
const linkInput = ref()
function hideLinkMenu() {
  linkUrl.value = ''
  linkMenuIsActive.value = false
}
function showLinkMenu(attrs) {
  linkUrl.value = attrs.href
  linkMenuIsActive.value = true
  nextTick(() => {
    linkInput.value.$el.focus()
  })
}
function setLinkUrl() {
  console.log(props.editor)
  props.editor.chain().focus().setLink({ href: linkUrl.value }).run()
  // command({ href: url })
  // hideLinkMenu()
  // editor.value.focus()
}
</script>

