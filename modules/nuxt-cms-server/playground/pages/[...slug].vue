<script setup lang="ts">
import { createStorage } from 'unstorage'
import httpDriver from 'unstorage/drivers/http'

const route = useRoute()

const storage = createStorage({
  driver: httpDriver({ base: '/api/_local_files' })
})

const input = ref('')

const id = computed(() => {
  if (route.path === '/') return 'content:index.md'
  return `content${route.path.replaceAll('/', ':')}.md`
})

onMounted(async () => {
  const contentQuery = await queryContent(route.path).findOne()
  if (contentQuery) input.value = (await storage.getItem(contentQuery._id))._raw
})

watch(input, async (newVal) => {
  await storage.setItem(id.value, newVal)
})
</script>

<template>
  <div>
    <div style="padding-bottom: 20px;">
      <nuxt-link
        v-if="$route.path === '/'"
        :to="Math.random().toString().replace('0.', '')"
      >
        New file
      </nuxt-link>
      <nuxt-link
        v-else
        to="/"
      >
        Home
      </nuxt-link>
    </div>
    <textarea
      v-model="input"
      style="min-height:200px; min-width: 50vw;"
      :placeholder="`Write to create the file content${$route.path}.md`"
    />
    <ContentDoc>
      <template #not-found>
        <h3>Write to create the file content{{ $route.path }}.md</h3>
      </template>
    </ContentDoc>
  </div>
</template>
