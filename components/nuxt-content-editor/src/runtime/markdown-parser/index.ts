// eslint-disable-next-line import/no-named-as-default
import defu from 'defu'
import remarkEmoji from 'remark-emoji'
import rehypeSlug from 'rehype-slug'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'

import rehypeSortAttributeValues from 'rehype-sort-attribute-values'
import rehypeSortAttributes from 'rehype-sort-attributes'
import rehypeRaw from 'rehype-raw'
import { parseFrontMatter } from 'remark-mdc'
import { MarkdownOptions } from '../types'
import { generateHtml, generateProse, generateMarkdown } from './content'

import { useContentEditor } from '../composables/useContentEditor'

export const useDefaultOptions = (): MarkdownOptions => ({
  mdc: true,
  toc: {
    depth: 2,
    searchDepth: 2
  },
  tags: {},
  remarkPlugins: {
    'remark-emoji': {
      instance: remarkEmoji
    },
    'remark-squeeze-paragraphs': {
      instance: remarkSqueezeParagraphs
    },
    'remark-gfm': {
      instance: remarkGfm
    }
  },
  rehypePlugins: {
    'rehype-slug': {
      instance: rehypeSlug
    },
    'rehype-external-links': {
      instance: rehypeExternalLinks
    },
    'rehype-sort-attribute-values': {
      instance: rehypeSortAttributeValues
    },
    'rehype-sort-attributes': {
      instance: rehypeSortAttributes
    },
    'rehype-raw': {
      instance: rehypeRaw,
      passThrough: ['element']
    }
  }
})

export async function markdownToProse(markdown: string, userOptions: Partial<MarkdownOptions> = {}) {
  const options = defu(userOptions, useDefaultOptions()) as MarkdownOptions
  const { content, data } = getFrontMatter(markdown)

  const contentFakeFrontmatter = data ? `<frontmatter>\n${data.trim()}</frontmatter>\n` + content : content

  // Compile markdown to prosemirror Blocks
  const prose = await generateProse(contentFakeFrontmatter, { ...options, data })

  return prose
}

export async function htmlToMarkdown(html: string, userOptions: Partial<MarkdownOptions> = {}) {
  const options = defu(userOptions, useDefaultOptions()) as MarkdownOptions

  const matches = html.match(/<frontmatter>(.*)<\/frontmatter>(.*)/s)

  if (matches) html = matches[2]

  // TODO For now, extraline under the frontmatter is removed.
  // It should be possible to configure this behavior : remove extra lines, keep one line, do nothing.

  let md = await generateMarkdown(html, options)
  if (matches) md = '---\n' + matches[1] + '\n---\n' + md

  return md
}

export async function markdownToHtml(markdown: string, userOptions: Partial<MarkdownOptions> = {}): Promise<VFile.value> {
  const options = defu(userOptions, useDefaultOptions()) as MarkdownOptions

  let content = ''
  let data = {}

  try {
    ({ content, data } = await parseFrontMatter(markdown))

    // Store data
    const { frontmatter } = useContentEditor()
    frontmatter.value = data

    const rawFrontmatter = getFrontMatter(markdown).trim()
    content = `<frontmatter>\n${rawFrontmatter}</frontmatter>\n` + content
  } catch (error) {
  }

  // Compile to html
  const html = await generateHtml(content, { ...options, data })
  return html
}

const FRONTMATTER_DELIMITER = "---"
function getFrontMatter(content) {
  let data
  if (content.startsWith(FRONTMATTER_DELIMITER)) {
    const idx = content.indexOf("\n" + FRONTMATTER_DELIMITER)
    if (idx !== -1) {
      data = content.slice(4, idx)
      if (data) {
        content = content.slice(idx + 4)
      }
    }
  }

  return data
}
