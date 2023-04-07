export interface ParsedContentInternalMeta {
  /**
   * Content id
   */
  _id: string
  /**
   * Content source
   */
  _source?: string
  /**
   * Content path, this path is source agnostic and it the content my live in any source
   */
  _path?: string
  /**
   * Content title
   */
  title?: string
  /**
   * Content draft status
   */
  _draft?: boolean
  /**
   * Content partial status
   */
  _partial?: boolean
  /**
   * Content locale
   */
  _locale?: string
  /**
   * File type of the content, i.e `markdown`
   */
  _type?: string
  /**
   * Path to the file relative to the content directory
   */
  _file?: string
  /**
   * Extension of the file
   */
  _extension?: string
}

export interface ParsedContentMeta extends ParsedContentInternalMeta {
  [key: string]: any
}

export interface ParsedContent extends ParsedContentMeta {
  /**
   * Excerpt
   */
  excerpt?: any
  /**
   * Content body
   */
  body: any
}

export interface MarkdownNode {
  type: string
  tag?: string
  value?: string
  props?: Record<string, any>
  content?: any
  children?: MarkdownNode[]

  attributes?: Record<string, any>
  fmAttributes?: Record<string, any>
}

export interface MarkdownHtmlNode extends MarkdownNode {
  type: 'html'
  value: string
}

export interface MarkdownRoot {
  type: 'root'
  children: MarkdownNode[]
  props?: Record<string, any>
}

export interface MarkdownPlugin extends Record<string, any> { }

export interface MarkdownOptions {
  /**
   * Enable/Disable MDC components.
   */
  mdc: boolean
  toc: {
    /**
     * Maximum heading depth to include in the table of contents.
     */
    depth: number
    searchDepth: number
  }
  tags: Record<string, string>
  remarkPlugins: Record<string, false | (MarkdownPlugin & { instance: any })>
  rehypePlugins: Record<string, false | (MarkdownPlugin & { instance: any })>
}
