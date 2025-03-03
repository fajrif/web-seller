<script setup>
import { useMessageStore } from '@core/stores/config'

const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
  invoiceNo: {
    type: String,
    required: true,
  },
  statusCode: {
    type: String,
    required: true,
  },
  deliverySetting: {
    type: String,
    required: false,
    default: ''
  },
  shippingType: {
    type: String,
    required: true,
    default: '',
  },
  size: {
    type: String,
    required: false,
    default: 'default'
  },
  displayDetail: {
    type: Boolean,
    required: false,
    default: true
  },
})

const emit = defineEmits([
  'callbackButton',
])

const router = useRouter()
const messageStore = useMessageStore()
const isAcceptOrderDialogVisible = ref(false)
const isCancelOrderDialogVisible = ref(false)
const isShipmentOrderSettingsDialogVisible = ref(false)
const isGenerateResiOrderDialogVisible = ref(false)
const isInputResiOrderDialogVisible = ref(false)

const acceptOrder = async (id) => {
  try {
		const res = await $apiCore('/seller/command/order/accept/', {
  		method: 'POST',
  		body: { id: [id] },
		})
    emit('callbackButton')
  	messageStore.setMessage('success', res.message)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal terima pesanan')
    console.error("Error on accepts order data:", error)
  }
}

const cancelOrder = async (id,notes) => {
  try {
		const res = await $apiCore(`/seller/command/order/reject/${id}`, {
  		method: 'POST',
  		body: { notes: notes },
		})
    emit('callbackButton')
  	messageStore.setMessage('success', res.message)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal membatalkan pesanan')
    console.error("Error on cancel order data:", error)
  }
}

const inputResiOrder = async (id,resi) => {
  try {
    const res = await $apiCore(`/seller/command/order/awb-number/${id}/${resi}`, {
  		method: 'POST',
		})
    emit('callbackButton')
  	messageStore.setMessage('success', res.message)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal masukkan resi pesanan')
    console.error("Error on inputResi order data:", error)
  }
}

const acceptOrderItem = () => {
  isAcceptOrderDialogVisible.value = true
}

const cancelOrderItem = () => {
  isCancelOrderDialogVisible.value = true
}

const shipmentSettingsOrderItem = () => {
  isShipmentOrderSettingsDialogVisible.value = true
}

const generateResiOrderItem = () => {
  isGenerateResiOrderDialogVisible.value = true
}

const inputResiOrderItem = () => {
  isInputResiOrderDialogVisible.value = true
}

const viewOrderItem = () => {
	router.push('/pesanan/view/' + props.orderId)
}
</script>

<template>
  <div
    class="d-flex justify-end gap-4"
    >
    <template v-if="props.statusCode == '01'">
      <VBtn
        color="error"
        variant="tonal"
        class="me-1"
        :size="props.size"
        @click="cancelOrderItem"
        >
        Tolak Pesanan
      </VBtn>
      <VBtn
        color="primary"
        :size="props.size"
        @click="acceptOrderItem"
        >
        Terima Pesanan
      </VBtn>
    </template>
    <template v-else-if="props.statusCode == '02'">
      <VBtn
        v-if="props.deliverySetting == 'shipper'"
        color="primary"
        :size="props.size"
        @click="shipmentSettingsOrderItem"
        >
        Atur Pengiriman
      </VBtn>
      <VBtn
        v-else-if="props.shippingType == 'custom'"
        color="primary"
        :size="props.size"
        @click="generateResiOrderItem"
        >
        Buat Resi Otomatis
      </VBtn>
      <VBtn
        v-else
        color="primary"
        :size="props.size"
        @click="inputResiOrderItem"
        >
        Masukkan Resi
      </VBtn>
    </template>
    <template v-else>
      <VBtn
        v-if="props.displayDetail"
        color="primary"
        :size="props.size"
        @click="viewOrderItem"
        >
        Lihat Detail
      </VBtn>
    </template>
  </div>
  <!-- place dialog here -->
  <AcceptOrderDialog
    v-model:is-dialog-visible="isAcceptOrderDialogVisible"
    v-model:order-id="props.orderId"
    v-model:invoice-no="props.invoiceNo"
    @form-submitted="acceptOrder"
    />
  <CancelOrderDialog
    v-model:is-dialog-visible="isCancelOrderDialogVisible"
    v-model:order-id="props.orderId"
    v-model:invoice-no="props.invoiceNo"
    @form-submitted="cancelOrder"
    />
  <InputResiOrderDialog
    v-model:is-dialog-visible="isInputResiOrderDialogVisible"
    v-model:order-id="props.orderId"
    v-model:invoice-no="props.invoiceNo"
    @form-submitted="inputResiOrder"
  />
  <ShipmentOrderSettingsDialog
    v-model:is-dialog-visible="isShipmentOrderSettingsDialogVisible"
    v-model:order-id="props.orderId"
    v-model:shipping-type="props.shippingType"
  />
</template>
