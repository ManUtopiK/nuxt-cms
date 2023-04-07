import { ref } from 'vue'
import {
  NetlifyAuthenticator,
  ImplicitAuthenticator,
  PkceAuthenticator,
} from 'netlify-cms-lib-auth'

const clientSideAuthenticators = {
  pkce: ({ base_url, auth_endpoint, app_id, auth_token_endpoint }) =>
    new PkceAuthenticator({
      base_url,
      auth_endpoint,
      app_id,
      auth_token_endpoint,
    }),

  implicit: ({ base_url, auth_endpoint, app_id, clearHash }) =>
    new ImplicitAuthenticator({ base_url, auth_endpoint, app_id, clearHash }),

  netlify: ({ base_url, auth_endpoint, site_id }) =>
    new NetlifyAuthenticator({
      base_url,
      auth_endpoint,
      site_id,
    }),
}

const auth = ref()
let api_url

type Args = {
  auth_type?: string
  base_url?: string
  auth_endpoint?: string
  app_id?: string
}

export const useGitX = ({
  auth_type = 'pkce',
  base_url = 'https://gitlab.com',
  auth_endpoint = 'oauth/authorize',
  app_id = '',
}: Args = {}) => {
  const Authenticator = clientSideAuthenticators[auth_type]({
    base_url,
    auth_endpoint,
    app_id,
    auth_token_endpoint: 'oauth/token',
  })

  const authenticate = () => {
    Authenticator.authenticate({ provider: 'gitlab', scope: 'api' })
  }

  const completeAuth = () => {
    api_url = base_url
    return new Promise((resolve, reject) => {
      Authenticator.completeAuth((err, data) => {
        if (err) {
          reject(err)
        }
        auth.value = data
        resolve(auth)
      })
    })
  }

  const query = async (query) => {
    const results = await fetch(`${api_url}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${auth.value.token_type} ${auth.value.access_token}`,
      },
      body: JSON.stringify({
        query,
      }),
    })
    return (await results.json()).data
  }

  return { authenticate, completeAuth, auth, query, Authenticator }
}
