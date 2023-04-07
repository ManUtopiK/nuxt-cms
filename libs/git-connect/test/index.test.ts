import { describe, expect, it } from 'vitest'
import { createClient } from '../src'

describe('Its createClient', () => {
  const gitlab = createClient({
    api: 'https://gitlab.com',
    appId: 'xxx'
  })

  it('returns gitlab GitAuthClient', () => {
    expect(gitlab).toMatchSnapshot()
  })

  const github = createClient({
    api: 'https://github.com',
    appId: 'xxx'
  })

  it('returns github GitAuthClient', () => {
    expect(github).toMatchSnapshot()
  })
})
