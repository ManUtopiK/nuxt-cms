# nuxt-cms

The ubiquitous Content Management System.

## Main idea

- A single page application build with [Nuxt.js](https://nuxt.com) that works for and inside every git-based static website. It can run as a standalone application, or embedded in static site based on nuxt and nuxt-content (for now).
- Provide a visual editing experience and content management with visual editor. Based on tiptap, the goal is to edit content as it is.

**CMS concept**

The CMS provides a way to use static files with markdown and Vue.js components (MDC) to manage website content. In addition to markdown files, it also supports JSON or YAML files to manage small databases, making it a flexible and powerful tool for website management. This approach simplifies the management of website content, without requiring complex server-side CMS systems.

Furthermore, the CMS's ability to work with various storage solutions, such as Git or the Web File API, offers even more flexibility.
Using Git for version control provides a reliable and secure way to manage content updates and changes. This allows multiple contributors to work on the same project without the risk of conflicting changes. Additionally, Git provides easy rollback options in case of errors or unintended changes. By leveraging Git, it is possible to create a complete administration section for a static website, which can be easily managed using the familiar Git workflow.
Alternatively, the Web File API provides a simple way to store and manage content, without the need for external services. This feature provides an additional layer of customization, allowing developers to choose the storage solution that best fits their needs.

**Editor concept**

For the end user, the main idea is to develop a visual editing experience around the real content of the website, like Notion or Obsidian.
The editor should allow users to create and edit content (behind the scene in Markdown or others formats), while the connected Vue components will display the content in a visually appealing manner on the website.

The editor will connect the marks and nodes of Tiptap with Vue components, allowing for easy and flexible content editing and collaborative capabilities. To elaborate further, Tiptap is a framework for building rich-text editors in Vue.js, while Vue.js is a progressive framework for building user interfaces. Nuxt Content is a module for Nuxt.js that makes it easy to fetch Markdown files and transform them into prosemirror data. By combining these technologies, it's possible to create a powerful and efficient CMS that is easy to use and maintain for developers and end-users.

> This approach is not vendor lock-in, as it is framework agnostic and can be adapted to work with different front-end frameworks. It provides a flexible and powerful way to manage website content, allowing for easy customization and modification without the need for complex server-side CMS systems.


## Features

- Last tiptap v2.0.1

## Tasks

- [x] Use nuxt-devtools as a base for global architecture :
  - [ ] It allows creating plugins for the cms. (Should work but not tested).
  - [ ] Override or add cms components from the main nuxt site.
  - [x] Communicate with the CMS embedded in an iframe.
- [ ] Standalone application :
  - [x] Use the cms like a SPA. Start with git credentials provided in nuxt.config.ts, or start without config and connect to a git remote provider in the app.
  - [ ] Connect and manage multiple repositories.
- [x] Authentication to gitlab with OAuth pkce.
- [ ] Authentication to github.
- [x] Login and Editor components for nuxt.
- [ ] Parse all the markdown content to search links to others pages and provide a mind map of relationships of the pages.
- [ ] Use a `_schema.yaml` file to explain the format of the frontmatter part of md files, and build corresponding UI.
- [ ] Fetch the directory of static files and images with git, and manage them in the cms.

## Inspirations and research

### CMS approach

- [Notion](https://notion.io) and [Obsidian](https://obsidian.md).
- [Tina CMS](https://tina.io) Tina is an open-source, headless CMS for Markdown, MDX, and JSON.
- [Outstatic](https://github.com/avitorio/outstatic/tree/canary) Outstatic - A static CMS for Next.js.
- [Outline](https://www.getoutline.com) The fastest knowledge base for growing teams. Beautiful, realtime collaborative, feature packed, and markdown compatible.

### Git-based CMS

- [atinotes](https://github.com/Atinux/atinotes)
- [Spinal](https://spinalcms.com) Minimal and beautiful CMS for static site generators.
- [static-cms](https://github.com/StaticJsCMS/static-cms) A Git-based CMS for Static Site Generators.
- [decapcms](https://github.com/decaporg/decap-cms) A Git-based CMS for Static Site Generators.
- [simple-git](https://github.com/Brooooooklyn/simple-git) Simple and fast git helper functions.
  
### Editor concept

- VS Code.
- [Editor.js](https://github.com/codex-team/editor.js) A block-style editor with clean JSON output.
- [typist.doist.dev](https://typist.doist.dev/) The mighty Tiptap-based rich-text editor that powers Doist products.
- [blocksuite](https://github.com/toeverything/blocksuite) BlockSuite is the open-source collaborative editor project behind AFFiNE.
- [massCode](https://github.com/massCodeIO/massCode) A free and open source code snippets manager for developers.
- [https://bangle.io](https://bangle.io) Collection of higher level rich text editing tools. It powers the local only note taking app.
- [https://nuxt.com/modules/nuxt-monaco-editor](https://nuxt.com/modules/nuxt-monaco-editor)
  
### Editor with Tiptap and Vue

- [YousefED/BlockNote](https://github.com/YousefED/BlockNote) A "Notion-style" block-based extensible text editor built on top of Prosemirror and Tiptap.
- [tiptap](https://github.com/ueberdosis/tiptap) The headless editor framework for web artisans.
- [Milkdown](https://milkdown.dev) The WYSIWYG Markdown Editor Framework.
- [nuxtlabs tiptap-markdown](https://github.com/nuxtlabs/tiptap-markdown) and [tiptap-markdown](https://github.com/aguingand/tiptap-markdown/compare/main...refactor-extensions) Edit markdown content in tiptap editor.
- [Nextcloud editor Text](https://github.com/nextcloud/text) Collaborative document editing using Markdown.
- [Lotion](https://lotion.dashibase.com) An open-source Notion UI built with Vue 3.
- [maximemoreillon/cms_front](https://github.com/maximemoreillon/cms_front)
- [element-tiptap](https://github.com/Leecason/element-tiptap)

### Monorepo

- [alvarosabu/pnpm-monorepo-nuxt](https://github.com/alvarosabu/pnpm-monorepo-nuxt)
- [KareemDa/pnpm-monorepo-nuxt-3](https://github.com/KareemDa/pnpm-monorepo-nuxt-3)

## Installation

Install packages:

```shell
pnpm i
```

Start dev mode:

```shell
pnpm run -r dev
```

Build applications:

```shell
pnpm run -r build
```

Start specific application:

```shell
pnpm --filter nuxt-cms run dev
pnpm --filter website2 run dev
```
