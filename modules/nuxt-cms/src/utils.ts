import { execa, execaSync } from 'execa'
import { clientDir } from './dirs'

export function generateCmsClient (args: string[]) {
  execaSync('npx', args, {
    cwd: clientDir,
    stdio: 'inherit',
    env: {
      COLORS: 'true',
      FORCE_COLOR: 'true',
      NUXT_CMS_EMBEDDED: 'true'
    }
  })
}

export function devCmsClient (args: string[]) {
  execa('npx', args, {
    cwd: clientDir,
    stdio: 'inherit',
    env: {
      COLORS: 'true',
      FORCE_COLOR: 'true',
      NUXT_CMS_EMBEDDED: 'true',
      // Pass the local directory for dev mode
      NUXT_CMS_HOST_DIR: process.cwd()
    }
  })
}
