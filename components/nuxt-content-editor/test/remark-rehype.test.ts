import { describe, it, expect } from 'vitest'

import { markdownToHtml, htmlToMarkdown } from '../src/runtime/markdown-parser'
import { generateBody, generateHtml } from '../src/runtime/markdown-parser/content'
import { headings, paragraph, emphasis, emphasisResult, links, linksResult, blockquote, images, mdc, frontmatterAndMdc } from './data/markdown'

function escapeHTML(str) {
  var p = document.createElement("p")
  p.appendChild(document.createTextNode(str))
  return p.innerHTML
}

async function parse(value, log) {
  // if (log) console.log(`---\nvalue\n---\n${value}`)
  const html = await markdownToHtml(value)
  if (log) console.log(`---\nhtml\n---\n`, html)
  const markdown = await htmlToMarkdown(html)
  if (log) console.log(`---\nmarkdown\n---\n`, markdown)
  return markdown
}

describe('markdown>html>markdown', () => {

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

  it('uses frontmatter with mdc', async () => {
    const markdown = await parse(frontmatterAndMdc, false)
    expect(markdown).toStrictEqual(frontmatterAndMdc)
  })

})
