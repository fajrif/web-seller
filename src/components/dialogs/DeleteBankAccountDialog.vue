<script setup>
import iconAsk from '@images/icons/ic-status.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  itemId: {
    type: Number,
    required: true,
    default: 0,
  },
  bankName: {
    type: String,
    required: false,
  },
  accountNo: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  emit('formSubmitted', props.itemId)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog Content -->
    <VCard>
      <VForm @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="iconAsk"
                  class="mx-auto w-40"
                />
              <div class="mx-10">
                <h3 class="mb-1">Hapus Akun Bank Anda</h3>
                <p class="text-body-2 mb-0">
                  Apakah anda yakin ingin menghapus akun <strong>{{ props.bankName }}</strong>
                  dengan No.Rekening <strong>{{ props.accountNo }}</strong>?
                </p>
              </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-center gap-3 flex-wrap">
          <VBtn
            color="primary"
            variant="outlined"
            @click="onReset"
          >
            Batal
          </VBtn>
          <VBtn type="submit">
            Ya, Hapus
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
