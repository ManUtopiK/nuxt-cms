import { createNonce, validateNonce, isInsecureProtocol } from './utils'

function trim(str, ch) {
  let start = 0
  let end = str.length

  while (start < end && str[start] === ch) {
    ++start
  }

  while (end > start && str[end - 1] === ch) {
    --end
  }

  return start > 0 || end < str.length ? str.substring(start, end) : str
}

async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  const sha = String.fromCharCode(...new Uint8Array(digest))
  return sha
}

// based on https://github.com/auth0/auth0-spa-js/blob/9a83f698127eae7da72691b0d4b1b847567687e3/src/utils.ts#L147
function generateVerifierCode() {
  // characters that can be used for codeVerifer
  // excludes _~ as if included would cause an uneven distribution as char.length would no longer be a factor of 256
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.'
  const randomValues = Array.from(
    window.crypto.getRandomValues(new Uint8Array(128))
  )
  return randomValues
    .map((val) => {
      return chars[val % chars.length]
    })
    .join('')
}

async function createCodeChallenge(codeVerifier) {
  const sha = await sha256(codeVerifier)
  // https://tools.ietf.org/html/rfc7636#appendix-A
  return btoa(sha).split('=')[0].replace(/\+/g, '-').replace(/\//g, '_')
}

const CODE_VERIFIER_STORAGE_KEY = 'cms-pkce-verifier-code'

function createCodeVerifier() {
  const codeVerifier = generateVerifierCode()
  window.sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier)
  return codeVerifier
}

function getCodeVerifier() {
  return window.sessionStorage.getItem(CODE_VERIFIER_STORAGE_KEY)
}

function clearCodeVerifier() {
  window.sessionStorage.removeItem(CODE_VERIFIER_STORAGE_KEY)
}

type Config = {
  api: string
  authEndpoint: string
  authTokenEndpoint: string
  appId: string
  redirectPath: string
}

export default class PkceAuthenticator {
  authUrl: string
  authTokenUrl: string
  appId: string
  redirectPath: string

  constructor(config: Config) {
    const api = trim(config.api, '/')
    const authEndpoint = trim(config.authEndpoint, '/')
    const authTokenEndpoint = trim(config.authTokenEndpoint, '/')
    this.authUrl = `${api}/${authEndpoint}`
    this.authTokenUrl = `${api}/${authTokenEndpoint}`
    this.appId = config.appId
    this.redirectPath = config.redirectPath
  }

  async getAuthenticateUrl(options, cb) {
    if (isInsecureProtocol()) {
      return cb(new Error('Cannot authenticate over insecure protocol!'))
    }

    const authURL = new URL(this.authUrl)
    authURL.searchParams.set('client_id', this.appId)
    authURL.searchParams.set(
      'redirect_uri',
      document!.location.origin + (this.redirectPath || document?.location.pathname)
    )
    authURL.searchParams.set('response_type', 'code')
    authURL.searchParams.set('scope', options.scope)

    const state = JSON.stringify({ auth_type: 'pkce', nonce: createNonce() })

    authURL.searchParams.set('state', state)

    authURL.searchParams.set('code_challenge_method', 'S256')
    const codeVerifier = createCodeVerifier()
    const codeChallenge = await createCodeChallenge(codeVerifier)
    authURL.searchParams.set('code_challenge', codeChallenge)

    return authURL.href
  }

  /**
   * Complete authentication if we were redirected back to from the provider.
   */
  async completeAuth(cb) {
    const params = new URLSearchParams(document.location.search)

    // Remove code from url
    // window.history.replaceState(null, '', document.location.pathname)

    if (!params.has('code') && !params.has('error')) {
      return
    }

    const { nonce } = JSON.parse(params.get('state'))
    const validNonce = validateNonce(nonce)
    if (!validNonce) {
      return cb(new Error('Invalid nonce'))
    }

    if (params.has('error')) {
      return cb(
        new Error(`${params.get('error')}: ${params.get('error_description')}`)
      )
    }

    if (params.has('code')) {
      const code = params.get('code')
      const authURL = new URL(this.authTokenUrl)
      authURL.searchParams.set('client_id', this.appId)
      authURL.searchParams.set('code', code)
      authURL.searchParams.set('grant_type', 'authorization_code')
      authURL.searchParams.set(
        'redirect_uri',
        document.location.origin + document.location.pathname
      )
      authURL.searchParams.set('code_verifier', getCodeVerifier())
      // no need for verifier code so remove
      clearCodeVerifier()

      const response = await fetch(authURL.href, { method: 'POST' })
      const data = await response.json()

      cb(data)
    }
  }
}
