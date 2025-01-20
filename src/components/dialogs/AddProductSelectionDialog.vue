<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  eventKey: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const selected = ref([])

// Data table options
const searchQuery = ref('')
const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)

const headers = productHeaders.filter(item => {
  return (item.id != 4 && item.id != 6)
})

const {
  data: productsData,
  execute: fetchProducts,
  isFinished: loading,
} = await useApiCore(createUrl('/seller/query/product/merchant', {
  query: {
    keyword: searchQuery,
    "filter[status]": "available",
    page,
    limit: itemsPerPage,
  },
}))

const products = computed(() => productsData.value.data.data)
const totalProduct = computed(() => productsData.value.data.total)

const onSubmit = () => {
  emit('formSubmitted', props.eventKey, props.eventType, selected.value)
  onReset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  selected.value = []
  searchQuery.value = ''
  page.value = 1
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 mb-2">
          Tambah Produk
        </h4>

        <div class="border">
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
              {{ selected.length }} selected
            </div>
          </div>

          <VDivider class="mt-2" />

          <!-- 👉 Datatable	-->
          <VDataTableServer
            v-if="products && totalProduct > 0"
            v-model="selected"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :headers="headers"
            :items="products"
            :items-length="totalProduct"
            :item-value="item => item.id"
            :loading="!loading"
            return-item
            show-select
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
              {{ item.name }}
            </template>

            <!-- Harga -->
            <template #item.price="{ item }">
              <span class="text-body-1 text-high-emphasis">{{ toCurrency(item.price) }}</span>
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
        </div>

        <!-- 👉 Actions button -->
        <div class="d-flex align-center justify-center gap-4 mt-4">
          <VBtn
            class="w-100"
            @click="onSubmit"
          >
            Simpan
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
