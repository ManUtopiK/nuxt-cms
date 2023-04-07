import PkceAuthenticator from './pkce-oauth'
import type { GitConnectClientOptions } from '../types'

const PROVIDERS = {
  github: {
    width: 960,
    height: 600,
  },
  gitlab: {
    width: 1100,
    height: 650,
  },
  bitbucket: {
    width: 960,
    height: 500,
  },
  email: {
    width: 500,
    height: 400,
  },
}
const COOKIE_NAME = 'git-connect-refresh-token'

const DEFAULTS = {
  authType: 'pkce',
  api: 'https://gitlab.com',
  authEndpoint: 'oauth/authorize',
  authTokenEndpoint: 'oauth/token',
  provider: 'gitlab',
  redirectPath: '/git-connect/redirect'
}

export default class GitAuthClient {
  private Authenticator: PkceAuthenticator
  public config
  public session
  public token_type: string
  public access_token: string

  constructor(options: GitConnectClientOptions) {
    if (!options.appId) {
      throw new Error('appId is required.')
    }

    const config = { ...DEFAULTS, ...options }
    this.config = config
    this.Authenticator = new PkceAuthenticator(config)
  }

  private _openPopup(url, windowName, parentWindow) {
    const conf = PROVIDERS[this.config.provider] || PROVIDERS.github
    const top =
      parentWindow.top.outerHeight / 2 +
      parentWindow.top.screenY -
      conf.height / 2
    const left =
      parentWindow.top.outerWidth / 2 +
      parentWindow.top.screenX -
      conf.width / 2

    return parentWindow.open(
      url,
      windowName,
      `width=${conf.width}, height=${conf.height}, top=${top}, left=${left}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`
    )
  }

  private _handshakeCallback(resolve, reject) {
    const fn = async (event) => {
      if (
        !event.isTrusted &&
        event.origin !== window.origin ||
        !event.data.access_token ||
        !event.data.refresh_token
      ) {
        return
      }

      window.removeEventListener(
        'message',
        this._handshakeCallback(resolve, reject),
        false
      )

      // Store token
      this.session = event.data
      this._storeRefreshToken(event.data.refresh_token)

      // Return user
      const user = await this.getUser()
      resolve(user)
    }

    return fn
  }

  private _storeRefreshToken(token) {
    // TODO Store cookie with unique name for each remote
    setCookie(COOKIE_NAME, token, {
      // HttpOnly: true,
      SameSite: 'strict',
      // path: '/auth',
    })
  }

  private async _authenticate() {
    const refresh_token = getCookie(COOKIE_NAME)
    await this.refreshToken(refresh_token)
  }

  async login() {
    if (this.session?.access_token) { return await this.getUser() }

    const url = await this.Authenticator.getAuthenticateUrl(
      { scope: 'api' },
      null
    )

    this._openPopup(url, 'Authorization', window)

    return new Promise((resolve, reject) => {
      window.addEventListener(
        'message',
        this._handshakeCallback(resolve, reject),
        false
      )
    })
  }

  finalizeAuth() {
    this.Authenticator.completeAuth((data) => {
      window.opener.postMessage(data, window.origin)
      window.close()
    })
  }

  logout() {
    deleteCookie(COOKIE_NAME)
    delete this.session
  }

  async refreshToken(refresh_token?: string) {
    if (!refresh_token && !this.session?.refresh_token) {
      throw new Error('no refresh_token')
    }

    const response = await fetch(`${this.config.api}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.appId,
        refresh_token: refresh_token || this.session.refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      deleteCookie(COOKIE_NAME)
      throw new Error('refresh_token expired.')
    }

    this.session = await response.json()
    this._storeRefreshToken(this.session.refresh_token)

    return this.session
  }

  getSession() {
    return this.session
  }

  getCookie() {
    return getCookie(COOKIE_NAME)
  }

  async getToken(): Promise<string> {
    if (!this.session?.access_token) {
      try {
        await this._authenticate()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('No access token.')
        return
      }
    }

    return `${this.session.token_type} ${this.session.access_token}`
  }

  async getUser(jwt?: string) {
    if (!jwt && !this.session?.access_token) {
      try {
        await this._authenticate()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('No access token.')
        return
      }
    }

    const response = await fetch(`${this.config.api}/api/v4/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt || await this.getToken(),
      },
    })
    const data = await response.json()

    return data
  }
}

function setCookie(name, value, options = {}) {
  const mergedoptions = {
    path: '/',
    expires: null,
    // add other defaults here if necessary
    ...options,
  }

  if (mergedoptions.expires instanceof Date) {
    mergedoptions.expires = mergedoptions.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (const optionKey in mergedoptions) {
    updatedCookie += '; ' + optionKey
    const optionValue = mergedoptions[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }
  document.cookie = updatedCookie
}

function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1,
  })
}
