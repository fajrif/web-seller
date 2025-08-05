<script setup>
import tikTokShopLogo from '@images/logos/tiktok-shop.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const searchQuery = ref('')
const isUpdateStockDialogVisible = ref(false)
const isDeleteProductDialogVisible = ref(false)
const selectedStatus = ref('')
const productId = ref('')
const productName = ref('')
const productSku = ref('')
const productWarehouseId = ref('')
const productStock = ref(0)

// Data table options
const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)
const sortBy = ref('')

const {
  data: productsData,
  execute: fetchProducts, isFinished: loading,
} = await useApiCore(createUrl('/seller/tiktok/products/search', {
  query: {
    pageSize: itemsPerPage,
  },
}))

const products = computed(() => productsData.value.data.products)
const totalProduct = computed(() => productsData.value.data.total_count)

const updateStockProduct = async (id, sku, warehouseId, stock) => {
  try {
    const res = await $apiCore(`/seller/tiktok/products/${id}/inventory`, {
  		method: 'PUT',
      body: {
        sku: sku,
        warehouse_id: warehouseId,
        quantity: parseInt(stock)
      },
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

const deleteProduct = async id => {
  try {
    const res = await $apiCore(`/seller/tiktok/products/${id}/remove`, { method: 'DELETE' })

  	// Refetch products
  	fetchProducts()
  	messageStore.setMessage('success', res.message)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menghapus produk')
    console.error("Error on delete product data:", error)
  }
}

const editStock = (id, name, sku, warehouseId, stock) => {
  productId.value = id
  productName.value = name
  productSku.value = sku
  productWarehouseId.value = warehouseId
  productStock.value = stock
  isUpdateStockDialogVisible.value = true
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
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          @click="() => { $router.push('/tiktokshop/tambah-produk') }"
        >
          Tambah Produk
        </VBtn>
      </div>

      <VSpacer />
      <div class="d-flex gap-4 flex-wrap align-center">
        <AppSelect
          v-model="itemsPerPage"
          :items="[5, 10, 20, 25, 50]"
          />
      </div>
    </div>

    <VDivider class="mt-4" />

    <!-- 👉 Datatable	-->
    <VDataTableServer
      v-if="products && totalProduct > 0"
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="tikTokProductHeaders"
      :items="products"
      :items-length="totalProduct"
      :loading="!loading"
      class="text-wrap"
      >
      <!-- Nama Produk -->
      <template #item.name="{ item }">
        <span class="d-block text-body-2 my-1">{{ item.title }}</span>
      </template>

      <!-- TikTok Seller SKU -->
      <template #item.sku="{ item }">
        <span class="d-block text-body-2 my-1 fw-600">{{ item.skus[0].seller_sku }}</span>
      </template>

      <!-- Harga -->
      <template #item.price="{ item }">
        <div class="d-flex flex-column">
          <span class="text-body-1 text-high-emphasis fw-500">{{ toCurrency(item.skus[0].price.tax_exclusive_price) }}</span>
          <div v-if="!isEmpty(item.skus[0].price.sale_price)">
            <span class="text-body-2 text-decoration-line-through text-error">{{ toCurrency(item.skus[0].price.sale_price) }}</span>
          </div>
        </div>
      </template>

      <!-- TikTok Product ID -->
      <template #item.tiktok_product_id="{ item }">
        <span class="d-block text-body-2 my-1 fw-600">{{ item.id }}</span>
      </template>

      <!-- Stock -->
      <template #item.stock="{ item }">
        <span class="d-block text-body-2 my-1 fw-600">{{ item.skus[0].inventory[0].quantity }}</span>
      </template>

      <!-- Status -->
      <template #item.sync_status="{ item }">
        <VChip
          :label="false"
          :color="item.status == 'ACTIVATE' ? 'success' : 'error'"
          size="small"
        >
          {{ item.status }}
        </VChip>
      </template>

      <!-- Last Sync -->
      <template #item.last_update="{ item }">
        <span class="d-block text-body-2 my-1">{{ formatUnix(item.update_time) }}</span>
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
                  @click="editStock(item.id, item.title, item.skus[0].id, item.skus[0].inventory[0].warehouse_id, item.skus[0].inventory[0].quantity)"
                  >
                  Ubah Stock
                </VListItem>
                <VListItem
                  value="delete"
                  @click="deleteItem(item.id, item.title)"
                  >
                  Hapus Produk
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </div>
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
    <TikTokUpdateStockDialog
      v-model:is-dialog-visible="isUpdateStockDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      v-model:product-sku="productSku"
      v-model:product-warehouse-id="productWarehouseId"
      v-model:product-stock="productStock"
      @form-submitted="updateStockProduct"
    />
    <TikTokDeleteProductDialog
      v-model:is-dialog-visible="isDeleteProductDialogVisible"
      v-model:product-id="productId"
      v-model:product-name="productName"
      @form-submitted="deleteProduct"
    />
  </div>
</template>
