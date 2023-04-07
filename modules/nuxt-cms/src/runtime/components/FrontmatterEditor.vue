<script lang="ts" setup>
const props = defineProps<{
  modelValue: Object
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Object): void
}>()

function onAddNew() {
  // TODO Better UX + stringify(key) + prevent adding duplicate entry
  const key = prompt('Key ?') || 'key'
  emit('update:modelValue', Object.assign(props.modelValue, { [key]: '' }))
  nextTick(() => {
    document.getElementById(key)?.focus()
  })
}

function onUp(val) {
  console.log(val.target.value)
}
</script>

<template>
  <div class="flex flex-col gap-3 border-t mt-4 pt-2">
    <div v-if="props.modelValue" class="flex flex-col gap-2">
      <div v-for="(value, key) of props.modelValue" :key="key.toString()" class="">
        <label :for="key.toString()" class="text-xs capitalize font-bold">
          {{ key }}
        </label>
        <div v-if="typeof props.modelValue[key] === 'string'">
          <input :id="key.toString()" type="text" v-model="props.modelValue[key]" class="frontmatter-input" />
        </div>
        <div v-else-if="Array.isArray(props.modelValue[key])" class="bg-light-50 dark:bg-dark-50 !bg-opacity-50">
          <div v-for="(itemValue, itemKey) in props.modelValue[key]" :key="itemKey" class="">
            <div v-if="typeof itemValue === 'object' && itemValue !== null"
              v-for="(itemObjectValue, itemObjectKey) of itemValue" :key="itemObjectKey" class="px-2 pb-2">
              <label :for="itemObjectKey.toString()" class="text-xs capitalize font-bold">
                {{ itemObjectKey }}
              </label>
              <input :id="itemObjectKey.toString()" type="text"
                v-model="(props.modelValue[key] as unknown as Object[]).at(itemKey as unknown as number)![itemObjectKey]"
                class="frontmatter-input" />
            </div>
            <div v-else class="p-2">
              <input v-if="itemKey !== 'name' && itemKey !== 'length'" :id="itemValue.toString()" type="text"
                :value="(props.modelValue[key] as unknown as string[]).at(itemKey as unknown as number)"
                @input="props.modelValue[key][itemKey] = ($event.target as HTMLInputElement).value.trim()"
                class="frontmatter-input" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <button @click="onAddNew">
        Add new
      </button>
    </div>
  </div>
</template>

<style lang="postcss">
.frontmatter-input {
  @apply w-full text-xs capitalize font-bold p-2 bg-gray-50 dark:bg-dark-50 !bg-opacity-50;
}
</style>
