<script setup>
import iconFileBox from '@images/icons/ic-file-box.png'

const props = defineProps({
  selectedStatus: {
    type: String,
  },
})

const dateRange = ref('')
const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const startDate = ref('')
const endDate = ref('')

const searchTrigger = computed(() => {
	if (searchQuery.value.length > 3) {
		 return searchQuery.value
	}
})

const {
  data: ordersData,
  execute: fetchOrders, isFinished: loading,
} = await useApiCore(createUrl('/seller/query/transaction', {
  query: {
    keyword: searchTrigger,
    "filter[status]": props.selectedStatus,
    "filter[start_date]": startDate,
    "filter[end_date]": endDate,
    page,
    limit: itemsPerPage,
  },
}))

const orders = computed(() => ordersData.value.data.data)
const totalOrder = computed(() => ordersData.value.data.total)

const callbackOrderStatusButton = () => {
  fetchOrders()
}

watch(dateRange, (newVal, oldVal) => {
  if (newVal !== null && newVal !== oldVal) {
		var arr = newVal.split(' to ')
		startDate.value = arr[0]
		endDate.value = arr[0]
		if(arr.length > 1){
			endDate.value = arr[1]
		}
  } else {
    startDate.value = ''
    endDate.value = ''
  }
  fetchOrders()
})
</script>

<template>
  <div>
    <!-- 👉 orders -->
    <VCard>
			<VCardText>
				<div class="d-flex flex-wrap gap-4 mb-6">
					<div class="d-flex align-center">
						<!-- 👉 Search	-->
						<AppTextField
							v-model="searchQuery"
							placeholder="Cari berdasarkan invoice"
							append-inner-icon="tabler-search"
							style="inline-size: 400px;"
							class="me-3"
							/>
					</div>

					<VSpacer />
					<div class="d-flex gap-4 flex-wrap align-center">
						<AppSelect
							v-model="itemsPerPage"
							:items="[5, 10, 20, 25, 50]"
							/>
						<AppDateTimePicker
							v-model="dateRange"
							placeholder="Pilih Tanggal"
							style="inline-size: 200px;"
							:config="{ mode: 'range' }"
						/>
					</div>
				</div>

				<div
					v-if="orders && totalOrder > 0"
					class="data-orders-table border rounded">
					<!-- 👉 Datatable	-->
					<VDataTableServer
						v-model:items-per-page="itemsPerPage"
						v-model:page="page"
						:headers="orderHeaders"
						:items="orders"
						:items-length="totalOrder"
						:loading="!loading"
						:expanded="[orders[0].id]"
						expand-on-click
						>
						<!-- Template	-->

						<!-- Expanded Row Data -->
						<template #expanded-row="slotProps">
							<tr class="v-data-table__tr bg-white">
								<td :colspan="orderHeaders.length">
									<VRow class="ma-4">
										<VCol
											cols="12"
											md="6"
											class="ps-8 py-0"
											>
											<template v-for="order_item in slotProps.item.detail">
												<div class="d-flex align-center gap-x-4 mb-2">
													<VAvatar
														v-if="order_item.product_main_photo"
														size="50"
														variant="tonal"
														rounded
														:image="order_item.product_main_photo"
														/>
													<div class="d-flex flex-column">
														<span class="text-body-2 font-weight-medium text-high-emphasis">{{ order_item.product.name }}</span>
														<span class="text-body-2">{{ order_item.quantity }} x {{ toCurrency(order_item.price) }}</span>
													</div>
												</div>
											</template>
										</VCol>
										<VCol
											cols="12"
											md="6"
											class="py-0"
											>
											<VRow>
												<VCol
													cols="12"
													md="6"
													class="d-flex flex-column justify-start"
													>
													<span class="text-body-2 font-weight-bold">Alamat:</span>
													<p class="text-body-2 mt-1 mb-0">
														<strong>{{ slotProps.item.delivery.receiver_name }}</strong> ({{ slotProps.item.delivery.receiver_phone }})
													</p>
													<p class="text-body-2 mb-0">
														{{ slotProps.item.delivery.address }}
													</p>
												</VCol>
												<VCol
													cols="12"
													md="6"
													class="d-flex flex-column justify-start"
													>
													<span class="text-body-2 font-weight-bold">Kurir:</span>
													<p class="text-body-2 my-1">
														{{ slotProps.item.delivery.courier }}
													</p>
												</VCol>
											</VRow>
										</VCol>
									</VRow>
								</td>
							</tr>
							<tr class="v-data-table__tr">
								<td :colspan="orderHeaders.length">
									<VRow class="mx-4 my-2">
										<VCol
											cols="12"
											md="6"
											class="py-0"
											>
											<div class="d-flex flex-column justify-start ps-6">
												<span class="text-body-2 text-high-emphasis">Total Harga ( {{ slotProps.item.detail.length }} produk )</span>
												<p class="text-body-1 font-weight-bold my-1">
													{{ toCurrency(slotProps.item.total_amount) }}
												</p>
											</div>
										</VCol>
										<VCol
											cols="12"
											md="6"
											class="px-0"
											>
                      <!-- place component here ... -->
                      <OrderStatusButton
                        v-model:order-id="slotProps.item.id"
                        v-model:invoice-no="slotProps.item.trx_no"
                        v-model:status-code="slotProps.item.progress_active.status_code"
                        v-model:delivery-setting="slotProps.item.delivery.delivery_setting"
                        v-model:shipping-type="slotProps.item.delivery.shipping_type"
                        size="small"
                        @callback-button="callbackOrderStatusButton"
                      />
										</VCol>
									</VRow>
								</td>
							</tr>
						</template>

						<!-- Invoice NO -->
						<template #item.invoice_no="{ item }">
							<div class="d-flex align-center">
								<div class="d-flex flex-column my-3">
									<VChip
										:color="resolveStatusOrder(item.progress_active.status_code).color"
										class="font-weight-medium mb-2"
										size="small"
										style="width:fit-content"
										>
										{{ resolveStatusOrder(item.progress_active.status_code).text }}
									</VChip>
									<RouterLink :to="{ name: 'pesanan-view-id', params: { id: item.id } }">
										<small class="font-weight-bold">{{ item.trx_no }}</small>
									</RouterLink>
								</div>
							</div>
						</template>

						<!-- Order Date -->
						<template #item.order_date="{ item }">
							<span class="text-body-2 font-weight-medium">
								{{ toLocaleDateTime(item.order_date) }}
							</span>
						</template>

						<!-- Nama Pelanggan -->
						<template #item.nama_pelanggan="{ item }">
							<VIcon
								start
								icon="tabler-user"
								class="mb-1"
							/>
							<span class="text-body-2 font-weight-medium">
								{{ item.buyer.full_name }}
							</span>
						</template>

						<!-- Respond Date -->
						<template #item.respond_date="{ item }">
							<VChip
								v-if="item.progress_active.status_code == '09'"
								color="secondary"
								class="mx-2">
								<VIcon
									start
									icon="tabler-cancel"
								/>
								Transaksi Dibatalkan
							</VChip>
						</template>

						<!-- pagination -->
						<template #bottom>
							<TablePagination
								v-model:page="page"
								:items-per-page="itemsPerPage"
								:total-items="totalOrder"
								/>
						</template>
					</VDataTableServer>
				</div>

				<!-- 👉 Empty orders -->
				<template v-else>
					<EmptyData
						:orientation="1"
						:img-src="iconFileBox"
						:border="true"
						wrapper-class="pa-8 ma-0"
						title="Pesanan Tidak Tersedia"
						description="Anda sekarang belum memiliki pesanan.<br/>Silahkan tingkatkan penjualan anda."
						/>
				</template>
			</VCardText>
    </VCard>
  </div>
</template>

<style scoped>
:deep(.data-orders-table) > .v-table .v-table__wrapper > table > tbody tr {
  background-color: rgba(0, 0, 0, .03);
}
:deep(.data-orders-table) > .v-table .v-table__wrapper > table > thead {
	display: none;
}
</style>
