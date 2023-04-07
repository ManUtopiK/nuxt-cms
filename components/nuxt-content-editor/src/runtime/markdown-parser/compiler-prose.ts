import { Node as UnistNode } from 'unist'
import type { MarkdownRoot, MarkdownNode, MarkdownOptions } from '../types'

// import { SerializerState } from '@milkdown/transformer'

type Node = UnistNode & {
  tagName?: string
  value?: string
  children?: Node[]
  properties: Record<string, any>
}

type ProseNode = {
  type: string
  text: string
  marks?: { type?: string, attrs?: any }[]
}

/**
 * JSON compiler
 */
export default function (this: any, _options: MarkdownOptions) {
  /**
   * Parses nodes for JSON structure. Attempts to drop
   * unwanted properties.
   */
  function parseAsJSON(node: Node | Node[]): ProseNode | ProseNode[] | undefined {
    if (Array.isArray(node)) {
      return node.map(parseAsJSON).filter(Boolean) as ProseNode[]
    }
    // console.log('node', node)

    // Remove double dashes and trailing dash from heading ids
    // Insert underscore if id start with a digit
    if (node.tagName?.startsWith('h') && node.properties.id) {
      node.properties.id = node.properties.id
        .replace(/-+/g, '-')
        .replace(/-$/, '')
        .replace(/^-/, '')
        .replace(/^(\d)/, '_$1')
    }

    /**
     * Element node creates an isolated children array to
     * allow nested elements
     */
    if (node.type === 'element') {
      /**
       * Headings
       */
      if (node.tagName && /^h([1-6])$/.test(node.tagName)) {
        node.properties = { level: +node.tagName.substring(1) } // It's ok to override old properties
        node.tagName = 'heading'
      }

      if (node.tagName === 'li') {
        // unwrap unwanted paragraphs around `<li>` children
        let hasPreviousParagraph = false
        node.children = node.children?.flatMap((child) => {
          if (child.tagName === 'p') {
            if (hasPreviousParagraph) {
              // Insert line break before new paragraph
              child.children!.unshift({
                type: 'element',
                tagName: 'br',
                properties: {}
              })
            }

            hasPreviousParagraph = true
            return child.children
          }
          return child
        }) as Node[]
      }

      /**
       * Rename paragraph
       */
      if (node.tagName === 'p') {
        node.tagName = 'paragraph'
      }

      /**
       * Emphasis
       */
      if (node.tagName === 'strong') {
        const marks = [{ type: 'bold' }]
        let text = ''
        if (node.children && node.children[0].type !== 'text') {
          marks.push({ type: 'italic' })
          text = (node.children[0] && node.children[0].children && node.children[0].children[0].value) || ''
        } else {
          text = node.children && node.children[0].value || ''
        }

        return <ProseNode>{
          type: 'text',
          marks,
          text
        }
      }
      if (node.tagName === 'em') {
        const marks = [{ type: 'italic' }]
        let text = ''
        if (node.children && node.children[0].type !== 'text') {
          marks.push({ type: 'bold' })
          text = (node.children[0] && node.children[0].children && node.children[0].children[0].value) || ''
        } else {
          text = node.children && node.children[0].value || ''
        }

        return <ProseNode>{
          type: 'text',
          marks,
          text
        }
      }

      /**
       * Change links
       */
      if (node.tagName === 'a') {
        return <ProseNode>{
          type: 'text',
          marks: [{ type: 'link', attrs: { href: node.properties.href, target: '_blank', class: null } }],
          text: node.children && node.children[0].value
        }
      }

      /**
       * Change images
       */
      if (node.tagName === 'img') {
        return {
          type: 'image',
          attrs: {
            alt: node.properties.alt, //node.children[0].value
            title: node.properties.title, //node.children[0].value
            src: node.properties.src
          },
        }
      }

      /**
       * Rename component slots tags name
       */
      if (node.tagName === 'component-slot') {
        node.tagName = 'template'
      }

      const MdNode = <MarkdownNode>{
        type: node.tagName as string,
        content: parseAsJSON(node.children || [])
      }
      if (Object.keys(node.properties).length) MdNode.attrs = node.properties

      return MdNode
    }

    /**
     * Text node
     */
    if (node.type === 'text') {
      // Remove new line nodes
      if (node.value === '\n') {
        return undefined
      }
      return <ProseNode>{
        type: 'text',
        text: node.value as string
      }
    }

    // Remove comment nodes from AST tree
    if (node.type === 'comment') {
      return undefined
    }

    node.content = parseAsJSON(node.children || []) as ProseNode[]
    return node
  }

  this.Compiler = function (root: Node): MarkdownRoot {
    /**
     * We do not use `map` operation, since each node can be expanded to multiple top level
     * nodes. Instead, we need a array to fill in as many elements inside a single
     * iteration
     */
    return {
      type: 'doc',
      content: parseAsJSON(root.children || []) as ProseNode[]
    }
  }
}
