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
  receiptImage: {
    type: String,
    required: true,
    default: '',
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const downloadReceipt = () => {
  console.log('Download Receipt')
}

</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
      <!-- 👉 Title -->
      <VCardItem class="pb-0">
        <VCardTitle>
          <h4 class="text-h4 mb-0">
            Resi Pengiriman
          </h4>
        </VCardTitle>
      </VCardItem>
      <VCardText class="py-2">
        <VRow>
          <VCol cols="12" class="pb-0">
            <!-- image resi pengiriman -->
          </VCol>
        </VRow>
      </VCardText>
      <VCardText>
        <VBtn
          color="primary"
          variant="tonal"
          class="w-100"
					prepend-icon="tabler-download"
        >
          Unduh Resi
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
