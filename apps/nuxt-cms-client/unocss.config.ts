import { defineConfig } from 'unocss' //, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

// import { extendUnocssOptions } from '@nuxt/devtools-ui-kit/unocss'
// Hack for unocss @nuxt/devtools-ui-kit bug
import { parseColor } from '@unocss/preset-mini/utils'
import { theme } from '@unocss/preset-mini'
import { fonts } from '@unocss/preset-mini/rules'
import { mergeDeep, presetUno, presetAttributify, presetTypography, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

// Hack for unocss @nuxt/devtools-ui-kit bug
const unocssPreset = () => ({
  name: "@nuxt/devtools-ui-kit",
  theme: mergeDeep(theme, {
    colors: {
      context: "rgba(var(--nui-c-context),%alpha)"
    },
    fontFamily: {
      sans: "Avenir, Helvetica, Arial, sans-serif"
    }
  }),
  rules: [
    [/^n-(.*)$/, ([, body], { theme }) => {
      const color = parseColor(body, theme)
      if (color?.cssColor?.type === "rgb" && color.cssColor.components) {
        return {
          "--nui-c-context": `${color.cssColor.components.join(",")}`
        }
      }
    }],
    [/^n-(.*)$/, fonts[1][1]],
    ["n-dashed", { "border-style": "dashed" }],
    ["n-solid", {
      "background-color": "rgba(var(--nui-c-context), 1) !important",
      "border-color": "rgba(var(--nui-c-context), 1)",
      "color": "white !important"
    }],
    ["n-disabled", {
      "opacity": 0.4,
      "pointer-events": "none",
      "filter": "saturate(0)"
    }]
  ],
  variants: [
    (input) => {
      const prefix = "n-disabled:"
      if (input.startsWith(prefix)) {
        return {
          matcher: input.slice(prefix.length),
          selector: (input2) => `[disabled] ${input2}, ${input2}[disabled]`
        }
      }
    },
    (input) => {
      const prefix = "n-checked:"
      if (input.startsWith(prefix)) {
        return {
          matcher: input.slice(prefix.length),
          selector: (input2) => `[checked] ${input2}, ${input2}[checked]`
        }
      }
    }
  ],
  shortcuts: {
    // general
    "n-bg-base": "bg-white dark:bg-[#151515]",
    "n-bg-active": "bg-gray:5",
    "n-bg-hover": "bg-gray:3",
    "n-border-base": "border-gray/20",
    "n-transition": "transition-all duration-200",
    "n-focus-base": "ring-2 ring-context/50",
    "n-active-base": "ring-3 ring-context/10",
    "n-borderless": "!border-none !shadow-none",
    // link
    "n-link-base": "underline underline-offset-2 underline-black/20 dark:underline-white/40",
    "n-link-hover": "decoration-dotted text-context underline-context",
    // card
    "n-card-base": "border n-border-base rounded n-bg-base shadow-sm",
    // header
    "n-header-upper": "text-sm uppercase mb-2 leading-1.2em tracking-wide op50",
    // button
    "n-button-base": "border n-border-base rounded shadow-sm px-1em py-0.25em inline-flex items-center gap-1 op80 !outline-none touch-manipulation",
    "n-button-hover": "op100 !border-context text-context",
    "n-button-active": "n-active-base bg-context/5",
    "n-button-icon": "-ml-0.2em mr-0.2em text-1.1em",
    // checkbox
    "n-checkbox-box": "border n-border-base w-1.1em h-1.1em mr-1 text-white flex flex-none items-center rounded-sm overflow-visible",
    "n-checkbox-box-checked": "bg-context border-context",
    "n-checkbox-icon": "i-carbon-checkmark",
    // radio
    "n-radio-box": "border n-border-base w-1.2em h-1.2em mr-1 text-white flex flex-none rounded-full overflow-visible",
    "n-radio-box-checked": "border-context",
    "n-radio-inner": "bg-context rounded-1/2 w-0 h-0 m-auto",
    "n-radio-inner-checked": "w-0.8em h-0.8em",
    // switch
    "n-switch-base": "inline-flex items-center select-none",
    "n-switch-slider": "mr-1 rounded-full border n-border-base relative p-2px",
    "n-switch-slider-checked": "border-context/20 bg-context/10",
    "n-switch-thumb": "h-1em w-1em rounded-1/2 border n-border-base ml-0 mr-0.8em",
    "n-switch-thumb-checked": "bg-context border-context ml-0.8em mr-0",
    // tip
    "n-tip-base": "bg-context/4 text-context px-1em py-0.4em rounded flex gap-2 items-center dark:bg-context/12",
    // icon
    "n-icon": "flex-none"
  }
})
function extendUnocssOptions(user = {}) {
  return {
    ...user,
    preflight: true,
    presets: [
      presetUno(),
      presetAttributify(),
      presetTypography(),
      presetIcons({
        prefix: ["i-"],
        scale: 1.2,
        extraProperties: {
          "display": "inline-block",
          "vertical-align": "middle"
        }
        // ...(user?.icons || {})
      }),
      unocssPreset(),
      ...user.presets || []
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup()
    ]
  }
}


export default defineConfig({
  shortcuts: [
    {
      // General Tokens
      'bg-base': 'n-bg-base',
      'bg-active': 'n-bg-active',
      'border-base': 'n-border-base',
      'glass-effect': 'backdrop-blur-6 bg-white/80 dark:bg-[#151515]/90',
      'navbar-glass': 'sticky z-10 top-0 glass-effect',

      'text-secondary': 'color-black/50 dark:color-white/50',

      // Reusable
      'x-divider': 'h-1px w-full bg-gray/15',
    },
    [/^theme-card-(\w+)$/, $ => `p2 flex gap2 items-center rounded min-w-40 min-h-30 justify-center transition-all saturate-0 bg-gray/10 op50 hover:(op100 bg-${$[1]}/10 text-${$[1]}6 saturate-100)`],
  ],
  theme: {
    colors: {
      primary: '#03ae67',
    },
  },
  presets: [
  ],
  ...extendUnocssOptions()

})
