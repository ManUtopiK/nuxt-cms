export const frontmatter = `---
key: value
array:
  - foo
  - bar
object:
  key: value
  foo: bar
---
`

export const headings = `# heading 1

## heading 2

### heading 3

#### heading 4

##### heading 5

###### heading 6
`

export const paragraph = `a paragraph

another paraghaph\
with multiline
`

export const emphasis = `This text is **important**.\
This text is ___really important___.\
This text is __*really important*__.\
This is really***very***important text.\
This text is ***really important***.\
This text is **_really important_**.
`
export const emphasisResult = `This text is **important**.\
This text is ***really important***.\
This text is ***really important***.\
This is really***very***important text.\
This text is ***really important***.\
This text is ***really important***.
`

export const links = `A raw link https://example.com

An [**emphasis** _example_](https://example.com)

A markdown [example](https://example.com)

[![](https://source.unsplash.com/8xznAGy4HcY/800x400)](https://image.example.com)

A footnote link [example][1]

A bracket link <https://example.com>

[1]: https://example.com`

export const linksResult = `A raw link <https://example.com>

An [**emphasis** *example*](https://example.com)

A markdown [example](https://example.com)

[![](https://source.unsplash.com/8xznAGy4HcY/800x400)](https://image.example.com)

A footnote link [example](https://example.com)

A bracket link <https://example.com>
`

export const blockquote = `> Dorothy followed her through many of the beautiful rooms in her castle.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> > The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
> *Everything* is going according to **plan**.
`

export const images = `![0](https://source.unsplash.com/8xznAGy4HcY/800x400)

![](https://source.unsplash.com/8xznAGy4HcY/800x400)

[![](https://source.unsplash.com/8xznAGy4HcY/800x400)](https://auiea.nr)

![alt](https://source.unsplash.com/K9QHL52rE2k/800x400 "title")
`

export const mdc = `::alert
Default slot without frontmatter

#the-slot
An **error** occurred

Oops !
::

::alert{prop="inline"}
---
array:
  - key: value
type: string
---
Default slot

#title
My *Docus* project

#description
Write pages in markdown, use Vue components and enjoy the power of Nuxt with a blazing fast developer experience.
::

::alert{type="warning" icon="exclamation-circle"}
An **error** occurred

Oops !
::

text
`

export const frontmatterAndMdc = `---
type: success
---
::alert
Default slot without frontmatter

#the-slot
An **error** occurred

Oops !
::

::alert{:type="type"}
Default slot

#title
My *Docus* project

#description
Write pages in markdown, use Vue components and enjoy the power of Nuxt with a blazing fast developer experience.
::
`
