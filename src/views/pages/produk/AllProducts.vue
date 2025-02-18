<script setup>
import { useMessageStore } from '@core/stores/config'

const props = defineProps({
  selectedStatus: {
    type: String,
  },
})

const messageStore = useMessageStore()

const searchQuery = ref('')
const isUpdateHargaDialogVisible = ref(false)
const isUpdateStockDialogVisible = ref(false)
const isUpdateStatusDialogVisible = ref(false)
const isDeleteProductDialogVisible = ref(false)
const productId = ref(0)
const productName = ref('')
const productPrice = ref(0)
const productStock = ref(0)
const productStatus = ref()

// Data table options
const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)
const sortBy = ref('')

const searchTrigger = computed(() => {
	if (searchQuery.value.length > 3) {
		 return searchQuery.value
	}
})

const {
  data: productsData,
  execute: fetchProducts, isFinished: loading,
} = await useApiCore(createUrl('/seller/query/product/merchant', {
  query: {
    keyword: searchTrigger,
    "filter[status]": props.selectedStatus,
    page,
    limit: itemsPerPage,
    sortby: sortBy,
  },
}))

const products = computed(() => productsData.value.data.data)
const totalProduct = computed(() => productsData.value.data.total)

const updateHargaProduct = async (id, price) => {
  try {
  	const res = await $apiCore(`/seller/command/product/price/edit/${id}`, {
  		method: 'POST',
  		body: { price: price },
      onResponseError({ response }) {
        throw response.message
      },
  	})

  	// Refetch products
  	fetchProducts()
    messageStore.setMessage('success', 'Harga berhasil diubah')
  } catch (error) {
		messageStore.setMessage('error', 'Gagal mengubah harga produk')
		console.error("Error on update product data:", error)
  }
}

const updateStockProduct = async (id, stock) => {
  try {
  	const res = await $apiCore(`/seller/command/product/stock/edit/${id}`, {
  		method: 'POST',
  		body: { amount: parseInt(stock) },
      onResponseError({ response }) {
        throw response.message
      },
  	})

  	// Refetch products
  	fetchProducts()
    messageStore.setMessage('success', 'Stock berhasil diubah')
  } catch (error) {
  		messageStore.setMessage('error', 'Gagal mengubah stock produk')
  		console.error("Error on update product data:", error)
  }
}

const updateStatusProduct = async (id, status) => {
  try {
  	const res = await $apiCore(`/seller/command/product/archived/${id}`, { method: 'POST' })

  	// Refetch products
  	fetchProducts()
    messageStore.setMessage('success', 'Berhasil ubah status produk')
  } catch (error) {
  		messageStore.setMessage('error', 'Gagal ubah status produk')
  		console.error("Error on update product data:", error)
  }
}

const deleteProduct = async id => {
  try {
  	const res = await $apiCore(`/seller/command/product/delete/${id}?accept=true`, { method: 'DELETE' })

  	// Refetch products
  	fetchProducts()
  	messageStore.setMessage('success', res.message)
  } catch (error) {
  		messageStore.setMessage('error', 'Gagal menghapus produk')
  		console.error("Error on delete product data:", error)
  }
}

const editPrice = (id, name, price) => {
  productId.value = id
  productName.value = name
  productPrice.value = parseInt(price)
  isUpdateHargaDialogVisible.value = true
}

const editStock = (id, name, stock) => {
  productId.value = id
  productName.value = name
  productStock.value = stock
  isUpdateStockDialogVisible.value = true
}

const editStatus = (id, name, status) => {
  productId.value = id
  productName.value = name
  productStatus.value = status
  isUpdateStatusDialogVisible.value = true
}

const deleteItem = (id, name) => {
  productId.value = id
  productName.value = name
  isDeleteProductDialogVisible.value = true
}

</script>

<template>
  <div>
    <!-- 👉 products -->
    <VCard>
			<VCardText>
				<div class="d-flex flex-wrap gap-4 my-6">
					<div class="d-flex align-center">
						<!-- 👉 Search	-->
						<AppTextField
							v-model="searchQuery"
							placeholder="Cari Produk"
							style="inline-size: 200px;"
							class="me-3"
							/>
					</div>

					<VSpacer />
					<div class="d-flex gap-4 flex-wrap align-center">
						<AppSelect
							v-model="itemsPerPage"
							:items="[5, 10, 20, 25, 50]"
							/>
						<AppSelect
							v-model="sortBy"
							:items="sortOptions"
							item-title="title"
							item-value="value"
							/>
					</div>
				</div>

				<VDivider class="mt-4" />

				<!-- 👉 Datatable	-->
				<VDataTableServer
					v-if="products && totalProduct > 0"
					v-model:items-per-page="itemsPerPage"
					v-model:page="page"
					:headers="productHeaders"
					:items="products"
					:items-length="totalProduct"
					:loading="!loading"
					class="text-no-wrap"
					>
					<!-- Gambar	-->
					<template #item.image="{ item }">
						<VAvatar
							v-if="item.product_photo[0]"
							size="50"
							variant="tonal"
							class="my-2"
							rounded
							:image="item.product_photo[0].url"
							/>
					</template>

					<!-- Judul -->
					<template #item.name="{ item }">
						<RouterLink :to="{ name: 'produk-view-id', params: { id: item.id } }">
							{{ item.name }}
						</RouterLink>
					</template>

					<!-- Harga -->
					<template #item.price="{ item }">
						<div class="d-flex flex-column">
							<span class="text-body-1 text-high-emphasis">{{ toCurrency(item.price) }}</span>
							<div v-if="item.strike_price && item.price < item.strike_price">
								<span class="text-body-2 text-decoration-line-through me-1">{{ toCurrency(item.strike_price) }}</span>
								<VChip
									:label="false"
									size="x-small"
									color="error"
									>
									{{ calculateDiscount(item.price, item.strike_price) }}
								</VChip>
							</div>
						</div>
					</template>

					<!-- Stock -->
					<template #item.stock="{ item }">
						<span class="text-body-1 text-high-emphasis">{{ item.product_stock[0].amount }}</span>
					</template>

					<!-- status -->
					<template #item.status="{ item }">
						<VChip
							v-bind="resolveStatus(item.status)"
							density="default"
							label
							size="small"
							/>
					</template>

					<!-- Actions -->
					<template #item.actions="{ item }">
						<div class="text-center">
							<VBtn
								size="small"
								variant="outlined"
								color="secondary"
								>
								Atur
								<VIcon
									end
									icon="tabler-chevron-down"
									/>
								<VMenu activator="parent">
									<VList>
										<VListItem value="edit">
											<RouterLink
												style="color:inherit"
												:to="{ name: 'produk-edit-id', params: { id: item.id } }"
												>
												Edit Produk
											</RouterLink>
										</VListItem>
										<VListItem value="view">
											<RouterLink
												style="color:inherit"
												:to="{ name: 'produk-view-id', params: { id: item.id } }"
												>
												Lihat Produk
											</RouterLink>
										</VListItem>
										<VListItem
											value="edit_price"
											@click="editPrice(item.id, item.name, item.price)"
											>
											Ubah Harga
										</VListItem>
										<VListItem
											value="edit_stock"
											@click="editStock(item.id, item.name, item.product_stock[0].amount)"
											>
											Ubah Stock
										</VListItem>
										<VListItem
											v-if="item.status == 1"
											value="archive"
											@click="editStatus(item.id, item.name, 9)"
											>
											Arsipkan Produk
										</VListItem>
										<VListItem
											v-if="item.status == 9"
											value="archive"
											@click="editStatus(item.id, item.name, 1)"
											>
											Jual Produk
										</VListItem>
										<VListItem
											value="delete"
											@click="deleteItem(item.id, item.name)"
											>
											Hapus Produk
										</VListItem>
									</VList>
								</VMenu>
							</VBtn>
						</div>
					</template>

					<!-- pagination -->
					<template #bottom>
						<TablePagination
							v-model:page="page"
							:items-per-page="itemsPerPage"
							:total-items="totalProduct"
							/>
					</template>
				</VDataTableServer>

				<!-- 👉 Empty products -->
				<template v-else>
					<EmptyData
						:border="false"
						description="Anda sekarang belum memiliki produk yang di unggah.<br/>Silahkan unggah produk anda untuk bisa dijual."
						btn-text="Tambah Produk"
						@click-button="() => $router.push('/produk/tambah')"
						/>
				</template>
			</VCardText>
    </VCard>
    <UpdateHargaDialog
      v-model:is-dialog-visible="isUpdateHargaDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      v-model:product-price="productPrice"
      @form-submitted="updateHargaProduct"
    />
    <UpdateStockDialog
      v-model:is-dialog-visible="isUpdateStockDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      v-model:product-stock="productStock"
      @form-submitted="updateStockProduct"
    />
    <UpdateStatusDialog
      v-model:is-dialog-visible="isUpdateStatusDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      v-model:product-status="productStatus"
      @form-submitted="updateStatusProduct"
    />
    <DeleteProductDialog
      v-model:is-dialog-visible="isDeleteProductDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      @form-submitted="deleteProduct"
    />
  </div>
</template>
