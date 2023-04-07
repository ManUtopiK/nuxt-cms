import { describe, it, expect, vi } from 'vitest'

// console.log(Compo)
vi.mock('#build/components.client', async (original) => {
  // Don't know why it works ! See alias in vitest.config.ts
  return {}
})

import { Editor } from '@tiptap/core'

import { generateJSON, generateHTML } from '@tiptap/core'
import { extensions } from '../src/runtime/tiptap/editor'

import { markdownToHtml, htmlToMarkdown } from '../src/runtime/markdown-parser'
import { frontmatter, headings, paragraph, emphasis, emphasisResult, links, linksResult, blockquote, images, mdc, frontmatterAndMdc } from './data/markdown'

function escapeHTML(str) {
  var p = document.createElement("p")
  p.appendChild(document.createTextNode(str))
  return p.innerHTML
}

async function parse(value, log) {
  if (log) console.log(`---\nvalue\n---\n${value}`)
  const content = await markdownToHtml(value)
  if (log) console.log(`---\nhtml content for editor\n---\n`, content)

  const editor = new Editor({
    // editable: false,
    content,
    extensions
  })
  const html = editor.getHTML()
  if (log) console.log(`---\neditor html output\n---\n`, html)

  const markdown = await htmlToMarkdown(html)
  if (log) console.log(`---\nmarkdown\n---\n${markdown}`)
  return markdown
}

describe('markdown>html>tiptap>html>markdown', () => {

  it('renders frontmatter', async () => {
    const markdown = await parse(frontmatter, false)
    expect(markdown).toStrictEqual(frontmatter)
  })

  it('renders headings', async () => {
    const markdown = await parse(headings, false)
    expect(markdown).toStrictEqual(headings)
  })

  it('renders paragraph', async () => {
    const markdown = await parse(paragraph, false)
    expect(markdown).toStrictEqual(paragraph)
  })

  it('renders emphasis', async () => {
    const markdown = await parse(emphasis, false)
    expect(markdown).toStrictEqual(emphasisResult)
  })

  it('renders links', async () => {
    const markdown = await parse(links, false)
    expect(markdown).toStrictEqual(linksResult)
  })

  it('renders blockquote', async () => {
    const markdown = await parse(blockquote, false)
    expect(markdown).toStrictEqual(blockquote)
  })

  it('renders images', async () => {
    const markdown = await parse(images, false)
    expect(markdown).toStrictEqual(images)
  })

  it('renders mdc', async () => {
    const markdown = await parse(mdc, false)
    expect(markdown).toStrictEqual(mdc)
  })

  it('renders mdc with page frontmatter', async () => {
    const markdown = await parse(frontmatterAndMdc, false)
    expect(markdown).toStrictEqual(frontmatterAndMdc)
  })
})
