<script setup>
import logoMarketplace from '@images/misc/logo-pln-mobile.png'
import shipSeller from '@images/logos/delivery/seller.png'
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
const loading = ref(false)
var _orderId = ''
var qrcode = ''

const onReset = () => {
  emit('update:isDialogVisible', false)
  orderData.value = null
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

const showTemplate = computed(() => !isNullOrUndefined(orderData.value) && !isEmpty(_orderId))

watch(() => props.isDialogVisible, async (visible) => {
  try {
    if (visible) {
      const { data: orderDetails, execute: fetchOrder } = await useApiCore(`/seller/query/transaction/detail/${ props.orderId }`)
      if (orderDetails.value?.status == 200) {
        orderData.value = orderDetails.value.data
        _orderId = orderData.value.delivery.awb_number
        qrcode = useQRCode(_orderId)
      }
    }
  } catch (e) {
    orderData.value = null
    _orderId = ''
    qrcode = ''
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
      <template
        v-if="showTemplate"
        >
        <VCardText class="py-2">
          <VRow>
            <VCol cols="12" id="capture" style="background-color:#fff;">
              <!-- Draw image resi pengiriman -->
              <table
                class="table-resi w-100"
                >
                <tbody>
                  <tr>
                    <td colspan="2">
                      <div class="d-flex justify-space-between">
                        <v-img
                          style="max-width:80px"
                          :width="80"
                          contain
                          :src="logoMarketplace"
                          class="ma-4"
                          ></v-img>
                        <v-img
                          style="max-width:100px"
                          :width="100"
                          contain
                          :src="orderData.delivery.shipping_type === 'custom' ? shipSeller : orderData.delivery.image_logistic"
                          class="ma-4"
                          ></v-img>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="d-flex justify-center pa-2">
                        <div class="me-auto">
                          <p class="text-body-1 text-black mb-1 fw-600">
                            Nomor Invoice:
                          </p>
                          <p class="text-body-1 text-black mb-0 fw-600">
                            Nomor Order:
                          </p>
                        </div>
                        <div class="ms-auto text-end">
                          <p class="text-body-1 text-black mb-1 fw-600">
                            {{ orderData.trx_no }}
                          </p>
                          <p class="text-body-1 text-black mb-0 fw-600">
                            {{ orderData.no_reference }}
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
                      <p class="text-center my-2 text-body-1 text-black font-weight-medium text-uppercase">
                        {{ resolveShippingTypeText(orderData.delivery.shipping_type) }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <p class="text-center my-2 text-body-1 text-black font-weight-medium text-uppercase">
                        Non COD
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="2" style="width:150px;">
                      <img :src="qrcode" alt="QR Code" width="150" height="150" />
                    </td>
                    <td>
                      <p class="text-body-1 text-center text-black font-weight-medium my-2">
                        Asuransi: {{ toCurrency(orderData.delivery.insurance_fee) }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p class="text-body-1 text-center text-black font-weight-medium my-2">
                        Berat: {{ toKilo(orderData.total_weight) }} KG
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <table class="table-address">
                        <tbody>
                          <tr>
                            <td>
                              <div class="ma-2">
                                <p class="text-body-2 font-weight-bold text-black mb-1">
                                  Penerima:
                                </p>
                                <p class="text-body-2 font-weight-medium mb-1">
                                  {{ orderData.delivery.receiver_name }}
                                </p>
                                <p v-html="resolveCompleteAddress(orderData.delivery)" class="text-body-2 font-weight-regular mb-1">
                                </p>
                                <p class="text-body-2 font-weight-regular mb-0">
                                  {{ orderData.delivery.receiver_phone }}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div class="ma-2">
                                <p class="text-body-2 font-weight-bold text-black mb-1">
                                  Pengirim:
                                </p>
                                <p class="text-body-2 font-weight-medium mb-1">
                                  {{ orderData.merchant.name }}
                                </p>
                                <p v-html="resolveCompleteAddress(orderData.merchant)" class="text-body-2 font-weight-regular mb-1">
                                </p>
                                <p class="text-body-2 font-weight-regular mb-0">
                                  {{ orderData.merchant.phone_office }}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <table class="table-product w-100 my-2">
                        <thead>
                          <tr>
                            <th class="text-start">
                              <span class="text-body-2 text-black font-weight-bold d-block ms-2 mb-1">
                                Produk:
                              </span>
                            </th>
                            <th class="text-end">
                              <span class="text-body-2 text-black font-weight-bold d-block me-2 mb-1">
                                Jumlah
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <template
                            v-for="item in orderData.detail"
                            :key="item.id"
                            >
                            <tr>
                              <td>
                                <div class="ms-2 my-0">
                                  <small class="d-block mb-0">
                                    {{ item.product.name }}
                                  </small>
                                  <small class="d-block mb-1">
                                    <strong class="font-weight-bold text-black">Catatan:</strong> {{ isEmpty(item.notes) ? '-' : item.notes }}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span class="d-block text-end text-body-2 me-2">
                                  {{ item.quantity }}
                                </span>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- End Draw image resi pengiriman -->
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VBtn
            color="primary"
            class="w-100"
            :loading="loading"
            prepend-icon="tabler-download"
            @click="downloadReceipt"
            >
            Unduh Resi
          </VBtn>
        </VCardText>
      </template>
      <template v-else>
        <VCardText class="py-2">
          <p class="text-body-1 font-weight-regular">
            Maaf No. Resi pengiriman tidak dapat ditemukan...
          </p>
        </VCardText>
      </template>
    </VCard>
  </VDialog>
</template>

<style>
table.table-resi,
table.table-resi th,
table.table-resi td {
  border: 1.5px solid #373737;
  border-collapse: collapse;
}
table.table-product,
table.table-product th,
table.table-product td {
  border: 0;
  border-collapse: collapse;
}
table.table-address th,
table.table-address td {
  width: 50%;
  border: none;
  vertical-align: top;
}
</style>
