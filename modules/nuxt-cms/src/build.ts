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
      NUXT_CMS_EMBEDDED: 'true'
    }
  })
}
