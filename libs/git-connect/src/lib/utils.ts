// import { v4 as uuidv4 } from 'uuid'
// import { v4 as uuid } from '@lukeed/uuid'

const GIT_STORAGE_KEY = 'git-auth'

export function createNonce() {
  const nonce = crypto.randomUUID()
  window.sessionStorage.setItem(GIT_STORAGE_KEY, JSON.stringify({ nonce }))
  return nonce
}

export function validateNonce(check) {
  const auth = window.sessionStorage.getItem(GIT_STORAGE_KEY)
  const valid = auth && JSON.parse(auth).nonce
  window.localStorage.removeItem(GIT_STORAGE_KEY)
  return check === valid
}

export function isInsecureProtocol() {
  return (
    document.location.protocol !== 'https:' &&
    // TODO: Is insecure localhost a bad idea as well? I don't think it is, since you are not actually
    //       sending the token over the internet in this case, assuming the auth URL is secure.
    document.location.hostname !== 'localhost' &&
    document.location.hostname !== '127.0.0.1'
  )
}
