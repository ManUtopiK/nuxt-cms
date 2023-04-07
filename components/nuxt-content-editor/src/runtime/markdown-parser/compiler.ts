import { Processor, Transformer } from "unified"
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'

export interface MdcNode extends Node {
  fmAttributes?: {}
  attributes?: any
}

export interface Options { }

export default function (this: Processor, _options?: Options): Transformer {
  return function transformer(tree: MdcNode): MdcNode {
    // We save frontmatter root keys in array for reference.
    // We can determine later which variable is inline (`::component{key=value}) or in the frontmatter part
    visit(tree, 'containerComponent', (node: MdcNode, idx, parent) => {
      if (node.fmAttributes && Object.keys(node.fmAttributes!).length) {
        node.attributes.rawdata = node.rawData
        node.attributes.frontmatterKeys = JSON.stringify(Object.keys(node.fmAttributes))
      }
    })

    // Work around to use frontmatter content as variable.
    // Rehype don't parse `<frontmatter>` without `\n` added at markdownToHtml()
    visit(tree, 'html', (node: MdcNode, idx, parent) => {
      if (node.type === 'html') {
        node.value = node.value.replace('<frontmatter>\n', '<frontmatter>')
      }
    })

    return tree
  }
}
