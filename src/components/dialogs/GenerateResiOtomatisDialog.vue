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
  shippingType: {
    type: String,
    required: true,
    default: '',
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const generateResiOtomatis = () => {
  emit('formSubmitted', props.orderId)
  onReset()
}

</script>

<template>
  <VDialog
    persistent
    max-width="500"
    min-height="380"
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
            Buat Resi Otomatis (Order ID: #{{ props.orderId }})
          </h4>
        </VCardTitle>
      </VCardItem>
      <VCardText class="py-2">
        <VRow>
          <VCol cols="12" class="pb-0">
            <div
              class="border cursor-pointer pa-4"
              @click="generateResiOtomatis"
              >
              <div class="d-flex justify-space-between align-center gap-4 mb-2">
                <VAvatar
                  rounded="lg"
                  color="info"
                  variant="tonal"
                  icon="tabler-receipt"
                />
                <div>
                  <h6 class="text-h6">
                    Generate Resi Otomatis
                  </h6>
                  <p class="text-body-2 mb-0">
                    Resi akan digenerate secara otomatis. Cetak resi
                    dan tempelkan pada paket Anda. Anda dapat
                    mengirimkan paket Anda ke counter terdekat
                  </p>
                </div>
                <IconBtn
                  color="secondary"
                  icon="tabler-chevron-right"
                  @click="generateResiOtomatis"
                />
              </div>
            </div>
          </VCol>
          <VCol cols="12">
            <ShipmentOrderInfo
              :is-show-info="false"
              />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
