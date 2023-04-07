import { computed, ref, onMounted, toRaw } from 'vue'

import type { EventMeta, PropertyMeta, SlotMeta } from 'vue-component-meta'

interface Component {
  name: string
  path: string
  meta: {
    props: PropertyMeta[]
    slots: SlotMeta[]
    events: EventMeta[]
  }
}

const components = ref<Component[]>([])
const frontmatter = ref({})

class MetaComponent {
  constructor(component) {
    Object.assign(this, component)
  }

  getProp(name) {
    return this.meta.props.find(item => item.name === name)
  }

  getPropValues(name) {
    return this.getProp(name).tags[0].text
  }
}

export const useContentEditor = () => {
  // const initialAppConfig = useDefaultAppConfig()

  /**
   * Components
   */

  // Fetch json generated at build time
  const fetchComponents = (async () => {
    components.value = (await $fetch('/__nuxt_content_editor.json')).components
  })

  const getComponent = (name) => {
    const component = components.value.find(item => item.name === name)
    return new MetaComponent(component)
  }

  /**
   * Frontmatter
   */
  const frontmatterKeys = computed(() => Object.keys(frontmatter.value))

  return {
    components,
    fetchComponents,
    getComponent,

    frontmatter,
    frontmatterKeys
  }
}
