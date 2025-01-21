<script setup>
import { useCurrencyInput } from 'vue-currency-input';

defineOptions({
  name: 'AppCurrencyInput',
  inheritAttrs: false,
})

const props = defineProps({
	modelValue: Number
});

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: 'IDR',
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
	currencyDisplay: 'hidden',
  precision: 0,
  valueRange: { min: 0, max: 5000000000 },
});

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id
  const _id = useId()
  
  return _elementIdToken ? `app-text-field-${ _elementIdToken }` : _id
})

const label = computed(() => useAttrs().label)
const rules = computed(() => useAttrs().rules)
const placeholder = computed(() => useAttrs().placeholder)

watch(() => props.modelValue,
  (value) => {
    setValue(value);
  }
);
</script>

<template>
  <div
    class="app-text-field currency-input flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-wrap"
      style="line-height: 15px;"
      :text="label"
    />
    <VTextField
			v-model="formattedValue"
			prefix="Rp"
			:rules="rules"
			:placeholder="placeholder"
      :id="elementId"
			ref="inputRef"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VTextField>
  </div>
</template>
