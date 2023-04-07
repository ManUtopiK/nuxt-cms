import type { ModuleOptions } from './types'

export const ROUTE_PATH = '/__nuxt_cms__'
export const ROUTE_ENTRY = `${ROUTE_PATH}/entry`
export const ROUTE_CLIENT = `${ROUTE_PATH}/client`

export const defaultOptions: ModuleOptions = {
  enabled: undefined, // determine multiple conditions
  mode: 'embedded',
  remote: {
    appId: '',
    repo: '',
    branch: 'main',
    redirectPath: '/admin/redirect',
  },
  devSource: 'repo'
}
