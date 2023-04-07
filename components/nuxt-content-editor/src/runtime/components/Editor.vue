<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

import { useContentEditor } from '../composables/useContentEditor'

import type { EditorOptions } from '@tiptap/vue-3'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { extensions } from '../tiptap/editor'

import { markdownToHtml, htmlToMarkdown } from '../markdown-parser'

import BubbleMenu from "./BubbleMenu.vue"

const props = defineProps<{
  modelValue: string
  options?: Partial<EditorOptions>
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
  (event: 'html', payload: string): void
}>()

const options = { mdc: true, remarkPlugins: {}, rehypePlugins: {}, data: {} }

const isEditorFocus = ref(false)

const editor = ref()
onMounted(async () => {
  const { fetchComponents } = useContentEditor()
  await fetchComponents()

  const content = await markdownToHtml(props.modelValue, options)

  editor.value = new Editor({
    // editable: false,
    content,
    // content: HTML,
    extensions,
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none',
      },
    },
    onBeforeCreate: (props) => void 0,
    onCreate: (props) => void 0,
    onUpdate: async () => {
      const html = editor.value.getHTML()
      emit('html', html)
      const md = await htmlToMarkdown(html, options)
      emit('update:modelValue', md)
    },
    onSelectionUpdate: (props) => void 0,
    onTransaction: (props) => void 0,
    onFocus({ editor, event }) {
      // The editor is focused.
      isEditorFocus.value = true
    },
    onBlur({ editor, event }) {
      // The editor isn’t focused anymore.
      isEditorFocus.value = false
    },
    onDestroy: (props) => void 0,
    ...props.options
  })

  watch(() => props.modelValue, async (value) => {
    if (isEditorFocus.value) return

    const html = await markdownToHtml(value, options)
    // if (html === value) return

    editor.value.commands.setContent(html, false)
    emit('html', html)
  })
})

//   beforeUnmount() {
//    editor.value.editor.destroy()
//   },
// }
</script>

<template>
  <div>
    <slot name="before" :editor="editor" />

    <slot name="bubbleMenu" :editor="editor">
      <BubbleMenu :editor="editor" />
    </slot>

    <editor-content :editor="editor" />

    <slot name="after" :editor="editor" />
  </div>
</template>

<style>
/* Placeholder */
.ProseMirror-focused .is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
