import { readFileSync } from 'node:fs'
import { createResolver } from '@nuxt/kit'

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {}

  const { resolve } = createResolver(import.meta.url)
  const runtimeDir = resolve('runtime')

  try {
    const body = await readFileSync(resolve(runtimeDir, `../../../content/${slug}`), 'utf8')
    return body
  } catch (error) {
    return error
  }
})
