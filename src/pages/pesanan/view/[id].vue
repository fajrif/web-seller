<script setup>
import { useMessageStore } from '@core/stores/config'

const route = useRoute('pesanan-view-id')
const orderData = ref()

const isAcceptOrderDialogVisible = ref(false)
const isCancelOrderDialogVisible = ref(false)
const isInputResiOrderDialogVisible = ref(false)
const orderId = ref(0)
const orderInvoice = ref('')

const { data: orderDetails, execute: fetchOrder, isFinished: loading } = await useApiCore(`/seller/query/transaction/detail/${ route.params.id }`)
if (orderDetails.value.status == 200) {
  orderData.value = orderDetails.value.data
}

const acceptOrder = async (id) => {
  try {
		const res = await $apiCore('/seller/command/order/accept/', {
  		method: 'POST',
  		body: { id: [id] },
		})
  	// Refetch orders
  	fetchOrder()
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
  	// Refetch orders
  	fetchOrder()
  	messageStore.setMessage('success', res.message)
  } catch (error) {
		messageStore.setMessage('error', 'Gagal membatalkan pesanan')
		console.error("Error on cancel order data:", error)
  }
}

const shipmentOrder = async (id, resi) => {
	console(id)
	console(resi)
}

const acceptOrderItem = (id, invoiceNo) => {
  orderId.value = id
  orderInvoice.value = invoiceNo
  isAcceptOrderDialogVisible.value = true
}

const cancelOrderItem = (id, invoiceNo) => {
  orderId.value = id
  orderInvoice.value = invoiceNo
  isCancelOrderDialogVisible.value = true
}

const inputResiOrderItem = (id, invoiceNo) => {
  orderId.value = id
  orderInvoice.value = invoiceNo
  isInputResiOrderDialogVisible.value = true
}
</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">
          Detail Pesanan
        </h4>
        <p
          v-show="orderData"
          class="text-body-1 text-medium-emphasis mb-0"
        >
					Invoice No: {{ orderData.trx_no }}
        </p>
      </div>
			<template v-if="orderData">
				<div v-if="orderData.progress_active.status_code == '01'"
					class="d-flex gap-4"
					>
					<VBtn
						color="error"
						variant="tonal"
						class="me-1"
						@click="cancelOrderItem(orderData.id, orderData.trx_no)"
						>
						Tolak Pesanan
					</VBtn>
					<VBtn
						color="primary"
						@click="acceptOrderItem(orderData.id, orderData.trx_no)"
						>
						Terima Pesanan
					</VBtn>
				</div>
				<div v-if="orderData.progress_active.status_code == '02'"
					class="d-flex gap-4"
					>
					<VBtn
						color="primary"
						@click="inputResiOrderItem(orderData.id, orderData.trx_no)"
						>
						Masukkan Resi
					</VBtn>
				</div>
				<div v-if="orderData.progress_active.status_code == '03'"
					class="d-flex gap-4"
					>
					<VBtn
						color="primary"
						>
						Lacak Pengiriman
					</VBtn>
				</div>
			</template>
    </div>

		<template v-if="orderData">
			<VCard class="mb-4">
				<VCardText>
					<VRow>
						<VCol cols="6">
							<div class="d-flex flex-column gap-y-1">
								<h6 class="text-h6">
									Invoice
								</h6>
								<span class="font-weight-bold">{{ orderData.trx_no }}</span>
								<RouterLink :to="{ name: 'pesanan-invoice-id', params: { id: orderData.id } }">
									<span class="font-weight-medium">Lihat Invoice</span>
								</RouterLink>
							</div>
						</VCol>
						<VCol cols="6" class="text-end">
							<VChip
								:color="resolveStatusOrder(orderData.progress_active.status_code).color"
								>
								{{ resolveStatusOrder(orderData.progress_active.status_code).text }}
							</VChip>
						</VCol>
					</VRow>
					<VRow>
						<VCol cols="6" md="9">
							<div class="d-flex flex-column gap-y-1">
								<h6 class="text-h6">
									Nama Pembeli
								</h6>
								<span class="font-weight-bold">{{ orderData.buyer.full_name }}</span>
								<span>{{ orderData.buyer.phone }}</span>
							</div>
						</VCol>
						<VCol cols="6" md="3">
							<div class="d-flex flex-column gap-y-1">
								<h6 class="text-h6">
									Waktu Transaksi
								</h6>
								<span>{{ toLocaleDateTime(orderData.order_date) }}</span>
							</div>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
			<VCard class="mb-4">
				<VCardItem class="pb-0">
					<VCardTitle>
						<h5 class="text-h5">
							Detail Produk
						</h5>
					</VCardTitle>
				</VCardItem>
				<VCardText>
					<VTable class="text-no-wrap">
						<thead>
							<tr>
								<th>
									Produk
								</th>
								<th class="text-center">
									Harga
								</th>
								<th class="text-center">
									Jumlah
								</th>
								<th class="text-center">
									Berat
								</th>
								<th class="text-center">
									Total
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="item in orderData.detail"
								:key="item.id"
								>
								<td>
									<div class="d-flex align-center gap-x-4 my-2">
										<VAvatar
											v-if="item.product_main_photo"
											size="50"
											variant="tonal"
											rounded
											:image="item.product_main_photo"
											/>
										<div class="d-flex flex-column">
											<span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.product.name }}</span>
										</div>
									</div>
								</td>
								<td class="text-center">
									{{ toCurrency(item.price) }}
								</td>
								<td class="text-center">
									{{ item.quantity }}
								</td>
								<td class="text-center">
									{{ item.total_weight }} gr
								</td>
								<td class="text-center">
									{{ toCurrency(item.total_price) }}
								</td>
							</tr>
						</tbody>
					</VTable>
				</VCardText>
			</VCard>
			<VCard class="mb-4">
				<VCardItem>
					<VCardTitle>
						<h5 class="text-h5">
							Detail Pengiriman
						</h5>
					</VCardTitle>
				</VCardItem>
				<VCardText>
					<VRow>
						<VCol cols="6">
							<div class="d-flex flex-column gap-y-1">
								<h6 class="text-h6">
									Alamat
								</h6>
								<span class="font-weight-bold">{{ orderData.delivery.receiver_name }} ({{ orderData.delivery.receiver_phone }})</span>
								<p class="text-body-1 mb-0" style="max-width:300px;">
									{{ orderData.delivery.address }}
								</p>
							</div>
						</VCol>
						<VCol cols="6">
							<div class="d-flex flex-column gap-y-1">
								<h6 class="text-h6">
									Kurir
								</h6>
								<span class="mb-2">{{ orderData.delivery.delivery_method }}</span>
								<h6 class="text-h6">
									No.Resi
								</h6>
								<span>-</span>
							</div>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
			<VCard class="mb-4">
				<VCardItem>
					<VCardTitle>
						<h5 class="text-h5">
							Detail Pembayaran
						</h5>
					</VCardTitle>
				</VCardItem>
				<VCardText>
					<div class="d-flex justify-center">
						<div class="me-auto">
							<p class="mb-4">
								Metode Pembayaran
							</p>
							<p class="mb-4">
								Total Harga ({{ orderData.detail.length }} Produk)
							</p>
							<p class="mb-4">
								Total Ongkos Kirim
							</p>
							<p class="mb-4">
								MDR
							</p>
							<p class="mb-4">
								PPn
							</p>
							<p class="text-primary fw-700 mb-0">
								Total Pendapatan
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="mb-4">
								{{ orderData.payment.payment_method || '-' }}
							</p>
							<p class="mb-4">
								{{ toCurrency(orderData.total_amount) }}
							</p>
							<p class="mb-4">
								{{ toCurrency(orderData.delivery.delivery_fee) }}
							</p>
							<p class="mb-4">
								{{ toCurrency(orderData.total_mdr) }}
							</p>
							<p class="mb-4">
								{{ toCurrency(orderData.total_ppn) }}
							</p>
							<p class="text-primary fw-700 mb-0">
								{{ toCurrency(orderData.total_amount_iconcash) }}
							</p>
						</div>
					</div>
				</VCardText>
			</VCard>
		</template>
		<!-- 👉 Empty Data -->
		<VCard v-else>
			<EmptyData
				:orientation="1"
				:border="false"
				title="Pesanan tidak ditemukan"
				description="Maaf pesanana yang anda cari tidak ditemukan.<br/>Silahkan coba beberapa saat lagi."
				btn-text="Kelola Pesanan"
				@click-button="() => $router.push('/pesanan/semua')"
				/>
		</VCard>
		<!-- place dialog here -->
    <AcceptOrderDialog
      v-model:is-dialog-visible="isAcceptOrderDialogVisible"
      v-model:order-id="orderId"
      v-model:invoice-no="orderInvoice"
      @form-submitted="acceptOrder"
    />
    <CancelOrderDialog
      v-model:is-dialog-visible="isCancelOrderDialogVisible"
      v-model:order-id="orderId"
      v-model:invoice-no="orderInvoice"
      @form-submitted="cancelOrder"
    />
    <InputResiOrderDialog
      v-model:is-dialog-visible="isInputResiOrderDialogVisible"
      v-model:order-id="orderId"
      v-model:invoice-no="orderInvoice"
      @form-submitted="shipmentOrder"
    />
  </div>
</template>
