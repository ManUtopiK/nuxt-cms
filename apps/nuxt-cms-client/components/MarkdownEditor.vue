<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', value: boolean): void
  (e: 'blur', value: boolean): void
}>()

const value = computed({
  get: () => props.modelValue,
  set(val) {
    emit('update:modelValue', val)
  }
})

const editorRef = ref()
// For example, add greeting action to editor...
// editorRef.value?.$editor.addAction({
//   id: 'hello-world',
//   label: 'Hello world',
//   run: function (ed) {
//     alert('Hello world!')
//   }
// })

const colorMode = useColorMode()
const options = {
  theme: `vs-${colorMode.value}`,
  language: 'markdown',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true, // auto resize to parent container
}

watch(colorMode, (newVal, oldVal) => {
  // TODO Handle dark mode change. Check why it triggered twice.
  console.log(newVal, oldVal, editorRef.value)
  //editorRef.value?.$editor.focus()
  // editorRef.value?.$editor.setTheme(`vs-${newVal}`)

})
</script>

<template>
  <MonacoEditor ref="editorRef" :options="options" v-model="value" lang="markdown">
    Loading...
  </MonacoEditor>
</template>
