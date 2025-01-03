<script setup>
import notFoundImg from '@/assets/images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const props = defineProps({
  selectedStatus: {
    type: String
	},
})

const headers = [
  {
    title: 'Gambar',
    key: 'image',
    sortable: false,
  },
  {
    title: 'Judul',
    key: 'name',
  },
  {
    title: 'Harga',
    key: 'price',
  },
  {
    title: 'Stock',
    key: 'stock',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: '',
    key: 'actions',
    sortable: false,
  },
]

const searchQuery = ref('')
const isUpdateHargaDialogVisible = ref(false)
const isUpdateStockDialogVisible = ref(false)
const isUpdateStatusDialogVisible = ref(false)
const isDeleteProductDialogVisible = ref(false)
const productId = ref(0)
const productName = ref('')
const productPrice = ref(0)
const productStock = ref(0)
const productStatus = ref(0)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveStatus = statusId => {
  if (statusId === 0)
    return {
      text: 'Arsip',
      color: 'warning',
    }
  if (statusId === 1)
    return {
      text: 'Dijual',
      color: 'success',
    }
  if (statusId === 2)
    return {
      text: 'Non-Aktif',
      color: 'secondary',
    }
  if (statusId === 3)
    return {
      text: 'Ditolak',
      color: 'error',
    }
}

const {
  data: productsData,
  execute: fetchProducts,
} = await useApiRails(createUrl('/merchant/products', {
  query: {
    q: searchQuery,
    status: props.selectedStatus,
    page,
    per_page: itemsPerPage,
    sort: sortBy,
    order: orderBy,
  },
}))

const products = computed(() => productsData.value.products)
const totalProduct = computed(() => productsData.value.total)

const updateHargaProduct = async (id, price) => {
	try {
		await $apiRails(`/merchant/products/${id}`, {
			method: 'PUT',
			body: { product: { price: price } },
		});

		// Refetch products
		fetchProducts()
		messageStore.setMessage('success', 'Update harga berhasil diubah')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal mengubah harga produk')
			console.error("Error on update product data:", error);
	}
}

const updateStockProduct = async (id, stock) => {
	try {
		await $apiRails(`/merchant/products/${id}`, {
			method: 'PUT',
			body: { product: { stock: stock } },
		});

		// Refetch products
		fetchProducts()
		messageStore.setMessage('success', 'Update stock berhasil diubah')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal mengubah stock produk')
			console.error("Error on update product data:", error);
	}
}

const updateStatusProduct = async (id, status) => {
	try {
		await $apiRails(`/merchant/products/${id}`, {
			method: 'PUT',
			body: { product: { status: status } },
		});

		// Refetch products
		fetchProducts()
		messageStore.setMessage('success', 'Update status berhasil diubah')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal mengubah status produk')
			console.error("Error on update product data:", error);
	}
}
const deleteProduct = async id => {
	try {
		await $apiRails(`/merchant/products/${id}`, { method: 'DELETE' });

		// Refetch products
		fetchProducts()
		messageStore.setMessage('success', 'Produk berhasil dihapus')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menghapus produk')
			console.error("Error on delete product data:", error);
	}
}

const editPrice = (id, name, price) => {
  productId.value = id
  productName.value = name
  productPrice.value = price
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
      <div class="d-flex flex-wrap gap-4 ma-6">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
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
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
				v-if="products && totalProduct > 0"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="products"
        :items-length="totalProduct"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Gambar  -->
        <template #item.image="{ item }">
					<VAvatar
						v-if="item.image"
						size="50"
						variant="tonal"
						class="my-2"
						rounded
						:image="item.image"
					/>
        </template>

        <!-- Judul -->
        <template #item.name="{ item }">
          <span class="text-body-1 text-high-emphasis">{{ item.name }}</span>
        </template>

        <!-- Harga -->
        <template #item.price="{ item }">
          <span class="text-body-1 text-high-emphasis">{{ item.price_label }}</span>
        </template>

        <!-- Stock -->
        <template #item.stock="{ item }">
          <span class="text-body-1 text-high-emphasis">{{ item.stock }}</span>
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
									<RouterLink style="color:inherit" :to="{ name: 'produk-edit-id', params: { id: item.id } }">
										Edit Produk
									</RouterLink>
                </VListItem>
                <VListItem value="view">
                  Lihat Produk
                </VListItem>
                <VListItem value="edit_price" @click="editPrice(item.id, item.name, item.price)">
									Ubah Harga
                </VListItem>
                <VListItem value="edit_stock" @click="editStock(item.id, item.name, item.stock)">
                  Ubah Stock
                </VListItem>
                <VListItem value="deactivate" @click="editStatus(item.id, item.name, 1)">
									Jual Produk
                </VListItem>
                <VListItem value="deactivate" @click="editStatus(item.id, item.name, 2)">
									Non-Aktifkan Produk
                </VListItem>
                <VListItem value="archive" @click="editStatus(item.id, item.name, 0)">
									Arsipkan Produk
                </VListItem>
                <VListItem value="deactivate" @click="editStatus(item.id, item.name, 3)">
									Tolak Produk
                </VListItem>
                <VListItem value="delete" @click="deleteItem(item.id, item.name)">
                  Hapus Produk
                </VListItem>
              </VList>
            </VMenu>
					</VBtn>
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
			<div v-else class="d-flex justify-center align-center pa-10 ma-10">
				<div class="d-flex align-center">
					<VAvatar
						size="100"
						class="me-6"
					>
						<VImg
							:src="notFoundImg"
							class="mb-2"
						/>
					</VAvatar>
					<div class="d-flex flex-column">
						<p class="text-body-2" style="width:350px">
							Anda sekarang belum memiliki produk yang di unggah. Silahkan unggah produk anda untuk bisa dijual.
						</p>
						<VBtn
							color="primary"
							style="width:fit-content"
							prepend-icon="tabler-plus"
							@click="$router.push('/produk/tambah')"
							>
							Tambah Produk
						</VBtn>
					</div>
				</div>
			</div>
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
