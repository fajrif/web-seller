<script setup>
import logoMarketplace from '@images/misc/logo-pln-mobile.png'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { toJpeg } from 'html-to-image'

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
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const orderData = ref()
const hideTemplate = ref(true)
const loading = ref(false)
var _orderId = ''
var qrcode = ''

const onReset = () => {
  emit('update:isDialogVisible', false)
  orderData.value = null
  hideTemplate.value = true
  _orderId = ''
  qrcode = ''
}

const downloadReceipt = () => {
  loading.value = true
  toJpeg(document.getElementById('capture'), { quality: 0.95 })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = `Resi-Pengiriman-${props.orderId}.jpeg`;
      link.href = dataUrl;
      link.click();
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
      console.error('oops, something went wrong!', err);
    });
}

watch(() => props.isDialogVisible, async (visible) => {
  try {
    if (visible) {
      const { data: orderDetails, execute: fetchOrder } = await useApiCore(`/seller/query/transaction/detail/${ props.orderId }`)
      if (orderDetails.value?.status == 200) {
        orderData.value = orderDetails.value.data
        _orderId = String(props.orderId).padStart(12, '0')
        qrcode = useQRCode(_orderId)
      }
      if(isNullOrUndefined(orderData.value))
        hideTemplate.value = false
    }
  } catch (e) {
    hideTemplate.value = false
    console.log(e)
  }
})
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
          <VCol cols="12" id="capture" style="background-color:#fff;">
            <!-- Draw image resi pengiriman -->
            <table
              v-if="orderData"
              class="table-resi w-100"
              >
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="d-flex justify-space-between">
                      <v-img
                        style="max-width:80px"
                        :width="80"
                        cover
                        :src="logoMarketplace"
                        class="ma-4"
                        ></v-img>
                      <v-img
                        style="max-width:80px"
                        :width="80"
                        cover
                        :src="orderData.delivery.image_logistic"
                        class="ma-4"
                        ></v-img>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="d-flex justify-center pa-4">
                      <div class="me-auto">
                        <p class="text-body-1 mb-2 fw-600">
                          Nomor Invoice:
                        </p>
                        <p class="text-body-1 mb-0 fw-600">
                          Nomor Order:
                        </p>
                      </div>
                      <div class="ms-auto text-end">
                        <p class="text-body-1 mb-2 fw-600">
                          {{ orderData.trx_no }}
                        </p>
                        <p class="text-body-1 mb-0 fw-600">
                          #{{ orderData.id }}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="text-center my-0">
                      <vue-barcode :value="_orderId"></vue-barcode>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <p class="text-center my-2 text-body-1 font-weight-bold">
                      Jenis Layanan: {{ orderData.delivery.shipping_type }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td rowspan="2">
                    <p class="text-center my-2 fw-600">
                      <img :src="qrcode" alt="QR Code" />
                    </p>
                  </td>
                  <td>
                    <p class="text-body-1 text-center my-2 fw-600">
                      Asuransi: {{ toCurrency(orderData.delivery.insurance_fee) }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p class="text-body-1 text-center my-2 fw-600">
                      Berat: {{ orderData.total_weight }} gr
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="ma-2">
                      <p class="text-body-2 font-weight-bold mb-1">
                        Pengirim:
                      </p>
                      <p class="text-body-2 font-weight-regular mb-1">
                        {{ orderData.merchant.name }}
                      </p>
                      <p v-html="resolveCompleteAddress(orderData.merchant)" class="text-body-2 font-weight-regular mb-1">
                      </p>
                      <p class="text-body-2 font-weight-regular mb-0">
                        {{ orderData.merchant.phone_office }}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div class="ma-2">
                      <p class="text-body-2 font-weight-bold mb-1">
                        Penerima:
                      </p>
                      <p class="text-body-2 font-weight-regular mb-1">
                        {{ orderData.buyer.full_name }}
                      </p>
                      <p v-html="resolveCompleteAddress(orderData.delivery)" class="text-body-2 font-weight-regular mb-1">
                      </p>
                      <p class="text-body-2 font-weight-regular mb-0">
                        {{ orderData.buyer.phone }}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="text-body-2 ma-2">
                       <strong>Catatan:</strong> Pengirim wajib meminta bukti serah terima paket ke kurir
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="d-flex justify-center ma-2">
                      <div class="me-auto">
                        <p class="text-body-2 font-weight-bold mb-1">
                          Produk:
                        </p>
                        <template
                          v-for="item in orderData.detail"
                          :key="item.id"
                          >
                          <span class="d-block text-body-2 mb-1">
                            {{ item.product.name }}
                          </span>
                        </template>
                      </div>
                      <div class="ms-auto text-end">
                        <p class="text-body-2 font-weight-bold mb-1">
                          Jumlah:
                        </p>
                        <template
                          v-for="item in orderData.detail"
                          :key="item.id"
                          >
                          <span class="d-block text-center text-body-2 mb-1">
                            {{ item.quantity }}
                          </span>
                        </template>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End Draw image resi pengiriman -->
            <div v-else>
              <p v-show="!hideTemplate" class="text-body-1 font-weight-regular">
                Resi pengiriman tidak ditemukan...
              </p>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText>
        <VBtn
          color="primary"
          variant="tonal"
          class="w-100"
          :disabled="isNullOrUndefined(orderData)"
          :loading="loading"
					prepend-icon="tabler-download"
          @click="downloadReceipt"
        >
          Unduh Resi
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style>
table.table-resi,
table.table-resi th,
table.table-resi td {
  border: 1px solid #000;
  border-collapse: collapse;
}
</style>
