<script setup>
import notFoundImg from '@images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const route = useRoute('event-products')
const isAddProductDialogVisible = ref(false)
const eventData = ref()
const eventKey = ref('')
const eventType = ref('')
const eventName = ref('')

// Data table options
const searchQuery = ref('')
const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)

const headers = productHeaders.filter(item => {
  return (item.id != 4 && item.id != 5)
})

// get event data
const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
  let eventsData = merchantDetails.value.data.merchant.can_registered_product_event
  eventData.value = eventsData.find(x => x.event_key === route.query.key)
	if(eventData.value) {
		eventKey.value = eventData.value.event_key
		eventType.value = eventData.value.event_type
		eventName.value = eventData.value.event_name
	}
}

const {
  data: productsData,
  execute: fetchProducts, isFinished: loading,
} = await useApiCore(createUrl('/seller/query/product/event', {
  query: {
    keyword: searchQuery,
    page,
    limit: itemsPerPage,
  },
})).post({
	event_key: route.query.key,
	event_type: route.query.type,
})

const products = computed(() => productsData.value?.data?.data?.map(item => item.product))
const totalProduct = computed(() => productsData.value?.data?.total)

const addProducts = async (key, type, ids) => {
  try {
		let eventParams = {
			event_key: key,
			event_type: type,
			products: ids,
		}
		console.log(eventParams)
    const res = await $apiCore('/seller/command/product/event/create', {
      method: 'POST',
      body: eventParams,
      onResponseError({ response }) {
        console.log(response)
      },
    })

    // Refetch products
    fetchProducts()
		let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menambahkan produk')
    console.error("Error on add product event:", error)
  }
}

const deleteProduct = async id => {
  try {
		const res = await $apiCore('/seller/command/product/event/delete', {
			method: 'POST',
			body: {
				event_key: eventKey.value,
				event_type: eventType.value,
				product_id: id,
			},
      onResponseError({ response }) {
        console.log(response)
      },
		})

    // Refetch products
    fetchProducts()
		let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menghapus produk')
    console.error("Error on delete product data:", error)
  }
}

const addItem = () => {
  isAddProductDialogVisible.value = true
}

const deleteItem = (id, name) => {
	deleteProduct(id)
}
</script>

<template>
  <div>
    <!-- 👉 Event Data	-->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">
					Event dan Promo
        </h4>
        <p
          v-if="eventData"
          class="text-body-1 text-medium-emphasis mb-0"
        >
          {{ eventData.event_name }}
        </p>
      </div>
      <div
        v-if="eventData"
        class="d-flex gap-4"
      >
        <VBtn
          color="primary"
          style="width:fit-content"
          prepend-icon="tabler-plus"
          @click="addItem"
        >
          Tambah Produk
        </VBtn>
      </div>
    </div>
    <!-- 👉 Empty Event -->
    <VCard v-if="eventData == undefined">
    <div class="d-flex justify-center align-center pa-10 ma-10">
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
          <p
            class="text-body-2"
            style="width:350px"
          >
            Maaf event yang anda cari tidak ditemukan. Silahkan coba beberapa saat lagi.
          </p>
          <VBtn
            color="primary"
            style="width:fit-content"
            @click="$router.push('/event')"
          >
            Lihat Event dan Promo
          </VBtn>
        </div>
      </div>
    </div>
    </VCard>

    <!-- 👉 products -->
    <VCard v-if="eventData">
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
        :loading="!loading"
        class="text-no-wrap"
      >
        <!-- Gambar  -->
        <template #item.image="{ item }">
          <VAvatar
            v-if="item.product_photo"
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

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn
            size="small"
            variant="tonal"
            color="error"
            @click="deleteItem(item.id, item.name)"
          >
            <VIcon icon="tabler-trash" />
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
      <div
        v-else
        class="d-flex justify-center align-center pa-10 ma-10"
      >
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
            <p
              class="text-body-2"
              style="width:350px"
            >
              Anda sekarang belum memiliki produk untuk promo <strong>{{ eventName }}</strong>. Silahkan pilih produk-produk yang ingin anda tampilkan sebagai Produk Promo di toko anda.
            </p>
            <VBtn
              color="primary"
              style="width:fit-content"
              prepend-icon="tabler-plus"
              @click="addItem"
            >
              Tambah Produk
            </VBtn>
          </div>
        </div>
      </div>
    </VCard>

    <AddProductSelectionDialog
      v-model:is-dialog-visible="isAddProductDialogVisible"
      v-model:event-key="eventKey"
      v-model:event-type="eventType"
      v-model:event-name="eventName"
      @form-submitted="addProducts"
    />
  </div>
</template>
