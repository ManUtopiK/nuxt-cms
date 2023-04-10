import { parseFrontMatter, stringifyFrontMatter } from 'remark-mdc'

interface Document {
  id: string
  type: string
  label: string
  name: string
  path: string
  body: any
  children: Array<Document>
  treeNodeSpec: {
    expandable: Boolean
    loadChildrenAsync: Function
  }
}

export function useFetchRemote () {
  const client = useClient()

  async function fetch ({ query, variables }: { query: any, variables?: object }) {
    const { api, repo, auth } = client.value.git
    const variablesWithRepo = { repo, ...variables }

    const { data } = await $fetch(`${api}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: await auth.getToken()
      },
      body: JSON.stringify({ query, variables: variablesWithRepo })
    })

    if (!data) { throw `Cannot connect to ${api}/${repo}` }
    return data
  }

  return { fetch }
}

export async function useFetchRepoContent () {
  const { fetch } = useFetchRemote()

  const blobsFragment = `#graphql
    blobs(after: $cursor) {
      nodes {
        type
        id: sha
        path
        name
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  `

  const queryData = `#graphql
    query files(
      $repo: ID!
      $branch: String!
      $path: String!
      $recursive: Boolean!
      $cursor: String
    ) {
      project(fullPath: $repo) {
        repository {
          tree(ref: $branch, path: $path, recursive: $recursive) {
            ${blobsFragment}
          }
        }
      }
    }
  `

  const listAllFilesGraphQL = async (
    path: string,
    recursive: boolean,
    branch: String
  ) => {
    const files = []
    let response
    let cursor
    do {
      response = await fetch({
        query: queryData,
        variables: {
          branch,
          path,
          recursive,
          cursor
        }
      })
      files.push(...response.project.repository.tree.blobs.nodes)
      cursor = response.project.repository.tree.blobs.pageInfo.endCursor
    } while (response.project.repository.tree.blobs.pageInfo.hasNextPage)

    // fetch content of files
    // TODO Check gitlab limit and pageInfo
    const data = await fetch({
      query: `#graphql
        query blobs($repo: ID!, $paths: [String!]!) {
          project(fullPath: $repo) {
            repository {
              blobs(paths: $paths) {
                nodes {
                  id: oid
                  rawBlob
                }
              }
            }
          }
        }
        `,
      variables: {
        paths: files.map(file => file.path)
      }
    })

    // Parse content
    files.map((file) => {
      // Add body to item
      const body = data.project.repository.blobs.nodes.find(
        blob => blob.id === file.id
      ).rawBlob

      // TODO get frontmatter title or file name ?
      file.label = file.name

      // Get extension
      const extension = file.name.match(/.*\.(.*)/)
      file.extension = extension[1]

      if (file.extension === 'md') {
        const { content, data } = parseFrontMatter(body)
        file.content = content
        file.data = data
        // We rewrite rawBody with stringified frontMatter to be sure the whole document is correctly formatted.
        file.rawBlob = stringifyFrontMatter(data) + content
      } else {
        file.content = body
        file.data = {}
      }

      return file
    })

    return files
  }

  const files = await listAllFilesGraphQL('content', true, 'main')
  return files
}

export async function useFetchAllFiles () {
  // const useMyFetch = createFetch({
  //   baseUrl: $git.auth.config.baseUrl,
  //   combination: 'overwrite',
  //   options: {
  //     async beforeFetch({ options }) {
  //       options.headers = {
  //         ...options.headers,
  //         Authorization: await $git.auth.getToken(),
  //       }

  //       return { options }
  //     },
  //   },
  //   fetchOptions: {
  //     mode: 'cors',
  //   },
  // })
  // const { isFetching, error, data } = useMyFetch('users')

  const { fetch } = useFetchRemote()

  const blobsFragment = `#graphql
    blobs(after: $cursor) {
      nodes {
        type
        id: sha
        path
        name
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  `

  const queryData = `#graphql
    query files(
      $repo: ID!
      $branch: String!
      $path: String!
      $recursive: Boolean!
      $cursor: String
    ) {
      project(fullPath: $repo) {
        repository {
          tree(ref: $branch, path: $path, recursive: $recursive) {
            ${blobsFragment}
            trees {
              nodes {
                id
                name
                path
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  `

  const listAllFilesGraphQL = async (
    path: string,
    recursive: boolean,
    branch: String
  ) => {
    const tree = []
    const files = []
    let response
    let cursor
    do {
      response = await fetch({
        query: queryData,
        variables: {
          branch,
          path,
          recursive,
          cursor
        }
      })
      files.push(...response.project.repository.tree.blobs.nodes)
      cursor = response.project.repository.tree.blobs.pageInfo.endCursor
    } while (response.project.repository.tree.blobs.pageInfo.hasNextPage)

    // Add folders
    // TODO fix do while loop with this
    response.project.repository.tree.trees.nodes.forEach((dir: Document) => {
      tree.push({
        id: dir.id.replace(/.*TreeEntry\//, ''),
        type: 'dir',
        label: dir.name,
        path: dir.path,
        children: [],
        treeNodeSpec: {
          expandable: true,
          state: {
            expanded: false
          },
          loadChildrenAsync: async (parent: Document) => {
            // console.log(parent)
            // parent.treeNodeSpec.customizations.classes.treeViewNodeSelf = 'loading'
            // const children = new Promise(resolve => setTimeout(resolve, 2000000))
            const children = await listAllFilesGraphQL(parent.path, false, 'main')
            return children
          }
        }
      })
    })

    // fetch content of files
    const data = await fetch({
      query: `#graphql
        query blobs($repo: ID!, $paths: [String!]!) {
          project(fullPath: $repo) {
            repository {
              blobs(paths: $paths) {
                nodes {
                  id: oid
                  rawBlob
                }
              }
            }
          }
        }
        `,
      variables: {
        paths: files.map(file => file.path)
      }
    })

    // Parse content
    files.forEach((file) => {
      // Add body to item
      const body = data.project.repository.blobs.nodes.find(
        blob => blob.id === file.id
      ).rawBlob

      // TODO get frontmatter title or file name ?
      file.label = file.name

      // Get extension
      const extension = file.name.match(/.*\.(.*)/)
      file.extension = extension[1]

      if (file.extension === 'md') {
        const { content, data } = parseFrontMatter(body)
        file.content = content
        file.data = data
        // We rewrite rawBody with stringified frontMatter to be sure the whole document is correctly formatted.
        file.rawBlob = stringifyFrontMatter(data) + content
      } else {
        file.content = body
        file.data = {}
      }

      tree.push({
        ...file
      })

      // watch(() => file.body, (newVal) => {
      //   console.log(newVal)
      // })
    })

    return tree
  }

  const files = await listAllFilesGraphQL('content', false, 'main')
  return files
}
