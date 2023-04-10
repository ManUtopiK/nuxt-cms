import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  const frameState = useCmsFrameState()

  // Open the iframe when route change
  if (frameState.value.width === 0) {
    frameState.value.width = frameState.value.lastWidth
  }

  if (to.path === '/' && !isFirstVisit.value) {
    return navigateTo('/modules/overview')
  }
})
