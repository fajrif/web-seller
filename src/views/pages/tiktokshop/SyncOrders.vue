<script setup>
import tikTokShopLogo from '@images/logos/tiktok-shop.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const orderId = ref('')
// const orderName = ref('')
// const orderSku = ref('')
// const orderWarehouseId = ref('')
// const orderStock = ref(0)

// Data table options
const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)
const sortBy = ref('')

const {
  data: ordersData,
  execute: fetchOrders, isFinished: loading,
} = await useApiCore(createUrl('/seller/tiktok/orders/search', {
  query: {
    pageSize: itemsPerPage,
  },
}))

const orders = computed(() => ordersData.value.data.orders)
const totalOrder = computed(() => ordersData.value.data.total_count)

const editStock = (id) => {
  orderId.value = id
}

</script>
<template>
  <div>
    <!-- 👉 orders -->
    <div class="d-flex flex-wrap gap-4 mb-6">
      <div class="d-flex align-center">
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
      v-if="orders && totalOrder > 0"
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="tikTokOrderHeaders"
      :items="orders"
      :items-length="totalOrder"
      :loading="!loading"
      class="text-wrap"
      >

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
                  @click="editStock(item.id)"
                  >
                  View Order
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </div>
      </template>
    </VDataTableServer>

    <!-- 👉 Empty orders -->
    <template v-else>
      <EmptyData
        :border="false"
        :orientation="1"
        description="Anda saat ini belum memiliki Produk yang di unggah di TikTok Shop.<br/>Silakan unggah produk pilihan Anda untuk bisa di jual TikTok Shop"
        />
    </template>
  </div>
</template>
