import type { GitConnectClient } from 'git-connect-lib'
import { createStorage, defineDriver } from 'unstorage'
import type { NuxtCmsClient, NuxtCmsHostClient, NuxtCmsIframeClient } from '../../types'
import type { GitlabOptions } from '../../drivers/gitlab'
// import gitlabDriver from '../../drivers/gitlab'

const user = ref()
const git = ref<GitConnectClient>()

// const driver = defineDriver(gitlabDriver)

export function useCms () {
  const nuxtApp = useNuxtApp()

  // const unstorage = createStorage({})

  // const registerGitRepo = (config: GitlabOptions) => {
  //   return unstorage.mount('git:content', driver(config))
  // }

  const storage = useState('cms-client-db', () => null)

  if (!storage.value) {
    nuxtApp.hook('content:storage', (_storage) => {
      storage.value = _storage
    })
  }

  const onLogout = () => {
    git.value?.auth.logout() // Remove cookie and session
    user.value = undefined // Remove user
    // Remove iframe
    document.querySelector('#nuxt-cms-container')?.remove()
    document.body.classList.remove('nuxt-cms', 'left', 'right', 'top', 'bottom')
  }
  const onLogin = async () => {
    user.value = await git.value?.auth.login() // Remove cookie and session
    window.location.reload() // TODO Mount iframe instead of reload
  }

  return {
    git,
    user,
    onLogin,
    onLogout,
    // registerGitRepo,
    storage
    // unstorage
  }
}
