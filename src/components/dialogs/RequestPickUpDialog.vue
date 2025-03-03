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

const refForm = ref()
const orderData = ref()
const addressDetail = ref('')
const imgLogistic = ref('')
const selectedDate = ref('')
const selectedTime = ref('')

const { data: orderDetails, execute: fetchOrder, isFinished: loading } = await useApiCore(`/seller/query/transaction/detail/${ props.orderId }`)
if (orderDetails.value.status == 200) {
  orderData.value = orderDetails.value.data
  addressDetail.value = resolveCompleteAddress(orderData.value.merchant, false)
  imgLogistic.value = orderData.value.delivery.image_logistic
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  selectedDate.value = ''
  selectedTime.value = ''
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // or this one
      // emit('formSubmitted', props.orderId, nomorResi.value)
      onReset()
    }
  })
}
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    min-height="300"
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
        <VCardItem class="pb-0">
          <VCardTitle>
            <h4 class="text-h4 mb-0">
              Request Pick Up
            </h4>
          </VCardTitle>
        </VCardItem>
        <VCardText class="py-2">
          <VRow>
            <VCol cols="12" class="pb-0">
              <AppTextarea
                v-model="addressDetail"
                prepend-inner-icon="tabler-map-pin"
                label="Lokasi Penjemputan"
                placeholder="Alamat penjemputan"
                readonly
                rows="2"
                />
            </VCol>
            <VCol cols="6" class="pb-0">
              <AppDateTimePicker
                v-model="selectedDate"
                label="Tanggal"
                prepend-inner-icon="tabler-calendar"
                placeholder="Pilih tanggal"
              />
            </VCol>
            <VCol cols="6" class="pb-0">
              <AppSelect
                v-model="selectedTime"
                :items="timeOptionsJemput"
                label="Waktu"
                prepend-inner-icon="tabler-clock"
                placeholder="Pilih waktu"
              />
            </VCol>
            <template v-if="!isEmpty(selectedDate) && !isEmpty(selectedTime)">
              <VCol cols="12" class="pb-0">
                <h6 class="text-h6 mb-2">
                  Detail Request Pick Up
                </h6>
                <div class="border px-4 py-0">
                  <div class="d-flex align-center gap-4 mb-2">
                    <v-img
                      style="max-width:80px"
                      :width="80"
                      cover
                      :src="imgLogistic"
                      ></v-img>
                    <div>
                      <h6 class="text-h6">
                        {{ props.shippingType }}
                      </h6>
                      <p class="text-body-2 mb-0">
                        Estimasi penjemputan hingga <strong>{{ toLocaleDateTime(selectedDate,'dddd, DD MMMM YYYY') }} {{ selectedTime }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol cols="12" style="font-size:small;">
                <VAlert
                  type="info"
                  variant="tonal"
                  >
                  Pihak jasa pengiriman akan menghubungi Anda melalui
                  nomor handphone Anda yang terdaftar di PLN Mobile
                </VAlert>
                <div class="pa-4">
                  <h6 class="text-h6 fw-700">Pastikan</h6>
                  <ol class="ms-6">
                    <li>Produk yang dikirim sudah sesuai pesanan</li>
                    <li>Paket telah terbungkus rapi</li>
                    <li>Jika Anda menggunakan Request Pick Up. Pastikan Anda telah menuliskan <strong>Kode Booking</strong>, <strong>Nama Penerima</strong>, <strong>Alamat</strong> dan <strong>No.Telepon</strong> pada label paket</li>
                  </ol>
                </div>
              </VCol>
            </template>
          </VRow>
        </VCardText>
        <VCardText v-if="!isEmpty(selectedDate) && !isEmpty(selectedTime)">
          <VBtn
            type="submit"
            class="w-100"
          >
            Request Pick Up
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
