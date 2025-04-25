<script setup>
import iconFileBox from '@images/icons/ic-file-box.png'
import logoMarketPlace from '@images/misc/logo-marketplace.png'
import logoLunas from '@images/misc/cap-lunas.png'

const route = useRoute('pesanan-view-id')

const { data: orderDetails } = await useApiCore(`/seller/query/transaction/detail/${ route.params.id }`)

const orderData = computed(() => orderDetails.value?.data)

const subTotalProduct = computed(() => {
  let _subTotal = 0;
  orderDetails.value?.data?.detail.forEach((x, i) => _subTotal += parseInt(x.total_amount));
  return _subTotal;
})

const subTotalDelivery = computed(() => {
  let _subTotal = 0;
  if(orderDetails.value?.data) {
    let delivery = orderDetails.value?.data.delivery;
    _subTotal = parseInt(delivery.delivery_fee);
    if(!isEmpty(delivery.insurance_fee)){
      _subTotal += parseInt(delivery.insurance_fee);
    }
  }
  return _subTotal;
})
</script>

<template>
  <div>
		<VRow v-if="orderData">
			<VCol cols="12">
				<VCard
					class="invoice-preview-wrapper py-3 px-4 mark-background"
					:style="{ backgroundImage: 'url(' + logoLunas + ')' }"
					>
					<!-- SECTION Header -->
					<div class="invoice-header-preview pa-6 mb-0">
						<div class="d-flex flex-wrap justify-space-between gap-6">
							<!-- 👉 Left Content -->
							<div>
								<div class="d-flex align-center gap-x-4 mb-6">
									<VImg
										:width="100"
										:src="logoMarketPlace"
										class="rounded"
										/>
									<div class="d-flex flex-column">
										<span class="text-body-2 font-weight-regular text-high-emphasis">Diterbitkan pada</span>
										<span class="text-body-1 font-weight-bold text-high-emphasis">{{ toLocaleDateTime(orderData.created_at) }}</span>
									</div>
								</div>
							</div>

							<!-- 👉 Right Content -->
							<div>
								<div class="d-flex flex-column justify-center align-start">
									<span class="text-body-1 font-weight-bold text-high-emphasis">
										Invoice No:
									</span>
									<!-- 👉 Invoice ID -->
									<span class="text-body-2 font-weight-regular">
										{{ orderData.trx_no }}
									</span>
								</div>
							</div>
						</div>
						<div class="d-flex flex-row justify-space-between gap-6">
							<div>
								<div class="d-flex flex-column align-start gap-x-4">
									<!-- 👉 Address -->
									<span class="text-body-1 font-weight-regular">
										Oleh
									</span>
									<h6 class="text-h6 font-weight-body">
										{{ orderData.merchant.name }} ( {{ orderData.merchant.phone_office }} )
									</h6>
									<p v-html="resolveCompleteAddress(orderData.merchant)" class="text-body-1 font-weight-regular mb-0">
									</p>
								</div>
							</div>
							<div>
								<div class="d-flex flex-column align-end gap-x-4">
									<!-- 👉 Address -->
									<span class="text-body-1 font-weight-regular">
										Kepada
									</span>
									<h6 class="text-h6 font-weight-body">
										{{ orderData.delivery.receiver_name }} ( {{ orderData.delivery.receiver_phone }} )
									</h6>
									<p v-html="resolveCompleteAddress(orderData.delivery)" class="text-body-1 font-weight-regular mb-0 text-end">
									</p>
								</div>
							</div>
						</div>
					</div>
					<!-- !SECTION -->

					<!-- 👉 order products Table -->
					<VTable class="invoice-preview-table text-high-emphasis overflow-hidden mb-2">
						<thead>
							<tr>
								<th scope="col">
									Nama Produk
								</th>
								<th
									scope="col"
									class="text-center"
									>
									Jumlah
								</th>
								<th
									scope="col"
									class="text-center"
									>
									Berat
								</th>
								<th
									scope="col"
									class="text-center"
									>
									Harga
								</th>
								<th
									scope="col"
									class="text-end"
									>
									Subtotal
								</th>
							</tr>
						</thead>
						<tbody class="text-base">
							<tr
								v-for="item in orderData.detail"
								:key="item.id"
								>
								<td class="text-wrap" style="max-width:300px">
									<span class="d-block text-primary my-2">
										{{ item.product.name }}
									</span>
								</td>
								<td class="text-center">
									{{ item.quantity }}
								</td>
								<td class="text-center">
									{{ item.total_weight }} gr
								</td>
								<td class="text-center">
									{{ toCurrency(item.price) }}
								</td>
								<td class="text-end">
									{{ toCurrency(item.total_amount) }}
								</td>
							</tr>
						</tbody>
					</VTable>
					<div class="d-flex justify-center bg-lightblue py-2 px-6 mb-6">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Subtotal Harga Produk
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								{{ toCurrency(subTotalProduct) }}
							</p>
						</div>
					</div>

					<!-- 👉 kurir Table -->
					<VTable class="invoice-preview-table text-high-emphasis overflow-hidden mb-2">
						<thead>
							<tr>
								<th scope="col">
									Layanan Kurir
								</th>
								<th
									scope="col"
									class="text-center"
									>
									Berat
								</th>
								<th
									scope="col"
									class="text-end"
									>
									Subtotal
								</th>
							</tr>
						</thead>
						<tbody class="text-base">
							<tr>
								<td class="text-no-wrap">
									{{ resolveShippingTypeText(orderData.delivery.shipping_type) }}
								</td>
								<td class="text-center">
									{{ orderData.total_weight }} gr
								</td>
								<td class="text-end">
									{{ toCurrency(orderData.delivery.delivery_fee) }}
								</td>
							</tr>
						</tbody>
					</VTable>
          <div v-if="!isEmpty(orderData.delivery.insurance_fee)"
            class="d-flex justify-center py-2 px-6 mb-4">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Insurance Fee
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								{{ toCurrency(orderData.delivery.insurance_fee) }}
							</p>
						</div>
					</div>
					<div class="d-flex justify-center bg-lightblue py-2 px-6 mb-6">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Subtotal Ongkos Kirim
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								{{ toCurrency(subTotalDelivery) }}
							</p>
						</div>
					</div>

					<div class="d-flex justify-center py-2 px-6 mb-6">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Total Bayar
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								{{ toCurrency(orderData.payment.payment_amount) }}
							</p>
						</div>
					</div>

				</VCard>
			</VCol>
		</VRow>
		<!-- 👉 Empty Data -->
    <VCard v-else>
			<EmptyData
				:orientation="1"
				:border="false"
				:img-src="iconFileBox"
				title="Invoice tidak ditemukan"
				description="Maaf invoice yang anda cari tidak ditemukan.<br/>Silahkan coba beberapa saat lagi."
				btn-text="Kelola Pesanan"
				@click-button="() => $router.push('/pesanan/semua')"
				/>
    </VCard>
  </div>
</template>

<style scoped>
.v-table {
	background: none;
}
.v-table table tbody tr td:first-child,
.v-table table thead tr th:first-child {
	padding-inline-start: 24px !important;
}
.v-table table tbody tr td:last-child,
.v-table table thead tr th:last-child {
	padding-inline-end: 24px !important;
}
.mark-background {
  position: relative !important;
  background-size: contain !important;
  background-position: center !important;
  overflow: hidden !important;
  background-repeat: no-repeat !important;
}
.bg-lightblue {
  background-color: rgba(211,238,242,.5) !important;
}
.bg-pink {
  background-color: rgba(247,225,229,.5) !important;
}
.font-weight-medium {
	color: #4b4b4b;
}
</style>
