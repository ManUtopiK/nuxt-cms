export default `---
title: Title
subtile: Subtitle
data:
  - entry
  - entry2
---

## Why?

I wanted an editable website living on the edge.

## How?

It is using [Nuxt 3](https://nuxt.com) and [Nuxt Content](https://content.nuxtjs.org) under the hood.

The website is deployed on CF workers and the content of this page is living inside CloudFlare Key Value storage.

## Source code?

It is available online on <https://github.com/atinux/atinotes>

## Code blocks

Yes it support code blocks:

\`\`\`ts
export const nuxt = 3
\`\`\`

The syntax highlight is done on client-side after hydration until we find a way to make Shiki works in CF workers.

## Vue Components

\<vue-component count="0">COMP2</vue-component>

You can use the [MDC syntax](https://content.nuxtjs.org/guide/writing/mdc) to use Vue components in the page content:

\`\`\`md
::alert{type=success}
This is an alert using a Vue component.
::
\`\`\`

::alert{type=success}
This is an alert using a Vue component.
::

::block-hero
---
cta:
  - Get started
  - /get-started
secondary:
  - Open on GitHub →
  - https://github.com/nuxtlabs/docus
snippet: npx nuxi@latest init docus-app -t nuxtlabs/docus-starter
---
#title
Document-driven framework
#description
Docus reconciles content creators and developers by offering to both the best tools to create and scale content-based websites.
::

# Test

A paragraph

**Block**

<block count="3"></block>

<board>

# Board title

## Todos

### Provide documentation on integrations

## In Progress

### Test tiptap with vue 3

### Use markdown as source of tiptap

</board>

![0](https://source.unsplash.com/8xznAGy4HcY/800x400)
`
