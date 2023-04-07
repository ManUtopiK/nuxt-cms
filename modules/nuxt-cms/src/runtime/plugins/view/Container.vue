<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { NuxtCmsHostClient } from '../../../types'
import { state, togglePanel } from './state'
import Frame from './Frame.vue'

defineProps({
  client: Object as PropType<NuxtCmsHostClient>,
})

const initialized = ref(state.value.open)
watch(() => state.value.open, (open) => {
  if (open) {
    initialized.value = open
    document.body.classList.add('nuxt-cms', state.value.position.toLocaleLowerCase())
  } else {
    document.body.classList.remove('left', 'right', 'top', 'bottom')
  }
}, { immediate: true })

watch(() => state.value.position, (position) => {
  document.body.classList.remove('left', 'right', 'top', 'bottom')
  document.body.classList.add(position.toLocaleLowerCase())
})

const isOpen = computed(() => state.value.open)
const rotateZ = computed(() => state.value.position === 'bottom' ? '180' : state.value.position === 'left' ? '-90' : state.value.position === 'right' ? '90' : '0')
function getToggleButtonPosition() {
  if (state.value.position === 'left') {
    return {
      'left': '-8px',
      'top': 'calc(5% - 25px)',
      'height': '35px',
      'width': '35px',
      'borderRadius': '0 100px 100px 0',
      '--hover-translate': 'translateX(3px)',
    }
  }
  if (state.value.position === 'right') {
    return {
      'right': '-8px',
      'top': 'calc(5% - 25px)',
      'height': '35px',
      'width': '35px',
      'borderRadius': '100px 0 0 100px',
      '--hover-translate': 'translateX(-3px)',
    }
  }
  if (state.value.position === 'top') {
    return {
      'top': '-3px',
      'left': 'calc(5% - 25px)',
      'borderRadius': '0 0 100px 100px',
      'height': '30px',
      'width': '40px',
      '--hover-translate': 'translate(0, 3px)',
    }
  }
  return {
    'bottom': '-5px',
    'left': 'calc(5% - 25px)',
    'borderRadius': '100px 100px 0 0',
    'height': '30px',
    'width': '40px',
    '--hover-translate': 'translate(0, -3px)',
  }
}
</script>

<template>
  <transition :name="`body-slide-${state.position}`">
    <Frame v-if="initialized" :client="client" />
  </transition>

  <button v-if="!isOpen" class="nuxt-cms-toggle" aria-label="Toggle cms panel" aria-expanded="true"
    :style="getToggleButtonPosition()" @click="togglePanel()">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"
      :style="`transform: rotateZ(${rotateZ}deg);`">
      <path fill="currentColor"
        d="m216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z" />
    </svg>
  </button>
</template>

<style>
body.nuxt-cms.left {
  margin-left: 50px;
}

body.nuxt-cms.right {
  margin-right: 50px;
}

body.nuxt-cms.top {
  margin-top: 50px;
}

body.nuxt-cms,
.body-slide-left-enter-active,
.body-slide-left-leave-active,
.body-slide-right-enter-active,
.body-slide-right-leave-active,
.body-slide-top-enter-active,
.body-slide-top-leave-active,
.body-slide-bottom-enter-active,
.body-slide-bottom-leave-active {
  transition: margin 0.5s;
}

.body-slide-left-enter-from,
.body-slide-left-leave-to {
  margin-left: -50px;
}

.body-slide-right-enter-from,
.body-slide-right-leave-to {
  margin-right: -50px;
}

.body-slide-top-enter-from,
.body-slide-top-leave-to {
  margin-top: -50px;
}

.body-slide-bottom-enter-from,
.body-slide-bottom-leave-to {
  margin-bottom: -50px;
}
</style>

<style scoped>
.nuxt-cms-toggle {
  position: fixed;
  background: rgba(34, 197, 94, 1) !important;
  border: 1px solid rgba(125, 125, 125, 0.2);
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.1);
  z-index: 2147483647;
  cursor: pointer;
  opacity: 0.8;
  padding: 0;
  align-items: center;
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.nuxt-cms-toggle:hover {
  transform: var(--hover-translate);
  opacity: 1;
}

.nuxt-cms-toggle svg {
  width: 20px;
  height: 20px;
  margin: auto;
}
</style>
