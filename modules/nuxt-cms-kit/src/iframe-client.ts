import type { Ref } from 'vue'
import { shallowRef, triggerRef } from 'vue'
import type { NuxtCmsIframeClient } from './_types/client-api'

let clientRef: Ref<NuxtCmsIframeClient | undefined> | undefined
const hasSetup = false
const fns = [] as ((client: NuxtCmsIframeClient) => void)[]

export function onCmsClientConnected (fn: (client: NuxtCmsIframeClient) => void) {
  fns.push(fn)

  if (hasSetup) { return }

  // @ts-ignore injection
  if (window.__NUXT_CMS__) {
    // @ts-ignore injection
    fns.forEach(fn => fn(window.__NUXT_CMS__))
  }

  Object.defineProperty(window, '__NUXT_CMS__', {
    set (value) {
      if (value) { fns.forEach(fn => fn(value)) }
    },
    get () {
      return clientRef!.value
    },
    configurable: true
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

export function useCmsClient () {
  if (!clientRef) {
    clientRef = shallowRef<NuxtCmsIframeClient | undefined>()

    onCmsClientConnected(setup)
  }

  function setup (client: NuxtCmsIframeClient) {
    clientRef!.value = client
    if (client.host) {
      client.host.hooks.hook('host:update:reactivity', () => {
        triggerRef(clientRef!)
      })
    }
  }

  return clientRef
}
