<script setup lang="ts">
import 'floating-vue/dist/style.css'
// import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import 'splitpanes/dist/splitpanes.css'
import './styles/global.css'

useHead({
  title: 'Nuxt CMS',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ],
  htmlAttrs: {
    class: 'of-hidden'
  }
  // link: [
  //   {
  //     rel: 'icon',
  //     type: 'image/svg+xml',
  //     href: '/nuxt.svg',
  //   },
  // ],
})

// const client = useClient()
// addEventListener('keypress', (e) => {
//   if (e.code === 'KeyD' && e.altKey) {
//     client.value?.closeDevTools()
//     e.preventDefault()
//   }
// })

const frameState = useCmsFrameState()

onBeforeMount(() => {
  // We reset the width of the iframe before mounting
  // No effect in standalone mode
  frameState.value.width = 0
})

const { scale } = useCmsSettings()

onMounted(() => {
  // Used to inject client in IframeView.vue
  const injectClient = useInjectionClient()
  watchEffect(() => {
    window.__NUXT_CMS__ = injectClient.value
  })

  watchEffect(() => {
    document.body.style.fontSize = `${scale.value * 15}px`
  })
})
</script>

<template>
  <!-- <NuxtLoadingIndicator /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- <DisconnectIndicator /> -->
</template>
