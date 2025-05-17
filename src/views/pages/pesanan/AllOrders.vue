<script setup>
import { useMessageStore } from '@core/stores/config'
import iconFileBox from '@images/icons/ic-file-box.png'

const props = defineProps({
  selectedStatus: {
    type: String,
  },
})

var successUpload = []
var dataUpload = []

const messageStore = useMessageStore()
const isLoadingVisible = ref(false)
const isAcceptOrderDialogVisible = ref(false)

const viewMore = ref(false)
const dateRange = ref('')
const searchQuery = ref('')
const searchKeyword = ref('')

// Data table options
const selected = ref([])
const invoicesNo = ref([])
const itemsPerPage = 10
const page = ref(1)
const startDate = ref('')
const endDate = ref('')

const {
  data: ordersData,
  execute: fetchOrders, isFinished: loading,
} = await useApiCore(createUrl('/seller/query/transaction/search', {
  query: {
    keyword: searchKeyword,
    "filter[status]": props.selectedStatus,
    "filter[start_date]": startDate,
    "filter[end_date]": endDate,
    page,
  },
}))

const {
  data: totalData,
  execute: fetchTotalOrders
} = await useApiCore(createUrl('/seller/query/transaction/search/count', {
  query: {
    keyword: searchKeyword,
    "filter[status]": props.selectedStatus,
    "filter[start_date]": startDate,
    "filter[end_date]": endDate,
    page,
  },
}))

const orders = computed(() => ordersData.value.data.data)
const totalOrder = computed(() => totalData.value.data)

const callbackOrderStatusButton = () => {
  fetchOrders()
  fetchTotalOrders()
}

const checkAcceptOrder = (id, status) => {
	if(status){
		successUpload.push(id)
    let index = dataUpload.indexOf(id);
    if (index > -1) {
      dataUpload.splice(index, 1);
    }
	}
	if(dataUpload.length === 0){
    isLoadingVisible.value = false
    callbackOrderStatusButton()

		if(successUpload.length > 0) {
			messageStore.setMessage('success', `Berhasil terima ${successUpload.length} pesanan`)
		} else {
			messageStore.setMessage('error', 'Gagal terima pesanan, Harap periksa kembali data Order ID')
		}
		successUpload = []
	} else {
    acceptOrder(dataUpload[0])
	}
}

const acceptOrder = async (id) => {
  try {
		await $apiCore('/seller/command/order/accept/', {
  		method: 'POST',
  		body: { id: [id] },
		})

    await nextTick(() => {
			checkAcceptOrder(id, true)
		})
  } catch (error) {
    console.error("Error on accept order data:", error)
    checkAcceptOrder(id, true)
  }
}

const acceptMultipleOrder = async (orderIds) => {
  isLoadingVisible.value = true
	successUpload = []
  dataUpload = orderIds
  if(dataUpload.length > 0){
    acceptOrder(dataUpload[0])
	} else {
    isLoadingVisible.value = false
    messageStore.setMessage('error', 'Data Order ID Kosong')
	}
}

const bulkApproval = () => {
  invoicesNo.value = orders.value.filter((o) => selected.value.includes(o.id)).map(d => d.trx_no)
  isAcceptOrderDialogVisible.value = true
}

const checkViewMoreLess = (index) => {
  if(viewMore.value === false){
    return index <= 2
  } else {
    return true
  }
}

const searchInvoiceNo = () => {
	if (searchQuery.value.length > 3 || searchQuery.value.length === 0) {
		searchKeyword.value = searchQuery.value
    page.value = 1
    fetchOrders()
	}
}

const clearSearchInvoiceNo = () => {
	if (searchKeyword.value.length > 0) {
		searchKeyword.value = ''
    page.value = 1
    fetchOrders()
	}
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
				<div class="d-flex flex-wrap align-center gap-4 mb-6">
					<div class="d-flex align-center">
						<!-- 👉 Search	-->
						<AppTextField
							v-model="searchQuery"
							placeholder="Cari berdasarkan invoice"
              clearable
              clear-icon="tabler-circle-x"
							append-inner-icon="tabler-search"
							style="inline-size: 400px;"
							class="me-3"
              :disabled="!loading"
              @click:clear="clearSearchInvoiceNo"
              @click:append-inner="searchInvoiceNo"
              @keydown.enter.prevent="searchInvoiceNo"
							/>
            <AppDateTimePicker
              v-model="dateRange"
              placeholder="Pilih Tanggal"
              style="inline-size: 200px;"
              :disabled="!loading"
              :config="{ mode: 'range' }"
            />
					</div>
					<VSpacer />
          <VBtn
						v-if="props.selectedStatus === '01'"
            :disabled="selected.length === 0"
            size="small"
            @click="bulkApproval"
            >
            <VIcon
              start
              icon="tabler-checkbox"
            />
            Terima Semua Pesanan
          </VBtn>
				</div>
        <VProgressLinear
          v-if="!loading"
          height="3"
          color="secondary"
          :rounded="false"
          indeterminate
        />
				<div
					v-if="orders && totalOrder > 0"
					class="data-orders-table border rounded">
					<!-- 👉 Datatable	-->
					<VDataTableServer
            v-model="selected"
						v-model:items-per-page="itemsPerPage"
						v-model:page="page"
						:headers="orderHeaders"
						:items="orders"
						:items-length="totalOrder"
            item-value="id"
						:loading="!loading"
						:expanded="[orders[0].id]"
						:show-select="props.selectedStatus === '01'"
						expand-on-click
						>
						<!-- Template	-->

						<!-- Expanded Row Data -->
						<template #expanded-row="slotProps">
							<tr class="v-data-table__tr bg-white">
								<td :colspan="props.selectedStatus === '01' ? 6 : 5">
									<VRow class="ma-4">
										<VCol
											cols="12"
											md="6"
											class="ps-8 py-0"
											>
											<template v-for="(order_item, index) in slotProps.item.detail">
                        <div
                          v-if="checkViewMoreLess(index)"
                          class="d-flex align-center gap-x-4 mb-2">
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
                      <template v-if="slotProps.item.detail.length > 3">
                        <VBtn
                          v-if="viewMore === false"
                          variant="plain"
                          class="px-0"
                          @click="viewMore =! viewMore"
                          >
                          <small>View more...</small>
                        </VBtn>
                        <VBtn
                          v-else
                          variant="plain"
                          class="px-0"
                          @click="viewMore =! viewMore"
                          >
                          <small>View less...</small>
                        </VBtn>
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
													<p v-html="slotProps.item.delivery.address" class="text-body-2 mb-0">
													</p>
												</VCol>
												<VCol
													cols="12"
													md="6"
													class="d-flex flex-column justify-start"
													>
													<span class="text-body-2 font-weight-bold mb-2">Kurir:</span>
                          <VChip
                            color="success"
                            class="font-weight-medium mb-2"
                            size="small"
                            style="width:fit-content"
                            >
                            {{ resolveShippingTypeText(slotProps.item.delivery.shipping_type) }}
                          </VChip>
                          <VChip
                            :color="resolveDeliverySettingLabel(slotProps.item.delivery.delivery_setting).color"
                            class="font-weight-medium mb-2"
                            size="small"
                            style="width:fit-content"
                            >
                            {{ resolveDeliverySettingLabel(slotProps.item.delivery.delivery_setting).text }}
                          </VChip>
												</VCol>
											</VRow>
										</VCol>
									</VRow>
								</td>
							</tr>
							<tr class="v-data-table__tr">
								<td :colspan="props.selectedStatus === '01' ? 6 : 5">
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
                        v-model:is-pickup="slotProps.item.delivery.is_pickup"
                        v-model:is-drop-point="slotProps.item.delivery.is_drop_point"
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
              <div class="d-flex flex-wrap align-center">
                <VIcon
                  start
                  icon="tabler-user"
                  class="mb-1"
                  />
                <div class="d-flex flex-column">
                  <span class="text-body-2 font-weight-medium">
                    {{ item.buyer.full_name }}
                  </span>
                  <a class="text-body-2 font-weight-medium" target="_blank" :href="`https://api.whatsapp.com/send?phone=${item.buyer.phone}`">
                    {{ item.buyer.phone }}
                  </a>
                </div>
              </div>
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
  <AcceptOrderDialog
    v-model:is-dialog-visible="isAcceptOrderDialogVisible"
    v-model:array-order-id="selected"
    v-model:array-invoice-no="invoicesNo"
    @form-submitted="acceptMultipleOrder"
    />
  <OrderLoadingDialog
    v-model:is-dialog-visible="isLoadingVisible"
    :is-progress-linear="true"
    message-text="Pesanan di proses, harap tunggu..."
  />
</template>

<style scoped>
:deep(.data-orders-table) > .v-table .v-table__wrapper > table > tbody tr {
  background-color: rgba(0, 0, 0, .03);
}
:deep(.data-orders-table) > .v-table .v-table__wrapper > table > thead {
	display: none;
}
</style>
