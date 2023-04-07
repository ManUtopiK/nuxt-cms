import type { Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

import SlashMenu from '../../tiptap/SlashMenu/commands'
import suggestion from '../../tiptap/SlashMenu/suggestion'

import { Heading } from '../../tiptap/Heading/Heading'
import { Paragraph } from '../../tiptap/Paragraph/Paragraph'
import { Frontmatter } from '../../tiptap/Frontmatter/Frontmatter'
import { Alert } from '../../tiptap/Alert/Alert'
import { ComponentSlot } from '../../tiptap/ComponentSlot/ComponentSlot'

export const extensions: Extensions = [
  StarterKit.configure({
    heading: false,
    paragraph: false
  }),
  // Heading.configure({
  //   levels: [1, 2, 3, 4, 5, 6],
  // }),

  // Placeholder.configure({
  //   // Use a placeholder:
  //   placeholder: "Enter text or type '/' for commands",
  //   includeChildren: true
  //   // Use different placeholders depending on the node type:
  //   // placeholder: ({ node }) => {
  //   //   if (node.type.name === 'heading') {
  //   //     return 'What’s the title?'
  //   //   }

  //   //   return 'Can you add some further context?'
  //   // },
  // }),

  // SlashMenu.configure({
  //   suggestion
  // }),

  Paragraph,
  // Frontmatter,
  // Alert,
  // ComponentSlot,

  // Table.configure({
  //   resizable: true,
  // }),
  // TableRow,
  // TableHeader,
  // TableCell,
  // Image.configure({
  //   inline: true,
  //   HTMLAttributes: {
  //     class: 'w-full',
  //   },
  // }),
  // Link.configure({
  //   protocols: ['ftp', 'mailto'],
  //   openOnClick: false,
  // })
]
