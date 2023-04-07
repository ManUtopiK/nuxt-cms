<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'
import type { NuxtCmsHostClient, NuxtCmsViewGlobal } from '../../../types'
import { PANEL_MAX, PANEL_MIN, closePanel, settings, state } from './state'
import { useEventListener } from './utils'

// Can't use reactivity transform here because this file is shipped as-is,
// where we can't guarantee that the user has the reactivity transform enabled.
// Same for not using auto imports.
const props = defineProps({
  client: Object as PropType<NuxtCmsHostClient>,
})

const CLIENT_PATH = '/__nuxt_cms__/client'

const initialUrl = CLIENT_PATH + state.value.route

const iframe = ref<HTMLIFrameElement>()
const isDragging = ref<false | 'vertical' | 'horizontal'>(false)

const frameStyle = computed(() => {
  if (state.value.position === 'left' || state.value.position === 'right') {
    return {
      top: 0,
      [state.value.position]: 0,
      height: '100vh',
      width: `calc(${state.value.width}vw)`,
    }
  }
  else {
    return {
      top: state.value.position === 'top' ? 0 : 'unset',
      bottom: state.value.position === 'bottom' ? 0 : 'unset',
      left: 0,
      // left: `calc(${(100 - state.value.width) / 2}vw + ${PANEL_PADDING}px)`,
      height: `calc(${state.value.height}vh)`,
      width: '100vw',
    }
  }
})

// The iframe emit onLoad, we wait for iframe client instance ready,
// and we watch for current instance change with setupClient.
async function onLoad() {
  await waitForClientInjection()
  setupClient()
}

function waitForClientInjection(retry = 10, timeout = 200) {
  console.log('frame', iframe.value)
  const test = () => !!iframe.value?.contentWindow?.__NUXT_CMS_VIEW__

  if (test())
    return

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (test()) {
        clearInterval(interval)
        resolve()
      }
      else if (retry-- <= 0) {
        clearInterval(interval)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Nuxt CMS client injection failed')
      }
    }, timeout)
  })
}

function refreshReactivity() {
  console.log('refresh')
  props.client?.hooks.callHook('host:update:reactivity')
}

function setupClient() {
  // trigger update for payload change
  // watch(() => props.client?.nuxt.payload, () => {
  //   console.log('payload', props.client?.nuxt.payload)
  //   refreshReactivity()
  // }, { deep: true })

  // trigger update for route change
  props.client?.nuxt.vueApp.config.globalProperties?.$router?.afterEach((route) => {
    console.log('navigate', route)
    // refreshReactivity()
    props.client?.hooks.callHook('host:navigate', route.path)
  })

  // trigger update for app mounted
  props.client?.nuxt.hook('app:mounted', () => {
    console.log('app:mounted', props.client)
    refreshReactivity()
  })

  updateClient()
}

function updateClient() {
  const injection = iframe.value?.contentWindow?.__NUXT_CMS_VIEW__ as NuxtCmsViewGlobal

  injection?.setClient({
    ...props.client as any
  })

  // props.client?.hooks.hook('host:navigate', (path) => {
  //   console.log('hook:host:navigate in Frame', path)
  //   state.value.route = path
  // })
}

useEventListener(window, 'mousemove', (e: MouseEvent) => {
  if (!isDragging.value)
    return

  if (isDragging.value === 'horizontal') {
    state.value.height = state.value.position === 'top'
      ? Math.max(PANEL_MIN, e.clientY / window.innerHeight * 100)
      : Math.max(PANEL_MIN, (window.innerHeight - e.clientY) / window.innerHeight * 100)
  }

  if (isDragging.value === 'vertical') {
    state.value.width = state.value.position === 'left'
      ? Math.max(PANEL_MIN, e.clientX / window.innerWidth * 100)
      : Math.max(PANEL_MIN, (window.innerWidth - e.clientX) / window.innerWidth * 100)
  }
})

useEventListener(window, 'mouseup', () => {
  isDragging.value = false
})

useEventListener(window, 'mouseleave', () => {
  isDragging.value = false
})

// Close panel on outside click (when enabled)
useEventListener(window, 'mousedown', (e: MouseEvent) => {
  if (!settings.value.interactionCloseOnOutsideClick)
    return
  if (!state.value.open || isDragging.value)
    return

  const matched = e.composedPath().find((_el) => {
    const el = _el as HTMLElement
    return Array.from(el.classList || []).some(c => c.startsWith('nuxt-cms-'))
      || el.tagName?.toLowerCase() === 'iframe'
  })

  if (!matched)
    state.value.open = false
})

watchEffect(() => {
  if (!state.value.open)
    iframe.value?.blur()
  else
    iframe.value?.focus()
})
</script>

<script lang="ts">
declare global {
  interface Window {
    __NUXT_CMS_VIEW__?: NuxtCMSViewGlobal
    __NUXT_CMS__?: NuxtCMSIframeClient
  }
}
</script>

<template>
  <div v-show="state.open" class="nuxt-cms-frame" :style="frameStyle">
    <iframe ref="iframe" :src="initialUrl" :style="{
      'pointer-events': isDragging ? 'none' : 'auto',
    }" @load="onLoad" />
    <div v-if="state.position === 'bottom'" class="nuxt-cms-resize-handle nuxt-cms-resize-handle-horizontal"
      :style="{ top: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
    <div v-if="state.position === 'top'" class="nuxt-cms-resize-handle nuxt-cms-resize-handle-horizontal"
      :style="{ bottom: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
    <div v-if="state.position === 'right'" class="nuxt-cms-resize-handle nuxt-cms-resize-handle-vertical"
      :style="{ left: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
    <div v-if="state.position === 'left'" class="nuxt-cms-resize-handle nuxt-cms-resize-handle-vertical"
      :style="{ right: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
  </div>
</template>

<style scoped>
.nuxt-cms-frame {
  position: fixed;
  min-width: 50px;
  min-height: 50px;
  z-index: 2147483646;
}

.nuxt-cms-frame iframe {
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 0;
}

.nuxt-cms-resize-handle-horizontal {
  position: absolute;
  left: 6px;
  right: 6px;
  height: 10px;
  margin: -5px 0;
  cursor: ns-resize;
  border-radius: 5px;
}

.nuxt-cms-resize-handle-vertical {
  position: absolute;
  top: 6px;
  bottom: 0;
  width: 10px;
  margin: 0 -5px;
  cursor: ew-resize;
  border-radius: 5px;
}

.nuxt-cms-resize-handle-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: -6px;
  border-radius: 6px;
}

.nuxt-cms-resize-handle:hover {
  background: rgba(125, 125, 125, 0.1);
}
</style>
