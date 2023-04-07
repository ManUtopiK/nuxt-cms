import GitAuthClient from './lib/GitAuthClient'
import { GitConnectClientOptions } from './types'

export default class GitConnectClient {
  auth: GitAuthClient
  api: string
  options: GitConnectClientOptions

  constructor(options: GitConnectClientOptions) {
    // TODO Detect github and gitlab, or provider and dispatch GitAuth...
    this.auth = new GitAuthClient({ ...options })
    this.api = this.auth.config.api
    Object.assign(this, options)
  }

  async query({ query, variables }: { query: any, variables?: object }) {
    const results = await fetch(`${this.api}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: await this.auth.getToken(),
      },
      body: JSON.stringify({ query, ...(variables && { variables }) }),
    })
    return await results.json()
  }
}
