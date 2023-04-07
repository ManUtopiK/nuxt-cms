<template>
  <node-view-wrapper class="relative">
    <DragHandle :editor="editor">
      <Alert v-bind="nodeProps" class="!my5">
        <input type="text" v-model="currentType" class="absolute right-12 w-15" />
        <node-view-content class="content" />
      </Alert>

      <template #menu>
        <div class="w-[150px]">
          <label class="text-xs pl-2 pb-1 font-bold">Type:</label>
          <div class="flex flex-col gap-2">
            <button v-for="(type, index) of types" :key="index" @click="currentType = type"
              class="alert-menu-item flex mx-2 px-2 py-1 border-1 rounded text-left text-sm"
              :class="[type, currentType === type ? 'opacity-100' : 'opacity-50']">
              <div w-full first-letter:uppercase>{{ type }}</div>
              <NIcon v-if="currentType === type" icon="i-carbon-checkmark-filled" />
            </button>
          </div>
        </div>
      </template>
    </DragHandle>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

import DragHandle from '../../components/DragHandle.vue'
import { Alert } from '#build/components.client'

import { useContentEditor } from '../../composables/useContentEditor'

const props = defineProps({ nodeViewProps })

const { getComponent, frontmatter } = useContentEditor()

const types = getComponent('Alert').getPropValues('type').split(', ')

const nodeProps = computed(() => {
  return props.node.attrs.data
})
const currentType = computed({
  get: () => props.node.attrs.data.type,
  set(val) {
    props.updateAttributes({
      data: {
        ...props.node.attrs.data,
        type: val
      }
    })
  }
})
</script>

<style scoped>
.alert-menu-item.info {
  color: var(--elements-state-info-color-primary) !important;
  background-color: var(--elements-state-info-backgroundColor-primary) !important;
  border-color: var(--elements-state-info-borderColor-primary) !important;
}

.alert-menu-item.success {
  color: var(--elements-state-success-color-primary) !important;
  background-color: var(--elements-state-success-backgroundColor-primary) !important;
  border-color: var(--elements-state-success-borderColor-primary) !important;
}

.alert-menu-item.warning {
  color: var(--elements-state-warning-color-primary) !important;
  background-color: var(--elements-state-warning-backgroundColor-primary) !important;
  border-color: var(--elements-state-warning-borderColor-primary) !important;
}

.alert-menu-item.danger {
  color: var(--elements-state-danger-color-primary) !important;
  background-color: var(--elements-state-danger-backgroundColor-primary) !important;
  border-color: var(--elements-state-danger-borderColor-primary) !important;
}

.alert-menu-item.primary {
  color: var(--elements-state-primary-color-primary) !important;
  background-color: var(--elements-state-primary-backgroundColor-primary) !important;
  border-color: var(--elements-state-primary-borderColor-primary) !important;
}
</style>
