<script lang="ts" setup>
import { useFetchRemote } from '#imports'

const message = ref('')

// TODO Change this. Provide local change in dev mode
// const isDevAndLocal = process.dev && gitConnect.devSource === 'local'

async function onSave() {
  const changes = useCmsChanges()
  const { fetch } = useFetchRemote()

  // if (isDevAndLocal) {
  //   console.log(raw.value)
  //   await $fetch(`/api/_file${path}.md`, {
  //     method: 'PUT',
  //     body: raw.value
  //   })
  //   return
  // }

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

  const actions = changes.value.map(file => ({
    action: "UPDATE",
    content: file.content,
    filePath: file.path
  }))

  const response = await fetch({
    query,
    variables: { message: message.value, actions },
  })

  console.log(response)
  message.value = ""
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NTextInput v-model="message" placeholder="Message..." n="primary" />
    <NButton @click="onSave" n="red6 dark:red5 solid" justify-center icon="i-carbon-cloud-upload"
      :disabled="!message.length">
      Publish
    </NButton>
  </div>
</template>

<style style="postcss" scoped></style>
