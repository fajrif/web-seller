<script setup>
import tikTokShopLogo from '@images/logos/tiktok-shop.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const searchQuery = ref('')
const isUpdateStockDialogVisible = ref(false)
const isDeleteProductDialogVisible = ref(false)
const selectedStatus = ref('')
const productId = ref(0)
const productName = ref('')
const productStock = ref(0)

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
} = await useApiCore(createUrl('/seller/tiktok/products/status', {
  query: {
    keyword: searchTrigger,
    "sync_status": selectedStatus,
    page,
    limit: itemsPerPage,
  },
}))

const products = computed(() => productsData.value.data.data)
const totalProduct = computed(() => productsData.value.data.total)

// const updateStockProduct = async (id, stock) => {
//   try {
//   	const res = await $apiCore(`/seller/command/product/stock/edit/${id}`, {
//   		method: 'POST',
//   		body: { amount: parseInt(stock) },
//       onResponseError({ response }) {
//         throw response.message
//       },
//   	})
//
//   	// Refetch products
//   	fetchProducts()
//     messageStore.setMessage('success', 'Stock berhasil diubah')
//   } catch (error) {
//   		messageStore.setMessage('error', 'Gagal mengubah stock produk')
//   		console.error("Error on update product data:", error)
//   }
// }

// const deleteProduct = async id => {
//   try {
//   	const res = await $apiCore(`/seller/command/product/delete/${id}?accept=true`, { method: 'DELETE' })
//
//   	// Refetch products
//   	fetchProducts()
//   	messageStore.setMessage('success', res.message)
//   } catch (error) {
//   		messageStore.setMessage('error', 'Gagal menghapus produk')
//   		console.error("Error on delete product data:", error)
//   }
// }

const editStock = (id, name, stock) => {
  productId.value = id
  productName.value = name
  productStock.value = stock
  isUpdateStockDialogVisible.value = true
}

const syncProduct = (id) => {
  productId.value = id
  // do something here...
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
    <div class="d-flex flex-wrap gap-4 mb-6">
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
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          @click="() => { $router.push('/tiktokshop/tambah-produk') }"
        >
          Tambah Produk
        </VBtn>
      </div>
    </div>

    <VDivider class="mt-4" />

    <!-- 👉 Datatable	-->
    <VDataTableServer
      v-if="products && totalProduct > 0"
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="productSyncHeaders"
      :items="products"
      :items-length="totalProduct"
      :loading="!loading"
      class="text-wrap"
      >
      <!-- Gambar	-->
      <template #item.image="{ item }">
        <VAvatar
          v-if="item.product_photo && item.product_photo[0]"
          size="50"
          variant="tonal"
          class="my-2"
          rounded
          :image="item.product_photo[0].url"
          />
      </template>

      <!-- Nama Produk -->
      <template #item.name="{ item }">
        <span class="d-block text-body-2 my-1">{{ item.name }}</span>
      </template>

      <!-- Harga -->
      <template #item.price="{ item }">
        <div class="d-flex flex-column">
          <span class="text-body-1 text-high-emphasis fw-500">{{ toCurrency(item.price) }}</span>
          <div v-if="item.strike_price && item.price < item.strike_price">
            <span class="text-body-2 text-decoration-line-through text-error">{{ toCurrency(item.strike_price) }}</span>
          </div>
        </div>
      </template>

      <!-- TikTok Product ID -->
      <template #item.tiktok_product_id="{ item }">
        <span class="d-block text-body-2 my-1 fw-600">{{ item.tiktok_product_id }}</span>
      </template>

      <!-- TikTok Kategori ID -->
      <template #item.tiktok_category_id="{ item }">
        <div class="d-flex flex-column">
          <span class="text-body-2 text-high-emphasis fw-500">{{ item.tiktok_category_name }}</span>
          <span class="text-body-2">ID:{{ item.tiktok_category_id }}</span>
        </div>
      </template>

      <!-- Status -->
      <template #item.sync_status="{ item }">
        <VChip
          :label="false"
          :color="resolveSyncStatus(item.sync_status).color"
        >
          {{ resolveSyncStatus(item.sync_status).text }}
        </VChip>
      </template>

      <!-- Last Sync -->
      <template #item.last_sync_at="{ item }">
        <span class="d-block text-body-2 my-1">{{ toLocaleDateTime(item.last_sync_at) }}</span>
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
                <VListItem
                  value="edit_stock"
                  @click="editStock(item.id, item.name, resolveStock(item.product_stock))"
                  >
                  Ubah Stock
                </VListItem>
                <VListItem
                  value="sync_product"
                  @click="syncProduct(item.id)"
                  >
                  Sinkronisasi Produk
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
        :orientation="1"
        description="Anda saat ini belum memiliki Produk yang di unggah di TikTok Shop.<br/>Silakan unggah produk pilihan Anda untuk bisa di jual TikTok Shop"
        />
    </template>
  </div>
</template>
