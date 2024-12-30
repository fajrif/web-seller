<script setup>
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
      text: 'Non-Aktif',
      color: 'error',
    }
}

const {
  data: productsData,
  execute: fetchProducts,
} = await useApiRails(createUrl('/merchant/products', {
  query: {
    q: searchQuery,
    status: 3,
    page,
    per_page: itemsPerPage,
    sort: sortBy,
    order: orderBy,
  },
}))

const products = computed(() => productsData.value.products)
const totalProduct = computed(() => productsData.value.total)

const deleteProduct = async id => {
  await $apiRails(`apps/ecommerce/products/${ id }`, { method: 'DELETE' })

  // Refetch products
  fetchProducts()
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
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem value="edit">
                  Edit Produk
                </VListItem>
                <VListItem value="view">
                  Lihat Produk
                </VListItem>
                <VListItem value="edit_price">
                  Ubah Harga
                </VListItem>
                <VListItem value="edit_stock">
                  Ubah Stock
                </VListItem>
                <VListItem value="deactivate">
									NonAktifkan Produk
                </VListItem>
                <VListItem value="archive">
									Arsipkan Produk
                </VListItem>
                <VListItem value="delete" @click="deleteProduct(item.id)">
                  Hapus Produk
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
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
    </VCard>
  </div>
</template>
