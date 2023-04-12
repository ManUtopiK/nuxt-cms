import { existsSync } from 'node:fs'
import { join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'
import { addServerHandler, defineNuxtModule, createResolver, addComponentsDir, addImports, addImportsDir, addPlugin, addServerPlugin, extendPages, installModule, logger } from '@nuxt/kit'
import type { ViteDevServer } from 'vite'
import { searchForWorkspaceRoot } from 'vite'
import defu from 'defu'
import sirv from 'sirv'
import c from 'picocolors'

import NuxtMonacoEditor from 'nuxt-monaco-editor'

import { version } from '../package.json'
import type { ModuleOptions } from '../../nuxt-cms-kit/src/types'
import { clientDir, monorepoDir, packageDir, runtimeDir } from './dirs'
import { ROUTE_CLIENT, ROUTE_ENTRY } from './constant'

// https://github.com/nuxtlabs/github-module/blob/main/src/module.ts
export async function enableModule(options: ModuleOptions, nuxt: Nuxt) {
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

  // nuxt-cms-client

  const clientDirExists = existsSync(clientDir)

  // Mount nuxt-cms-client
  if (config.mode !== 'standalone') {
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: join(monorepoDir, 'apps/nuxt-cms-client/.output/public'),
        baseURL: ROUTE_CLIENT
        // maxAge: 60 * 60 * 24 * 365 // 1 year
      })
    })
  } else {
    // Proxy nuxt-cms-client in dev mode
    // const port = 39893 //3001
    // installModule(NuxtProxy, {
    //   options: {
    //     target: `http://localhost:${port}`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/__skip_vite': '',
    //     },
    //     pathFilter: [ROUTE_CLIENT],
    //   }
    // })
    // logger.success(`Proxy nuxt-cms-client enabled for dev mode on port ${c.yellow(port)}`)
  }

  // nuxt.hook('vite:extendConfig', (config) => {
  //   config.server ||= {}
  //   config.server.fs ||= {}
  //   config.server.fs.allow ||= [
  //     searchForWorkspaceRoot(process.cwd()),
  //   ]
  //   // console.log('pppp', packageDir)
  //   config.server.fs.allow.push(clientDir)
  // })

  // nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
  //   console.log(clientDir)
  //   // serve the front end in production
  //   // TODO check dev mode https://github.com/lukeed/sirv/tree/master/packages/sirv#optsdev
  //   if (clientDirExists)
  //     server.middlewares.use(ROUTE_CLIENT, sirv(clientDir, { single: true, dev: true }))
  // })

  await nuxt.callHook('cms:initialized')

  logger.success(`Nuxt CMS is enabled ${c.dim(`v${version}`)} ${c.yellow('(experimental)')}`)

  // @ts-ignore
  // console.log(nuxt)
  // nuxt.hook('nitro:config', async (nitro) => {
  //   console.log(nitro)
  // })
  // nuxt.hook('content:file:beforeParse', (file) => {
  //   console.log(file)
  //   if (file._id.endsWith('.md')) {
  //     // TODO Parse files to find link and build relationship database
  //     // file.body = file.body.replace(/react/g, 'vue')
  //   }
  // })
  // nuxt.hook('modules:done', async (nitro) => {
  //   console.log(nitro)
  //   nitro.hooks.hook('content:file:beforeParse', (file) => {
  //     console.log(file)
  //     if (file._id.endsWith('.md')) {
  //       // TODO Parse files to find link and build relationship database
  //       file.body = file.body
  //     }
  //   })
  // })
}
