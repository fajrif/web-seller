<script setup>
import Treeselect from '@cholakovdev/vue3-treeselect'

defineOptions({
  name: 'AppTreeSelect',
  inheritAttrs: false,
})

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id
  const _id = useId()
  
  return _elementIdToken ? `app-text-field-${ _elementIdToken }` : _id
})

const label = computed(() => useAttrs().label)
</script>

<template>
  <div
    class="app-text-field tree-select flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-wrap"
      style="line-height: 15px;"
      :text="label"
    />
			<treeselect
				v-bind="{
					...$attrs,
					class: null,
				}"
				/>
			<VTextField
				v-bind="{
					...$attrs,
					class: null,
					label: undefined,
					id: elementId,
				}"
			/>
  </div>
</template>
