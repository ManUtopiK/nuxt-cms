import type { NuxtCmsClient, NuxtCmsHostClient, NuxtCmsIframeClient } from '../../types'
import type { GitConnectClient } from 'git-connect-lib'

const user = ref()
let git = ref<GitConnectClient>()

export function useCms() {

  function onLogout() {
    git.value?.auth.logout() // Remove cookie and session
    user.value = undefined // Remove user
    // Remove iframe
    document.querySelector('#nuxt-cms-container')?.remove()
    document.body.classList.remove('nuxt-cms', 'left', 'right', 'top', 'bottom')
  }
  async function onLogin() {
    user.value = await git.value?.auth.login() // Remove cookie and session
    window.location.reload() // TODO Mount iframe instead of reload
  }

  return {
    git,
    user,
    onLogin,
    onLogout
  }
}
