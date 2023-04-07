<template>
  <ClientOnly>
    <tree-view id="files-tree" :initial-model="files" :model-defaults="modelDefaults">
      <template #text="{ model }">
        <div v-if="model.type === 'input'" flex="~ gap-1">
          <NTextInput v-model="newFileName" n="lime6 dark:lime5" icon="i-carbon-checkmark-outline" placeholder="Hi!" />
          <NButton @click="onAddNewFile">Add</NButton>
        </div>
        <div v-else px2 py1 flex justify-between truncate select-none class="group no-wrap cursor-pointer flex-1" :class="[selected === model.path && 'n-bg-active',
        isHidden(model) && 'hidden'
        ]" @contextmenu.prevent.stop="showMenu($event, model)" @click="onClick(model)">
          <!-- <icon :icon="model.icon" /> -->
          <div :class="selected === model.path && 'text-primary'">{{ model.label }}</div>

          <div class="opacity-0 transition-opacity group-hover:opacity-100 flex gap-1">
            <button v-if="!isDirectory(model)" text-sm op40 hover="op100 text-primary" title="Open in editor"
              @click="emit('navigate', model.path)">
              <div i-ph-eye />
            </button>
          </div>
        </div>

      </template>

      <template v-slot:loading="{ model, customClasses }">
        <div op50 i-carbon-circle-dash animate-spin h-4 w-4 />
      </template>
    </tree-view>

    <div h-full @click="onClickOutside" @contextmenu.prevent.stop="showMenu($event, { id: 'root', label: 'root' })" />

    <ContextMenu :event="contextmenuEvent" class="text-sm">
      <div hover:bg-active px3 py1 cursor-pointer @click="onNewFile()">New file...</div>
    </ContextMenu>
  </ClientOnly>
</template>

<script setup lang="ts">
import { TreeView } from "@grapoza/vue-tree"

interface Document {
  id: string
  label: string
  type?: string
  name?: string
  path?: string
  body?: any
  children?: Array<Document>
  treeNodeSpec?: {
    expandable: Boolean
    loadChildrenAsync: Function
  }
}

const props = defineProps<{
  files: Document[]
  filteredFiles: String[]
}>()

const emit = defineEmits(['select', 'navigate'])

function isDirectory(model: Document) {
  return model.type === 'dir'
}
function isHidden(model: Document) {
  return (!isDirectory(model) && props.filteredFiles.length && !props.filteredFiles.includes(model.path!))
}

const selected = ref()
const onClick = (model: Document) => {
  // It's a folder
  if (model?.treeNodeSpec?.expandable && model.treeNodeSpec.loadChildrenAsync) {
    // Hack from https://github.com/grapoza/vue-tree/issues/278
    // model.treeNodeSpec.state.expanded = true
    // model.treeNodeSpec.loadChildrenAsync(model)
    document.getElementById("files-tree-" + model.id + "-exp")?.click()
  } else {
    selected.value = model.path
    emit('select', model)
  }
}

function onClickOutside() {
  emit('select', undefined)
}

const contextmenuEvent = ref<MouseEvent>()
const currentModel = ref()
const showMenu = (event: MouseEvent, model: Document) => {
  if (model.type === 'dir') {
    contextmenuEvent.value = event
    currentModel.value = model
  } else if (model.id === 'root') {
    contextmenuEvent.value = event
    currentModel.value = 'root'
  } else {
    contextmenuEvent.value = undefined
    currentModel.value = undefined
  }
}

const newFileName = ref('')
function onNewFile() {
  const inputModel = { id: 'new file', label: 'new file', type: 'input' }
  contextmenuEvent.value = undefined

  if (currentModel.value === 'root') return props.files.unshift(inputModel)
  currentModel.value.children.unshift(inputModel)
}
function onAddNewFile() {
  console.log(newFileName.value)
}


const modelDefaults = ref({
  customizations: {
    classes: {
      treeViewNodeSelf: 'large-line',
      treeViewNodeSelfText: 'big-text'
    }
  }
})
</script>

<style>
:root {
  --theia-ui-padding: 6px;
  --theia-icon-size: 16px;
}

.grtv-wrapper.grtv-default-skin .grtvn {
  padding-left: 0;
  line-height: 1.5em;
}

.grtv-wrapper.grtv-default-skin .grtvn:first-child {
  margin-top: 0;
}

.grtv-wrapper.grtv-default-skin .grtvn[role=treeitem]:focus {
  outline: 0;
}

.grtv-wrapper.grtv-default-skin .grtvn-self {
  display: flex;
  align-items: flex-center;
}

.grtv-wrapper.grtv-default-skin .grtvn-self:hover {
  background-color: rgba(156, 163, 175, 0.05);
}

.grtv-wrapper.grtv-default-skin .grtvn-dragging .grtvn-self {
  opacity: .5
}

.grtv-wrapper.grtv-default-skin .grtvn-self-drop-target {
  flex-wrap: wrap
}

.grtv-wrapper.grtv-default-skin .grtvn-self-drop-target.grtvn-self-child-drop-target {
  opacity: .5
}

.grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target {
  width: 100%;
  height: 7px;
  background-color: #ddd
}

.grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target.grtvn-self-sibling-drop-target-hover {
  background-color: #bbb
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander {
  padding: 0;
  background: none;
  border: none;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator {
  font-style: normal;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" viewBox="0 0 16 16"%3E%3Cpath fill="currentColor" fill-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619l4.357-4.357z" clip-rule="evenodd"%2F%3E%3C%2Fsvg%3E');
  min-width: var(--theia-icon-size);
  min-height: var(--theia-icon-size);
  transition: transform .25s;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander.grtvn-self-expanded i.grtvn-self-expanded-indicator {
  /* font: normal normal normal 14px/1 FontAwesome;
  content: "\f107"; */
  /* fa-angle-down */
  transform: rotate(90deg);
}

.grtv-wrapper.grtv-default-skin .grtvn-self-selected {
  background-color: #f0f0f8
}

.grtv-wrapper.grtv-default-skin .grtvn-self-action,
.grtv-wrapper.grtv-default-skin .grtvn-self-checkbox,
.grtv-wrapper.grtv-default-skin .grtvn-self-expander,
.grtv-wrapper.grtv-default-skin .grtvn-self-radio,
.grtv-wrapper.grtv-default-skin .grtvn-self-spacer {
  /* min-width: 1rem */
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander,
.grtv-wrapper.grtv-default-skin .grtvn-self-spacer {
  margin: 0
}

.grtv-wrapper.grtv-default-skin .grtvn-self-checkbox,
.grtv-wrapper.grtv-default-skin .grtvn-self-radio {
  margin: 0 0 0 -1.2rem;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-label,
.grtv-wrapper.grtv-default-skin .grtvn-self-text .fa {
  width: 1em;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-action {
  padding: 0;
  background: none;
  border: none;
  height: 1.2rem;
}

.grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon {
  font-style: normal;
}

.grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon:before {
  content: "+"
}

.grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon {
  font-style: normal
}

.grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon:before {
  content: "x"
}

.grtv-wrapper.grtv-default-skin .grtvn-children-wrapper {
  margin: 0 0 0 0.5rem
}

.grtv-wrapper.grtv-default-skin .grtvn-children {
  padding: 0 0 0 0.5em;
  list-style: none
}

.grtv-wrapper.grtv-default-skin .grtvn-children {
  border-left: 1px solid #CCC;
}

.grtv-wrapper.grtv-default-skin>.grtv {
  margin: 0;
  padding: 0;
  list-style: none
}


.grtvn-self {
  display: flex;
  align-items: center;
}

/* custom */

.grtvn-self-expander {
  display: flex;
  justify-content: center;
}
</style>