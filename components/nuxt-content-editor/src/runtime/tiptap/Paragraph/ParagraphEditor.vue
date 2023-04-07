<template>
  <node-view-wrapper>
    <DragHandle>
      <node-view-content class="content" />
    </DragHandle>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import DragHandle from '../../components/DragHandle.vue'

defineProps({ nodeViewProps })
</script>
