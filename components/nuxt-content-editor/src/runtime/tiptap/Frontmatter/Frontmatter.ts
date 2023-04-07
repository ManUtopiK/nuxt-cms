import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import FrontmatterEditor from './FrontmatterEditor.vue'

export interface FrontmatterOptions {
  HTMLAttributes: Record<string, any>,
}

export const Frontmatter = Node.create<FrontmatterOptions>({
  name: 'frontmatter',

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'inline+',

  code: true,

  parseHTML() {
    return [
      { tag: 'frontmatter' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['frontmatter', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(FrontmatterEditor)
  },
})
