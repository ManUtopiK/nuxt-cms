import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AlertEditor from './AlertEditor.vue'
import { toRaw, readonly } from 'vue'
import { useContentEditor } from '../../composables/useContentEditor'

const { frontmatter, frontmatterKeys } = useContentEditor()

export interface AlertOptions {
  HTMLAttributes: Record<string, any>,
}

export const Alert = Node.create<AlertOptions>({
  name: 'alert',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  content: 'block*',

  group: 'block',

  defining: true,

  draggable: true,

  addAttributes() {
    return {
      data: {
        default: undefined,
        renderHTML: attributes => {
          // Need it ?
          // if (!attributes?.data) return {}

          return {
            data: Object.fromEntries(
              Object.entries(toRaw(attributes.data))
                .map(([key, value]) => {
                  // If key is in frontmatter, we send back the name of the key
                  if (frontmatterKeys.value.includes(key)) return [`:${key}`, key]

                  return typeof value !== 'string'
                    ? [key, JSON.stringify(value)]
                    : [key, value]
                }
                ))
          }
        },
        parseHTML(element) {
          const attributes = element.getAttributeNames()
          // Return all attributes. Remove `:`.
          const rawAttributes = attributes
            .filter(key => key !== 'data')
            .map(attr => {
              if (attr.startsWith(':')) {
                const kee = attr.substring(1)

                // Value can be type of string or JSON stringified object. remarkMDC behavior.
                let value
                try {
                  value = JSON.parse(element.getAttribute(attr)!)
                } catch (error) {
                  value = element.getAttribute(attr)
                }

                // If `:attr`, bind to frontmatter if exists
                if (frontmatterKeys.value.includes(value)) {
                  // TODO 🤔 We should pass the value with information that it's binded to frontmatter...
                  return [kee, frontmatter.value[kee]]
                }

                return [kee, value]
              }

              // Rehype lowercase the key, so we use frontmatterkeys.
              if (attr === 'frontmatterkeys') return ['frontmatterKeys', JSON.parse(element.getAttribute(attr)!)]
              return [attr, element.getAttribute(attr)]
            })

          return rawAttributes.length ? Object.fromEntries(rawAttributes) : {}
        }
      }
    }
  },

  parseHTML() {
    return [{ tag: 'alert' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    // if (!HTMLAttributes.data) return ['alert', mergeAttributes(this.options.HTMLAttributes)]
    return ['alert', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes.data), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(AlertEditor)
  }
})
