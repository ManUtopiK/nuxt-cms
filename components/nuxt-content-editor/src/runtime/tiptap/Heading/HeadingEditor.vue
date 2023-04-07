<template>
  <node-view-wrapper>
    <DragHandle>
      <component :is="tag" v-bind="node.attrs">
        <node-view-content class="content" />
      </component>
    </DragHandle>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import DragHandle from '../../components/DragHandle.vue'
import * as GlobalComponents from '#build/components.client'

const props = defineProps({ nodeViewProps })

// Attempts to dynamicly load component :
// const isComponent = name => typeof resolveDynamicComponent(name) !== 'string'
// console.log(isComponent('ProseH1'), resolveDynamicComponent('ProseH1'))
// const ProseH1 = resolveDynamicComponent('ProseH1')
// const tag = await ProseH1()

// const tag = defineAsyncComponent(() => import('../../components/ProseH1.vue'))

const tag = GlobalComponents[`ProseH${props.node.attrs.level}`]
</script>
