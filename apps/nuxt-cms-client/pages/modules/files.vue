<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'i-ph-files',
  title: 'Files',
  order: -50
})

interface VfsFile {
  id: string
  content: string
}

const searchString = ref('')

const rawFiles = await useFileStore()

const filePath = computed(() => useRoute().query?.path as string | undefined)

const current = ref<VfsFile>()

const files = computed(() => {
  if (!rawFiles) return []

  return rawFiles
    // Hide Nuxt dist files, as they are aliased as `#build`
    // .filter(i => !i.id.startsWith(`${rawFiles?.rootDir || ''}/.nuxt/`))
    .sort((a, b) => a.id.localeCompare(b.id))
})

const fuse = computed(() => new Fuse(files.value, {
  keys: ['id', 'path',],
}))

const filteredFiles = computed(() => {
  if (!searchString.value) return []
  return fuse.value.search(searchString.value).map(i => i.item.path)
})



function onSelect(event) {
  const route = event ? `/modules/files?path=${encodeURIComponent(event.path)}` : '/modules/files'
  useRouter().push(route)
}

const clientRouter = useClientRouter()
function navigateToRoute(path: string) {
  // TODO Determine path with $content or router
  clientRouter.value.push(path.replace('content', '').replace('.md', ''))
}

watchEffect(() => {
  if (!filePath.value) return current.value = undefined
  const directories = filePath.value.replace('content/', '').split('/')

  if (directories.length === 1) {
    current.value = files.value.find(file => file.path === filePath.value)
  } else if (directories.length === 2) {
    const directory = files.value.find(dir => dir.path === `content/${directories[0]}`)
    current.value = directory.children.find(file => file.path === filePath.value)
  } else {
    const directory = files.value.find(dir => dir.path === `content/${directories[0]}`)
    const sub = directory.children.find(dir => dir.path === `content/${directories[0]}/${directories[1]}`)
    current.value = sub.children.find(file => file.path === filePath.value)
  }
})
</script>

<template>
  <PanelLeftRight class="virtual-files" storage-key="tab-virtual-files">
    <template #left>
      <div class="flex flex-col h-full">
        <div p2 navbar-glass class="!z-1">
          <NTextInput v-model="searchString" icon="i-carbon-search" placeholder="Search..." n="primary" />
        </div>
        <RepositoryTree :files="files" :filteredFiles="filteredFiles" @select="onSelect($event)"
          @navigate="navigateToRoute" />
      </div>
    </template>

    <template #right v-if="current?.content">
      <div h-full of-hidden flex="~ col">
        <div border="b base" text-sm flex-none px4 py2 op75>
          <code>{{ current.path }}</code>
        </div>
        <MarkdownEditor h-full of-auto v-model="current.rawBlob" />
      </div>
      <!-- <span v-else h-full flex items-center justify-center op50>Select one file to start</span> -->
    </template>
  </PanelLeftRight>
</template>

<style>
.virtual-files .shiki {
  padding: 10px;
  background: none !important;
}
</style>