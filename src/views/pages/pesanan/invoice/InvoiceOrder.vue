<script setup>
import iconFileBox from '@images/icons/ic-file-box.png'
import logoMarketPlace from '@images/misc/logo-marketplace.png'
import logoLunas from '@images/misc/cap-lunas.png'

const route = useRoute('pesanan-view-id')
const orderData = ref()
var subTotalProduct = 0

const { data: orderDetails } = await useApiCore(`/seller/query/transaction/detail/${ route.params.id }`)
if (orderDetails.value.status == 200) {
  orderData.value = orderDetails.value.data
	orderData.value.detail.forEach((x, i) => subTotalProduct += x.total_price);
}

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
					<div class="invoice-header-preview pa-6 mb-6">
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
										<span class="text-body-1 font-weight-bold text-high-emphasis">{{ toLocaleDateTime(orderData.order_date) }}</span>
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
									<p class="text-body-1 font-weight-regular mb-0">
										{{ orderData.merchant.address }}
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
										{{ orderData.buyer.full_name }} ( {{ orderData.buyer.phone }} )
									</h6>
									<p class="text-body-1 font-weight-regular mb-0">
										{{ orderData.delivery.address }}
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
									{{ toCurrency(item.total_price) }}
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
									{{ orderData.delivery.delivery_method }}
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
					<div class="d-flex justify-center bg-lightblue py-2 px-6 mb-6">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Subtotal Ongkos Kirim
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								{{ toCurrency(orderData.delivery.delivery_fee) }}
							</p>
						</div>
					</div>

					<!-- 👉 promo Table -->
					<VTable class="invoice-preview-table text-high-emphasis overflow-hidden mb-2">
						<thead>
							<tr>
								<th scope="col">
									Promo
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
									Potongan Promo
								</td>
								<td class="text-end">
									Rp.0
								</td>
							</tr>
						</tbody>
					</VTable>
					<div class="d-flex justify-center bg-pink py-2 px-6 mb-6">
						<div class="me-auto">
							<p class="font-weight-medium mb-0">
								Subtotal Promo
							</p>
						</div>

						<div class="ms-auto text-end">
							<p class="font-weight-medium mb-0">
								Rp.0
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
