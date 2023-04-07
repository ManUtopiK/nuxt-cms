<template>
  <div class="items relative shadow-lg rounded bg-base border border-base min-w-30 py-1">
    <template v-if="items.length">
      <button class="block w-full px-2 py-1 text-left" :class="[index === selectedIndex && 'bg-blue', item.classes]"
        v-for="(item, index) in items" :key="index" @click="selectItem(index)">
        {{ item.title }}
      </button>
    </template>
    <div class="item" v-else>
      No result
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface MenuItem {
  title: string
  section: string
  command: Function
}

const props = defineProps<{
  items: MenuItem[],
  command: Function
}>()

const selectedIndex = ref(0)

watch(() => props.items, () => {
  selectedIndex.value = 0
})

function onKeyDown({ event }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

defineExpose({
  onKeyDown
})

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler() {
  selectItem(selectedIndex.value)
}

function selectItem(index) {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}
</script>
