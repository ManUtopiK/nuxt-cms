import GitConnectClient from './GitConnectClient'
import { GitConnectClientOptions } from './types'

export { default as GitConnectClient } from './GitConnectClient'
export type { GitConnectClientOptions } from './types'

export const createClient = (options: GitConnectClientOptions): GitConnectClient => {
  // Skip if it's running in node.js
  // if (typeof window === 'undefined') { return }

  return new GitConnectClient(options)
}
