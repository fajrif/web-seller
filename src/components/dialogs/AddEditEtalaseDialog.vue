<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  etalaseId: {
    type: Number,
    required: true,
    default: 0,
  },
  etalaseName: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const isFormValid = ref(false)
const refForm = ref()
const newEtalaseName = ref('')

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // save showcase
      emit('formSubmitted', props.etalaseId, newEtalaseName.value)
      onReset()
    }
  })
}

watch(() => props.etalaseName, (value) => {
	newEtalaseName.value = value
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
        <VCardItem class="pb-2">
          <VCardTitle>
            <h4 class="text-h4 mb-4">
              {{ props.etalaseId > 0 ? 'Edit Etalase' : 'Tambah Etalase' }}
            </h4>
          </VCardTitle>
          <p
            v-if="props.etalaseId == 0"
            class="text-body-1 mb-0"
          >
            Etalase membantumu dalam merapikan produk-produk tokomu
          </p>
          <p
            v-else
            class="text-body-1 mb-0"
          >
            Ubah nama etalase <strong>{{ props.etalaseName }}</strong>
          </p>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="newEtalaseName"
                :rules="[requiredValidator]"
                placeholder="Masukan nama etalase"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VBtn
            type="submit"
            class="w-100"
          >
            Simpan Etalase
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
