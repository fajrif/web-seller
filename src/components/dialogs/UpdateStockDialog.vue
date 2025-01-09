<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
    default: 0,
  },
  productName: {
    type: String,
    required: false,
  },
  productStock: {
    type: Number,
    required: true,
    default: 0,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const isFormValid = ref(false)
const refForm = ref()
const newStockPrice = ref()

const onReset = () => {
  emit('update:isDialogVisible', false)
  newStockPrice.value = null
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // or this one
      emit('formSubmitted', props.productId, newStockPrice.value)

      emit('update:isDialogVisible', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        @submit.prevent="onSubmit"
      >
        <!-- 👉 Title -->
        <VCardItem>
          <VCardTitle>
            <h4 class="text-h4 mb-4">
              Stock
            </h4>
          </VCardTitle>
          <p class="text-body-1 mb-0">
            Ubah stock yang tersedia untuk produk ini<br>
            Stock produk <strong>{{ props.productName }}</strong> sekarang adalah: <strong>{{ props.productStock }}</strong>
          </p>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="newStockPrice"
                suffix="Buah"
                type="number"
                :rules="[requiredValidator]"
                placeholder="Masukan stock"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VBtn
            type="submit"
            class="w-100"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
