// @ts-expect-error missin types
import presetIcons from '@unocss/preset-icons/browser'
import initUnocssRuntime from '@unocss/runtime'

initUnocssRuntime({
  defaults: {
    presets: [
      presetIcons({
        prefix: ['i-'],
        collections: {
          carbon: () => import('@iconify-json/carbon/icons.json').then(r => r.default),
          ri: () => import('@iconify-json/ph/icons.json').then(r => r.default),
        },
        cdn: 'https://esm.sh/',
        scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
    ],
  },
})