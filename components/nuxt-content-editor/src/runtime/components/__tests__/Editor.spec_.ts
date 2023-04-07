import { describe, it, expect, vi } from 'vitest'
import Editor from '../Editor2.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import testMD from './test-md'

vi.mock('#build/components.client', async (original) => {
  // Don't know why it works ! See alias in vitest.config.ts
  return {}
})

describe.skip('Editor', () => {
  const mdContent = 'I’m running **Tiptap** in _Vitest_ 🎉'
  const htmlContent = '<p>I’m running <strong>Tiptap</strong> in <em>Vitest</em> 🎉</p>'

  const wrapper = mount(Editor, {
    props: {
      modelValue: mdContent
    }
  })

  it.only('should render correctly', async () => {
    await nextTick()
    console.log(wrapper.html())
    expect(wrapper.html()).toContain(htmlContent)
  })

  it('should be reactive', async () => {
    const newContent = mdContent.replace('🎉', '🚀')
    await wrapper.setProps({ modelValue: newContent })
    setTimeout(() => {
      expect(wrapper.html()).toContain(htmlContent.replace('🎉', '🚀'))
    }, 100)
  })

  it('should handle markdown', async () => {

    await wrapper.setProps({ modelValue: testMD })
    setTimeout(() => {
      console.log(wrapper.html())
      expect(wrapper.html()).toContain(htmlContent.replace('🎉', '🚀'))
    }, 1000)
  })
})
