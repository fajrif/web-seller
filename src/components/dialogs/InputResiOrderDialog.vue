<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
    default: 0,
  },
  invoiceNo: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const refForm = ref()
const nomorResi = ref()

const onReset = () => {
  emit('update:isDialogVisible', false)
	nomorResi.value = ''
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // or this one
      emit('formSubmitted', props.invoiceNo, nomorResi.value)
      onReset()
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
        @submit.prevent="onSubmit"
      >
        <!-- 👉 Title -->
        <VCardItem class="pb-2">
          <VCardTitle>
            <h4 class="text-h4 mb-4">
              Masukkan Resi
            </h4>
          </VCardTitle>
          <p class="text-body-1 font-weight-bold mb-2">
						Invoice No: {{ props.invoiceNo }}
          </p>
          <p class="text-body-1 mb-0">
            Masukkan resi yang sudah anda dapatkan dari jasa pengiriman yang anda pilih
          </p>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="nomorResi"
                :rules="[requiredValidator]"
                placeholder="Masukan nomor resi"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VBtn
            type="submit"
            class="w-100"
          >
            Konfirmasi Produk Dikirim
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
