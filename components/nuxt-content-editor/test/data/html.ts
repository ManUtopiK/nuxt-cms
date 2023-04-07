export default `<frontmatter>
title: Title
subtile: Subtitle
data:
  - entry
  - entry2
</frontmatter>
<h2 id="why-">Why?</h2>
<p>I wanted an editable website living on the edge.</p>
<h2 id="how-">How?</h2>
<p>It is using <a href="https://nuxt.com">Nuxt 3</a> and <a href="https://content.nuxtjs.org">Nuxt Content</a> under the hood.</p>
<p>The website is deployed on CF workers and the content of this page is living inside CloudFlare Key Value storage.</p>
<h2 id="source-code-">Source code?</h2>
<p>It is available online on <a href="https://github.com/atinux/atinotes">https://github.com/atinux/atinotes</a></p>
<h2 id="code-blocks">Code blocks</h2>
<p>Yes it support code blocks:</p>
<p>\`\`\`ts
export const nuxt = 3
\`\`\`</p>
<p>The syntax highlight is done on client-side after hydration until we find a way to make Shiki works in CF workers.</p>
<h2 id="vue-components">Vue Components</h2>
<p><vue-component count="0">COMP2</vue-component></p>
<p>You can use the <a href="https://content.nuxtjs.org/guide/writing/mdc">MDC syntax</a> to use Vue components in the page content:</p>
<p>\`\`\`md
::alert{type=success}
This is an alert using a Vue component.
::
\`\`\`</p>
<p>::alert{type=success}
This is an alert using a Vue component.
::</p>
<h2 id="-block-hero">::block-hero</h2>
<p>cta:</p>
<ul>
<li>Get started</li>
<li>/get-started
secondary:</li>
<li>Open on GitHub →</li>
<li><a href="https://github.com/nuxtlabs/docus">https://github.com/nuxtlabs/docus</a>
snippet: npx nuxi@latest init docus-app -t nuxtlabs/docus-starter</li>
</ul>
<hr>
<p>#title
Document-driven framework</p>
<p>#description
Docus reconciles content creators and developers by offering to both the best tools to create and scale content-based websites.
::</p>
<h1 id="test">Test</h1>
<p>A paragraph</p>
<p><strong>Block</strong></p>
<block count="3"></block>

<board>

# Board title

## Todos

### Provide documentation on integrations

## In Progress

### Test tiptap with vue 3

### Use markdown as source of tiptap

</board>

<p><img src="https://source.unsplash.com/8xznAGy4HcY/800x400" alt="0"></p>
`
