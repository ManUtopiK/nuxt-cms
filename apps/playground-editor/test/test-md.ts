export default `---
title: Title
subtile: Subtitle
data:
  - entry
  - entry2
---

# Heading level 1

## Heading level 2

### Heading level 3 from local components/content/ProseH3

#### Heading level 4

##### Heading level 5

###### Heading level 6


### h3

#### h4

## Why?

I wanted an editable website living on the edge.

## How?

::alert{type=success}
This is an alert using a Vue component.
::

# Test

::alert{type="warning" icon="exclamation-circle"}
Oops! An error occurred
::

A paragraph

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

**Block**
`
