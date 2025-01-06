<script setup>
import notFoundImg from '@/assets/images/icons/ic-search.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
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
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const headers = [
  {
    title: 'Produk',
    key: 'image',
    sortable: false,
  },
  {
    title: 'Nama',
    key: 'name',
  },
  {
    title: 'Harga',
    key: 'price',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
]

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
    page,
    per_page: itemsPerPage,
    sort: sortBy,
    order: orderBy,
  },
}))

const products = computed(() => productsData.value.products)
const totalProduct = computed(() => productsData.value.total)

const onSubmit = () => {
	emit('formSubmitted', selected.value)
  emit('update:isDialogVisible', false)
  selected.value = []
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  selected.value = []
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

    <VCard class="pa-sm-10 pa-2">
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
						return-item
						show-select
						class="text-no-wrap"
						@update:options="updateOptions"
						>
						<!-- Gambar	-->
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
							{{ item.name }}
						</template>

						<!-- Harga -->
						<template #item.price="{ item }">
							<span class="text-body-1 text-high-emphasis">{{ item.price_label }}</span>
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
				</div>

				<!-- 👉 Actions button -->
				<div class="d-flex align-center justify-center gap-4 mt-4">
					<VBtn class="w-100" @click="onSubmit">
						Simpan
					</VBtn>
				</div>

      </VCardText>
    </VCard>
  </VDialog>
</template>
