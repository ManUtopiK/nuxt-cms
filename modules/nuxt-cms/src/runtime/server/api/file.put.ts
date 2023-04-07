import { writeFileSync } from 'node:fs'
import { createResolver, logger } from '@nuxt/kit'
import c from 'picocolors'

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {}

  const body = (await readRawBody(event, 'utf8'))?.toString()

  const { resolve } = createResolver(import.meta.url)
  const runtimeDir = resolve('runtime')

  try {
    await writeFileSync(resolve(runtimeDir, `../../../content/${slug}`), body as string)

    logger.success(`[Nuxt CMS] File wrote : ${c.yellow(slug)}`)
    return 'done'
  } catch (error) {
    return error
  }
})
