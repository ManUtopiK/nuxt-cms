<script setup lang="ts">
import pkg from 'js-beautify' // It's not a module

const { html } = pkg

const state = useCmsPanelsState()
const md = await $fetch('/api/_file/index.md')

const content = ref(md)
const htmlOutput = ref('')

const htmlEditorOptions = {
  readOnly: true,
  wordWrap: "on"
}

function getTiptapInstance(editor) {
  console.log(editor)
}

function resetContent() {
  content.value = md
}

function onHtml(value) {
  htmlOutput.value = html(value, { indent_size: 2 })
}

function onSave() {
  $fetch('/api/_file/index.md', { method: 'PUT', body: content.value })
}
</script>

<template>
  <div h-screen w-screen overflow="hidden">
    <TheHeader />

    <PanelMulti class="virtual-files" storage-key="tab-editor-panels" :panels="state">
      <template #panel-md>
        <div h-full of-hidden flex="~ col">
          <div h-10 border-b border-base text-sm p2 flex justify-between items-center gap-2>
            <code class="">Markdown</code>
          </div>

          <CodeEditor h-full of-auto v-model="content" />
        </div>
      </template>

      <template #panel-editor>
        <div h-full of-hidden flex="~ col">
          <div h-10 border-b border-base text-sm p2 flex justify-between items-center gap-2>
            <code class="">Nuxt content editor</code>
            <div flex gap-2>
              <NButton @click="onSave()" n="xs green6 solid" pb0.5>Save</NButton>
              <NButton @click="resetContent()" n="xs red6" pb0.5>Reset</NButton>
              <NButton @click="getTiptapInstance(editor)" n="xs blue6" pb0.5>Log instance</NButton>
            </div>
          </div>

          <ContentEditor h-full of-auto v-model="content" @html="onHtml" />
        </div>
      </template>

      <template #panel-html>
        <div h-full of-hidden flex="~ col">
          <div h-10 border-b border-base text-sm p2 flex justify-between items-center gap-2>
            <code class="">HTML output</code>
          </div>

          <CodeEditor h-full of-auto v-model="htmlOutput" :options="htmlEditorOptions" />
        </div>
      </template>

      <template #panel-content>
        <div h-full of-hidden flex="~ col">
          <div h-10 border-b border-base text-sm p2 flex justify-between gap-2>
            <code class="">{{ 'Preview: ' + $route.path }}</code>
          </div>

          <ContentDoc class="prose mx-auto" />
        </div>
      </template>
    </PanelMulti>
  </div>
</template>
