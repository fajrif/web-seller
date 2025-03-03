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

const isRequestPickUpDialogVisible = ref(false)

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const openRequestPickUpDialog = () => {
  isRequestPickUpDialogVisible.value = true
  emit('update:isDialogVisible', false)
}

const generateResiOtomatis = () => {
  console.log('Generate Resi Otomatis')
  emit('update:isDialogVisible', false)
}

watch(() => props.isDialogVisible, async (visible) => {
  if (visible) {
    window.scrollTo(0,0);
	}
})

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
            {{ props.shippingType == 'custom' ? 'Buat Resi Otomatis' : 'Atur Pengiriman' }}
          </h4>
        </VCardTitle>
      </VCardItem>
      <VCardText class="py-2">
        <VRow>
          <VCol cols="12" class="pb-0">
            <div
              v-if="props.shippingType == 'custom'"
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
            <div
              v-else
              class="border cursor-pointer pa-4"
              @click="openRequestPickUpDialog"
              >
              <div class="d-flex justify-space-between align-center gap-4 mb-2">
                <VAvatar
                  rounded="lg"
                  color="info"
                  variant="tonal"
                  icon="tabler-truck-delivery"
                />
                <div>
                  <h6 class="text-h6">
                    Request Pick Up
                  </h6>
                  <p class="text-body-2 mb-0">
                    Kurir {{ props.shippingType }} akan mengambil paket ke alamat anda
                  </p>
                </div>
                <IconBtn
                  color="secondary"
                  icon="tabler-chevron-right"
                  @click="openRequestPickUpDialog"
                />
              </div>
            </div>
          </VCol>
          <VCol cols="12" style="font-size:small;">
            <div class="border rounded bg-warning-info pa-4">
              <h6 class="text-h6 fw-700">Pastikan</h6>
              <ol class="ms-6">
                <li>Produk yang dikirim sudah sesuai pesanan</li>
                <li>Paket telah terbungkus rapi</li>
                <li>Jika Anda menggunakan Request Pick Up. Pastikan Anda telah menuliskan <strong>Kode Booking</strong>, <strong>Nama Penerima</strong>, <strong>Alamat</strong> dan <strong>No.Telepon</strong> pada label paket</li>
              </ol>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
  <RequestPickUpDialog
    v-model:is-dialog-visible="isRequestPickUpDialogVisible"
    v-model:order-id="props.orderId"
    v-model:shipping-type="props.shippingType"
  />
</template>
