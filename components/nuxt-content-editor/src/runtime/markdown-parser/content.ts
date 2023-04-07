import type { Processor } from 'unified'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehypeStringify from "rehype-stringify"
import rehypeParse from "rehype-parse"
import rehype2Remark from "rehype-remark"
import remarkStringify from "remark-stringify"
import remarkGfm from "remark-gfm"

import { visit } from "unist-util-visit"
import { toMdast } from 'hast-util-to-mdast'

import remarkMDC from 'remark-mdc'
import { stringifyFrontMatter } from 'remark-mdc'

import type { MarkdownOptions, MarkdownPlugin, MarkdownRoot } from '../types'
import handlers from './handler'
import remarkMDC4Tiptap from './remark-mdc-4-tiptap'
import compilerProse from './compiler-prose'
// import compiler from './compiler'

const usePlugins = (plugins: Record<string, false | MarkdownPlugin>, stream: Processor) => {
  for (const plugin of Object.values(plugins)) {
    if (plugin) {
      const { instance, ...options } = plugin
      stream.use(instance, options)
    }
  }
}

/**
 * Generate html
 * @param {string} content - file content
 * @param {object} data - document data
 * @returns {object} JSON AST body
 */
export function generateHtml(content: string, options: MarkdownOptions & { data: any }): Promise<string> {
  const rehypeOptions: any = {
    handlers,
    allowDangerousHtml: true
  }

  return new Promise((resolve, reject) => {
    const stream = unified().use(remarkParse)

    if (options.mdc) {
      stream.use(remarkMDC)
      stream.use(remarkMDC4Tiptap, options as any)
    }

    usePlugins(options.remarkPlugins, stream)
    stream.use(remark2rehype, rehypeOptions)
    usePlugins(options.rehypePlugins, stream)

    // Convert hast to html
    stream.use(rehypeStringify, rehypeOptions)

    // stream.use(compiler, options as any)
    stream.process(
      {
        value: content,
        data: options.data
      },
      (error, file) => {
        if (error) {
          return reject(error)
        }

        Object.assign(options.data, file?.data || {})

        resolve(file?.value as string)
      }
    )
  })
}



/**
 * Generate json prose
 * @param {string} content - file content
 * @param {object} data - document data
 * @returns {object} JSON AST body
 */
export function generateProse(content: string, options: MarkdownOptions & { data: any }): Promise<MarkdownRoot> {
  const rehypeOptions: any = {
    handlers,
    allowDangerousHtml: true
  }

  return new Promise((resolve, reject) => {
    const stream = unified().use(remarkParse)

    if (options.mdc) {
      stream.use(remarkMDC)
    }

    usePlugins(options.remarkPlugins, stream)
    stream.use(remark2rehype, rehypeOptions)
    usePlugins(options.rehypePlugins, stream)

    // stream.use(compilerProse, options as any)
    stream.process(
      {
        value: content,
        data: {} // options.data
      },
      (error, file) => {
        if (error) {
          return reject(error)
        }
        // Object.assign(options.data, file?.data || {})
        resolve(file?.value as MarkdownRoot)
      }
    )
  })
}



/**
 * Generate markdown from HTML
 * @param {string} content - file content
 * @param {object} data - document data
 * @returns {string} Raw HTML
 */
export function generateMarkdown(content: string, options: MarkdownOptions & { data: any }): Promise<string> {
  const rehypeOptions: any = {
    handlers,
    allowDangerousHtml: true
  }

  return new Promise((resolve, reject) => {
    const stream = unified().use(rehypeParse, rehypeOptions)


    usePlugins(options.rehypePlugins, stream)
    // stream.use(debugRehypeAST)
    stream.use(rehype2Remark,
      {
        allowDangerousHtml: false,
        handlers: {
          alert(state, node) {
            const { rawdata, rawProps } = stringifyProps(node.properties)

            const frontmatterMdast = [] as any[]

            // Add ::tagName{props} if any raw props
            frontmatterMdast.push({
              type: 'text',
              value: rawProps.length ? `::${node.tagName}{${rawProps}}${rawdata ? '' : '\n'}` : `::${node.tagName}\n`
            })

            // Add yaml frontmatter
            if (rawdata) {
              rawdata.split('\n')
                .forEach((line, i) => {
                  frontmatterMdast.push({
                    type: 'html',
                    value: '\n' + line
                  })
                })
            }

            return {
              type: 'paragraph',
              children: [
                ...frontmatterMdast,
                toMdast(node, {
                  handlers: {
                    'component-slot'(state, slot) {
                      const mdast = [] as any[]

                      // Recover slot name with `v-slot:name=""` attribute
                      const slotProps = Object.entries(slot.properties)[0][0].replace('v-slot:', '')
                      if (slotProps) {
                        mdast.push({ type: 'html', value: '\n\n#' })
                        mdast.push({ type: 'text', value: slotProps + '\n' })
                      }
                      mdast.push(toMdast(slot))

                      return mdast
                    }
                  }
                }),
                { type: 'text', value: `\n::` }
              ]
            }
          }
        },
        ...rehypeOptions.handlers
      }
    )
    // stream.use(debugRemarkAST)
    stream.use(remarkGfm)
    usePlugins(options.remarkPlugins, stream)

    stream.use(remarkStringify, {
      bullet: '-',
      listItemIndent: 'one',
      fence: '~',
      fences: true,
      incrementListMarker: false
    })
    stream.process(content,
      (error, file) => {
        if (error) {
          return reject(error)
        }
        // console.log(file)
        resolve(file?.value as string)
      }
    )
  })
}



export function stringifyProps(props): { rawdata: string, rawProps: string } {
  let rawdata = ''
  let frontmatterKeys: any[] = []

  if (typeof props.array === 'string') props.array = JSON.parse(props.array)

  if (props.frontmatterkeys) {
    frontmatterKeys = JSON.parse(props.frontmatterkeys)

    const fmObj = Object.fromEntries([...frontmatterKeys.map(key => {
      const value = props[key] ? props[key] : props[`:${key}`]
      try {
        const ret = [[key], JSON.parse(value)]
        return ret
      } catch (error) {
        return [[key], value]
      }
    })])

    try {
      rawdata = stringifyFrontMatter(fmObj)
    } catch (error) {
      // TODO Pass warning ? Older frontmatter ?
    }
  }

  // Skip frontmatter keys and inline the rest
  const rawProps = Object
    .keys(props)
    .filter(key =>
      ![
        ...frontmatterKeys,
        ...frontmatterKeys.map(k => `:${k}`),
        'frontmatterkeys',
        'rawdata'
      ].includes(key))
    .map(key => {

      return `${key}=${JSON.stringify(props[key])}`
    }).join(' ')

  return { rawdata, rawProps }
}



/**
 *
 * Used for development only
 */

// rehype-parse : parse HTML to AST
// rehype2remark : translate Rehype AST to Remark AST
// remark-stringify : stringify AST to markdown

// remark-parse : parse markdown to AST
// remark2rehype : translate Remark AST to Rehype AST
// rehypeStringify : stringify AST to html

function debugRehypeAST() {
  function findCodeBlocks(node) {
    let nodes = []

    if (node.tagName === "pre") {
      nodes.push(node) // <pre> nodes are code blocks
    } else if (node.children) {
      // recursively walk through child nodes
      for (let child of node.children) {
        nodes.push(...findCodeBlocks(child))
      }
    }
    return nodes
  }

  return tree => {
    const codeBlocks = findCodeBlocks(tree)
    // deep print the codeBlocks array
    // console.log('debugRehypeAST', tree.children[0])
    // console.log(require("util").inspect(tree, false, null, true))
    return tree
  }
}

function debugRemarkAST() {
  return (markdownAST) => {
    // console.log('debugRemarkAST', markdownAST)
    visit(markdownAST, "html", node => {
      // console.log(node)
    })
  }
}
