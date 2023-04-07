<template>
  <div class="absolute z-1 right-4 flex flex-col items-end !max-w-300px bg-gray-100 dark:bg-dark p-4">
    <div class="flex justify-between w-full">
      <button v-if="isEditing" @click="onSave">Save</button>
      <button v-if="isEditing" @click="isMdPanel = !isMdPanel">Show md</button>
      <button @click="isEditing = !isEditing">
        {{ isEditing ? "Cancel" : "Edit" }}
      </button>
    </div>
    <div v-if="isEditing" class="mt-2">
      <input type="text" v-model="message" class="w-full bg-gray-50 dark:bg-dark-50 !bg-opacity-50 p-2" />
      <FrontmatterEditor v-model="frontmatter" />
    </div>
  </div>


  <div v-bind="$attrs">
    <div class="flex gap-4 !max-w-full" :class="{ '!max-w-full': isMdPanel }">
      <slot v-bind="$attrs" />
      <MarkdownEditor v-if="isMdPanel" v-model="raw" @focus="focusedComponent = 'MarkdownEditor'"
        @blur="focusedComponent = ''" />
      <client-only>
        <!-- <LazyBlocknote v-model="body" /> -->
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { parseFrontMatter, stringifyFrontMatter } from "remark-mdc"
import { computed, onMounted, queryContent, ref, watch, useRoute, useNuxtApp, useRuntimeConfig } from '#imports'
import MarkdownEditor from "./MarkdownEditor.vue"

const emit = defineEmits<{
  (e: 'focus', value: string): void
}>()

const { path } = useRoute()
const { $git } = useNuxtApp()
const { gitConnect } = useRuntimeConfig()

const isEditing = ref(false)
const focusedComponent = ref('')
watch(focusedComponent, (val) => {
  emit('focus', val)
})

const isMdPanel = ref(false)

const message = ref<string>("")

const repo = gitConnect.repo

const body = ref<string>("")
const frontmatter = ref<Record<string, any>>({})
const raw = computed<string>({
  get: () => {
    return stringifyFrontMatter(frontmatter.value) + body.value.trim()
  },
  async set(val) {
    try {
      const { content, data } = await parseFrontMatter(val)
      body.value = content.trim()
      frontmatter.value = defu(data, {}) // Use defu to remove null and undefined values
    } catch (error) {
      console.log('Bad frontmatter', error)
    }
  }
})

const isDevAndLocal = process.dev && gitConnect.devSource === 'local'

onMounted(async () => {
  if (isDevAndLocal) {
    const parsed = await $fetch(`/api/_file${path}.md`)
    raw.value = parsed

    return
  }

  await $git.auth.getUser()

  const response = await $git.query({
    query: `#graphql
      query files(
        $repo: ID!
        $paths: [String!]!
      ) {
        project(fullPath: $repo) {
          repository {
            blob: blobs(paths: $paths) {
              node: nodes {
                id: oid
                name
                rawBlob
                canModifyBlob
              }
            }
          }
        }
      }
    `,
    variables: { paths: `content${path}.md`, repo },
  })

  raw.value = response.data.project.repository.blob.node[0].rawBlob
})

async function onSave() {
  if (isDevAndLocal) {
    console.log(raw.value)
    await $fetch(`/api/_file${path}.md`, {
      method: 'PUT',
      body: raw.value
    })
    return
  }

  const query = `#graphql
    mutation createCommit($repo: ID!, $message: String!, $actions: [CommitAction!]!) {
      commitCreate(
        input: {projectPath: $repo, branch: "main", message: $message, actions: $actions}
      ) {
        clientMutationId
        content
        commit {
          id
          message
          author {
            username
          }
          description
          fullTitle
          authoredDate
        }
      }
    }
  `

  const actions = [
    {
      action: "UPDATE",
      content: raw.value,
      filePath: `content${path}.md`,
    },
  ]

  const response = await $git.query({
    query,
    variables: { repo, message: message.value, actions },
  })
  console.log(response)
  message.value = ""
}
</script>
