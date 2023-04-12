# Nuxt CMS Server

The missing nuxt content v2 feature: write local file in **dev mode** from frontend.

## Features

<!-- Highlight some of the features your module provide here -->
- 🧩 Create a nuxt server handler
- 💾 Use [unstorage](https://unstorage.unjs.io/) http driver in frontend
- 👐 Pair with nuxt content storage (nitro)

## Quick Setup

1. Add `nuxt-cms-server` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-cms-server

# Using yarn
yarn add --dev nuxt-cms-server

# Using npm
npm install --save-dev nuxt-cms-server
```

2. Add `nuxt-cms-server` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-cms-server'
  ]
})
```

That's it! You can now use nuxt-cms-server in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-cms-server/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-cms-server

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-cms-server.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-cms-server

[license-src]: https://img.shields.io/npm/l/nuxt-cms-server.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-cms-server

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
