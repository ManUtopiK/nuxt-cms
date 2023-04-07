<template>
  <node-view-wrapper class="relative my-5">
    <DragHandle>
      <component :is="tag" v-bind="node.attrs">
        <node-view-content class="content" />
      </component>
    </DragHandle>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import DragHandle from '../../components/DragHandle.vue'

const props = defineProps({ nodeViewProps })

const tag = `Alert`
</script>

<style></style>
