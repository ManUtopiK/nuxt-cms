import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
// import AlertEditor from './AlertEditor.vue'

export interface ComponentSlotOptions {
  HTMLAttributes: Record<string, any>,
}

export const ComponentSlot = Node.create<ComponentSlotOptions>({
  name: 'component-slot',

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
      // Fetch `v-slot="name"`
      'v-slot': {
        default: null,
        parseHTML(element) {
          const keys = element.getAttributeNames().map(attr => attr.match(/v-slot:(.*)/))
          const name = keys[0] && keys[0][1] ? keys[0][1] : undefined
          return name
        }
      }
    }
  },

  parseHTML() {
    return [{ tag: 'component-slot' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    // Switch back to `v-slot:name` format
    if (HTMLAttributes['v-slot'] && HTMLAttributes['v-slot'] !== '') {
      HTMLAttributes[`v-slot:${HTMLAttributes['v-slot']}`] = ''
      delete HTMLAttributes['v-slot']
    }

    return [`component-slot`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addNodeView() {
  //   return VueNodeViewRenderer(AlertEditor)
  // }
})
