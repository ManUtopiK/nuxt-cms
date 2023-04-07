<script lang="ts" setup>
import { onClickOutside, useVModel } from '@vueuse/core'

const props = defineProps<{ event: MouseEvent | undefined }>()

// const emit = defineEmits<{ (...args: any): void }>()

// const value = useVModel(props, 'modelValue', emit, { passive: true })
const el = ref<HTMLDivElement>()

const isVisible = ref(false)
watch(() => props.event, (val) => {
  isVisible.value = !!val
})

onClickOutside(el, () => {
  isVisible.value = false
})
</script>

<template>
  <div v-if="isVisible" ref="el" class="absolute transition-opacity n-bg-base rounded border z-10 n-border-base shadow"
    :class="[isVisible ? 'op-100' : 'op0 pointer-events-none -translate-y-1']"
    :style="`top: ${event?.pageY}px;left: ${event?.pageX}px;`">
    <div class="flex flex-col gap-0.5 min-w-30">
      <slot />
    </div>
  </div>
</template>

<style style="postcss" scoped></style>
