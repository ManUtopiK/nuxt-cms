import { eventHandler, isMethod, readBody } from 'h3'

// @ts-ignore
import { useStorage } from '#imports'

export default eventHandler(async (event) => {
  const storage = useStorage()

  const _id = event?.context?.params?.name.replaceAll('/', ':')
  const key = `content:source:${_id}`

  if (isMethod(event, 'POST')) {
    const body = await readBody(event)
    // await fsp.writeFile(filePath, body.source, 'utf-8')
    return {
      _id
    }
  }

  if (isMethod(event, 'PUT')) {
    const body = await readBody(event)
    await storage.setItem(key, body)

    return {
      _id
    }
  }

  if (isMethod(event, 'DELETE')) {
    // await fsp.unlink(filePath).catch(ignoreNotfound)
    return {
      _id
    }
  }

  const _raw = await storage.getItem(key)

  return {
    _id,
    _raw
  }
})
