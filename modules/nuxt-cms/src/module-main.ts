import { existsSync } from 'node:fs'
import { join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'
import { addServerHandler, defineNuxtModule, createResolver, addComponentsDir, addImports, addImportsDir, addPlugin, addServerPlugin, extendPages, installModule, logger } from '@nuxt/kit'
import { searchForWorkspaceRoot } from 'vite'
import defu from 'defu'
import c from 'picocolors'
import { getPort } from 'get-port-please'

import NuxtMonacoEditor from 'nuxt-monaco-editor'

import { version } from '../package.json'
import type { ModuleOptions } from '../../nuxt-cms-kit/src/types'
import { devCmsClient, generateCmsClient } from './build'

import { clientDir, monorepoDir, packageDir, runtimeDir } from './dirs'
import { ROUTE_CLIENT, ROUTE_ENTRY } from './constant'

// https://github.com/nuxtlabs/github-module/blob/main/src/module.ts
export async function enableModule (options: ModuleOptions, nuxt: Nuxt) {
  // TODO Check if remote is an Array
  const config: ModuleOptions = defu({
    remote: {
      api: process.env.api,
      appId: process.env.appId,
      repo: process.env.repo
    }
  }, options)

  console.log('nuxtCms config', config)

  await nuxt.callHook('cms:before')

  nuxt.options.runtimeConfig.public.nuxtCms = defu(
    nuxt.options.runtimeConfig.public.nuxtCms,
    config
  )

  nuxt.options.build.transpile.push(runtimeDir)

  addPlugin(join(runtimeDir, 'plugins/nuxt-cms.client'))
  // addServerPlugin(resolve(runtimeDir, 'before-parse-content'))

  // Add possibility to write local file in dev mode. Config dev API routes to read and write files.
  // TODO Done ? Use addDevServerHandler ? https://github.com/nuxt/nuxt/blob/80516147380a9b918a4d5d8d8e3ba02e8450561e/packages/kit/src/nitro.ts#L31
  if (nuxt.options.dev && config.devSource === 'local') {
    addServerHandler({
      route: '/api/_file/:slug',
      handler: join(runtimeDir, 'server/api/file.get')
    })
    addServerHandler({
      route: '/api/_file/:slug',
      handler: join(runtimeDir, 'server/api/file.put')
    })
  }

  // Install monaco editor module
  installModule(NuxtMonacoEditor)

  // Register composables
  addImports({
    name: 'useCms', as: 'useCms', from: join(runtimeDir, 'composables/useCms')
  })
  // addImportsDir(join(runtimeDir, 'composables'))

  extendPages((pages) => {
    // Add redirectPath page
    if (config.remote?.redirectPath) {
      pages.push({
        name: 'GitConnectRedirectPage',
        path: config.remote?.redirectPath as string,
        file: join(runtimeDir, 'pages/redirect.vue'),
        meta: {
          layout: false
        }
      })
    }
  })

  // Register components
  await addComponentsDir({
    path: join(runtimeDir, 'components'),
    pathPrefix: false,
    prefix: '',
    global: true
  })

  // Add monorepo components
  await addComponentsDir({
    path: join(monorepoDir, 'components/nuxt-content-editor/components'),
    pathPrefix: false,
    prefix: '',
    global: true
  })

  /**
   * nuxt-cms-client
   */
  const clientDirExists = existsSync(clientDir)
  if (clientDirExists) {
    // Mount client
    if (process.env.NODE_ENV === 'development') {
      const PORT = await getPort({ port: 12442 })

      nuxt.hook('app:resolve', () => {
      // Start client in a subprocess with dev mode
        devCmsClient(['nuxi', 'dev', '--port', PORT.toString()])
      })

      // Proxy client
      nuxt.hook('vite:extendConfig', (config) => {
        config.server ||= {}
        // add proxy to client
        config.server.proxy ||= {}
        config.server.proxy[ROUTE_CLIENT] = {
          target: `http://localhost:${PORT}`,
          changeOrigin: true,
          followRedirects: true
        }
        // add fs allow for local modules
        config.server.fs ||= {}
        config.server.fs.allow ||= [
          searchForWorkspaceRoot(process.cwd())
        ]
        config.server.fs.allow.push(packageDir)
      })
    } else {
      const clientBuildDir = join(clientDir, '.output/public')

      nuxt.hook('app:resolve', () => {
      // Check if client already been generated
        const clientBuildExists = existsSync(clientBuildDir)

        if (!clientBuildExists) {
          logger.info(`Building Nuxt cms client from \`${clientDir}\`\n`)
          generateCmsClient(['nuxi', 'generate'])
        }
      })

      // Copy to output
      // TODO Generate client directly in .output ?
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.publicAssets ||= []
        nitroConfig.publicAssets.push({
          dir: clientBuildDir,
          baseURL: ROUTE_CLIENT
          // maxAge: 60 * 60 * 24 * 365 // 1 year
        })
      })
    }
  } else {
    // What to do ?
  }

  await nuxt.callHook('cms:initialized')

  logger.success(`Nuxt CMS is enabled ${c.dim(`v${version}`)} ${c.yellow('(experimental)')}`)
}
