<script setup>
const route = useRoute('pesanan-view-id')

const { data: orderDetails, execute: fetchOrder, isFinished: loading } = await useApiCore(`/seller/query/transaction/detail/${ route.params.id }`)

const orderData = computed(() => orderDetails.value?.data)
const subTotalProduct = computed(() => {
  let _subTotal = 0;
  orderDetails.value?.data?.detail.forEach((x, i) => _subTotal += x.total_amount);
  return _subTotal;
})

const callbackOrderStatusButton = async () => {
  fetchOrder()
}

</script>

<template>
  <div>
    <OrderLoadingDialog
      :is-dialog-visible="!loading"
      :is-progress-linear="true"
      message-text="Memuat pesanan..."
    />
    <!-- 👉 Header  -->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-4">
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
        <!-- place component here ... -->
        <OrderStatusButton
          v-model:order-id="orderData.id"
          v-model:invoice-no="orderData.trx_no"
          v-model:status-code="orderData.progress_active.status_code"
          v-model:delivery-setting="orderData.delivery.delivery_setting"
          v-model:shipping-type="orderData.delivery.shipping_type"
          :display-detail="false"
          @callback-button="callbackOrderStatusButton"
        />
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
									{{ toCurrency(item.total_amount) }}
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
								<p v-html="resolveCompleteAddress(orderData.delivery)" class="text-body-1 mb-0" style="max-width:300px;">
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
								<span v-if="orderData.delivery.awb_number">{{ orderData.delivery.awb_number }}</span>
								<span v-else>-</span>
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
								{{ toCurrency(subTotalProduct) }}
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
  </div>
</template>
