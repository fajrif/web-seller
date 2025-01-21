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
  productPrice: {
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
const newProductPrice = ref()

const onReset = () => {
  emit('update:isDialogVisible', false)
	newProductPrice.value = props.productPrice
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('formSubmitted', props.productId, newProductPrice.value)
			onReset()
    }
  })
}

watch(() => props.productPrice, (value) => {
	newProductPrice.value = value
});
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
              Harga
            </h4>
          </VCardTitle>
          <p class="text-body-1 mb-0">
            Ubah harga yang tertera untuk produk yang anda jual<br>
            Harga produk <strong>{{ props.productName }}</strong> sekarang adalah: <strong>{{ toCurrency(props.productPrice) }}</strong>
          </p>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppCurrencyInput
                v-model="newProductPrice"
                :rules="[requiredValidator]"
                placeholder="Masukan harga jual"
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
