<script setup>
import tikTokShopLogo from '@images/logos/tiktok-shop.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  productId: {
    type: String,
    required: true,
    default: 0,
  },
  productName: {
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
  emit('formSubmitted', props.productId)
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
                  :src="tikTokShopLogo"
                  class="mx-auto w-40 mb-4"
                />
                <h3>Hapus Produk</h3>
                <p class="text-body-2 mb-0">
                  Apakah anda yakin ingin menghapus produk <strong>{{ props.productName }}</strong> dari TikTok Shop anda?
                </p>
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
            Ya, Lanjutkan
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
