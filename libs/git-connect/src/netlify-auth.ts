const NETLIFY_API = 'https://api.netlify.com'
const AUTH_ENDPOINT = 'auth'

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

class NetlifyError {
  err: {
    message: String
  }

  constructor(err) {
    this.err = err
  }

  toString() {
    return this.err && this.err.message
  }
}

const PROVIDERS = {
  github: {
    width: 960,
    height: 600,
  },
  gitlab: {
    width: 960,
    height: 600,
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

class Authenticator {
  siteId: String
  baseUrl: String
  authEndpoint: String
  authWindow: {
    postMessage: Function
    close: Function
    focus: Function
  }

  constructor(config = {}) {
    this.siteId = config.siteId || null
    this.baseUrl = trim(config.baseUrl, '/') || NETLIFY_API
    this.authEndpoint = trim(config.authEndpoint, '/') || AUTH_ENDPOINT
  }

  handshakeCallback(options, cb) {
    const fn = (e) => {
      if (
        e.data === 'authorizing:' + options.provider &&
        e.origin === this.baseUrl
      ) {
        window.removeEventListener('message', fn, false)
        window.addEventListener(
          'message',
          this.authorizeCallback(options, cb),
          false
        )
        return this.authWindow.postMessage(e.data, e.origin)
      }
    }
    return fn
  }

  authorizeCallback(options, cb) {
    const fn = (e) => {
      if (e.origin !== this.baseUrl) {
        return
      }

      if (
        e.data.indexOf('authorization:' + options.provider + ':success:') === 0
      ) {
        const data = JSON.parse(
          e.data.match(
            new RegExp('^authorization:' + options.provider + ':success:(.+)$')
          )[1]
        )
        window.removeEventListener('message', fn, false)
        this.authWindow.close()
        cb(null, data)
      }
      if (
        e.data.indexOf('authorization:' + options.provider + ':error:') === 0
      ) {
        const err = JSON.parse(
          e.data.match(
            new RegExp('^authorization:' + options.provider + ':error:(.+)$')
          )[1]
        )
        window.removeEventListener('message', fn, false)
        this.authWindow.close()
        cb(new NetlifyError(err))
      }
    }
    return fn
  }

  getSiteID() {
    if (this.siteId) {
      return this.siteId
    }
    const host = document.location.host.split(':')[0]
    return host === 'localhost' ? 'cms.netlify.com' : host
  }

  authenticate(options, cb) {
    const { provider } = options
    const siteID = this.getSiteID()

    if (!provider) {
      return cb(
        new NetlifyError({
          message:
            'You must specify a provider when calling netlify.authenticate',
        })
      )
    }
    if (!siteID) {
      return cb(
        new NetlifyError({
          message:
            "You must set a siteId with netlify.configure({siteId: 'your-site-id'}) to make authentication work from localhost",
        })
      )
    }

    const conf = PROVIDERS[provider] || PROVIDERS.github
    const left = screen.width / 2 - conf.width / 2
    const top = screen.height / 2 - conf.height / 2
    window.addEventListener(
      'message',
      this.handshakeCallback(options, cb),
      false
    )
    let url = `${this.baseUrl}/${this.authEndpoint}?provider=${options.provider}&siteId=${siteID}`
    if (options.scope) {
      url += '&scope=' + options.scope
    }
    if (options.login === true) {
      url += '&login=true'
    }
    if (options.beta_invite) {
      url += '&beta_invite=' + options.beta_invite
    }
    if (options.invite_code) {
      url += '&invite_code=' + options.invite_code
    }
    this.authWindow = window.open(
      url,
      'Netlify Authorization',
      `width=${conf.width}, height=${conf.height}, top=${top}, left=${left}`
    )
    this.authWindow.focus()
  }

  refresh(options, cb) {
    const { provider, refresh_token } = options
    const siteID = this.getSiteID()
    const onError = cb || Promise.reject.bind(Promise)

    if (!provider || !refresh_token) {
      return onError(
        new NetlifyError({
          message:
            'You must specify a provider and refresh token when calling netlify.refresh',
        })
      )
    }
    if (!siteID) {
      return onError(
        new NetlifyError({
          message:
            "You must set a siteId with netlify.configure({siteId: 'your-site-id'}) to make token refresh work from localhost",
        })
      )
    }
    const url = `${this.baseUrl}/${this.authEndpoint}/refresh?provider=${provider}&siteId=${siteID}&refresh_token=${refresh_token}`
    const refreshPromise = fetch(url, { method: 'POST', body: '' }).then(
      (res) => res.json()
    )

    // Return a promise if a callback wasn't provided
    if (!cb) {
      return refreshPromise
    }

    // Otherwise, use the provided callback.
    refreshPromise.then((data) => cb(null, data)).catch(cb)
  }
}

export default Authenticator
