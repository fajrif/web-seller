<script setup>
import { useMessageStore } from '@core/stores/config'
import { useUserDataStore } from '@core/stores/config'
import { useTikTokShopStore } from '@core/stores/tiktokShop'
import '@cholakovdev/vue3-treeselect/dist/vue3-treeselect.css'

const refForm = ref()
const loading = ref(false)
const searchQuery = ref('')
const categories = ref([])
const suggestions = ref([])
var optionsMap = new Map()
const product = ref()
const categoryId = ref()
const stock = ref(0)
const router = useRouter()

const userData = useUserDataStore()
const messageStore = useMessageStore()

const { data: dataCategories } = await useApiCore("/seller/tiktok/product/categories")
if(dataCategories.value.status_code === 200) {
  if(!isEmpty(dataCategories.value.data)){
    categories.value = sanitizeEmptyChildrens(buildCategoryTree(dataCategories.value.data))
    optionsMap = flattenOptions(categories.value)
  }
}

const searchTrigger = computed(() => {
	if (searchQuery.value.length > 3) {
		 return searchQuery.value
	}
})

const {
  data: productsData,
  execute: fetchProducts, isFinished: loadingData,
} = await useApiCore(createUrl('/seller/query/product/merchant', {
  query: {
    keyword: searchTrigger,
    page: 1,
    limit: PAGINATION_PER_PAGE,
  },
}))

const products = computed(() => productsData.value.data.data)
const validProduct = computed(() => !isNullOrUndefined(product.value))

const saveProduct = async productData => {
  try {
    const res = await $apiCore('/seller/tiktok/products/sync', {
      method: 'POST',
      body: productData,
      onResponseError({ response }) {
				loading.value = false
        messageStore.setMessage('error', response._data.message)
      },
    })

    await nextTick(() => {
			loading.value = false
			messageStore.setMessage('success', 'Data produk berhasil di upload ke TikTok Shop')
			router.push('/tiktokshop/produk')
		})
  } catch (error) {
		loading.value = false
    messageStore.setMessage('error', 'Gagal mengirim data produk ke TikTok Shop')
    console.error("Error on sync product tiktok:", error)
  }
}

const gotoEditProduct = (productID) => {
  // Delete from product URLs
  router.push(`/produk/edit/${productID}`)
}

const selectedObject = computed(() => {
  return optionsMap.get(categoryId.value) || null
})

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      loading.value = true
      if(product.value.name.length >= 25) {
        /* eslint-disable camelcase */
        saveProduct({
          merchant_id: userData.id,
          product_ids: [product.value.id],
          category_id: categoryId.value,
          category_name: selectedObject.value?.label,
          stock: parseInt(stock.value),
        })
        /* eslint-enable */
      } else {
        messageStore.setMessage('error', 'Nama Produk TikTok Shop Min: 25 karakter')
      }
    }
  })
}

</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Tambah Produk ke TikTok Shop
        </h4>
      </div>
    </div>

    <!-- 👉 Tambah produk -->
    <VForm
      ref="refForm"
      @submit.prevent="onSubmit"
    >
      <VRow class="bg-white pa-4 mx-2 border-radius-8">
        <VCol cols="12">
          <v-autocomplete
            v-model="product"
            :items="products"
            :loading="!loadingData"
            :search-input.sync="searchQuery"
            item-title="name"
            item-value="id"
            return-object
            label="Pilih Produk"
            placeholder="Cari Produk dari PLN Marketplace"
            outlined
            clearable
            no-filter
            hide-no-data
            :menu-props="{ maxHeight: '300' }"
          />
        </VCol>
        <VCol
          v-if="validProduct"
          cols="12"
          >
          <v-card>
            <div class="d-flex align-start justify-start w-100 pa-4">
              <div class="pt-4 pe-6">
                <VImg
                  v-if="product.product_photo && product.product_photo[0]"
                  :src="product.product_photo[0].url"
                  width="100"
                  height="100"
                  rounded
                  />
              </div>

              <div>
                <div class="d-flex">
                  <h4 class="text-h4 mb-1 me-2 fw-700">
                    {{ product.name }}
                  </h4>
                  <VBtn
                    icon="tabler-pencil"
                    variant="text"
                    color="info"
                    @click.stop="gotoEditProduct(product.id)"
                    />
                </div>
                <div class="d-flex gap-x-4">
                  <h4 class="text-h4 mb-1 fw-700 text-primary">
                    {{ toCurrency(product.price) }}
                  </h4>
                  <div
                    v-if="product.strike_price && product.price < product.strike_price"
                    class="d-flex gap-2 flex-wrap align-center"
                    >
                    <p
                      class="text-body-1 text-medium-emphasis mb-0"
                      style="text-decoration:line-through;"
                      >
                      {{ toCurrency(product.strike_price) }}
                    </p>
                    <VChip
                      :label="false"
                      size="small"
                      color="error"
                      >
                      {{ calculateDiscount(product.price, product.strike_price) }}
                    </VChip>
                  </div>
                </div>

                <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                  <div>
                    <VList class="card-list text-medium-emphasis">
                      <VListItem>
                        <VListItemTitle>Kategori: <strong>{{ product.category.value }}</strong></VListItemTitle>
                      </VListItem>
                      <VListItem>
                        <VListItemTitle>Berat: <strong>{{ toKilo(product.weight) }} Kg</strong></VListItemTitle>
                      </VListItem>
                      <VListItem>
                        <VListItemTitle>Stock: <strong>{{ product.product_stock[0].amount }}</strong></VListItemTitle>
                      </VListItem>
                    </VList>
                  </div>
                </div>
                <VDivider class="my-2" />
                <div v-html="product.description" class="mb-3" />
              </div>

            </div>
          </v-card>
        </VCol>
        <VCol cols="6" style="overflow: visible; position: relative;">
          <AppTreeSelect
            v-model="categoryId"
            :rules="[requiredValidator]"
            :searchable="true"
            :multiple="false"
            open-direction="below"
            :show-count="true"
            :disable-branch-nodes="true"
            label="Kategori TikTok Shop"
            placeholder="Pilih Kategori TikTok Shop"
            :options="categories"
            />
        </VCol>
        <VCol cols="6">
          <AppTextField
            v-model="stock"
            :disabled="loading"
            label="Stock"
            placeholder="Masukan Jumlah Stock"
            type="number"
            :rules="[requiredValidator,integerValidator,betweenValidator(stock,1,9999)]"
          />
        </VCol>
        <VCol cols="12">
          <div class="mt-4 text-center">
            <VBtn
              type="submit"
              :disabled="!validProduct"
              >
              Unggah Data Produk ke TikTok Shop
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>
<style lang="scss">
.card-list .v-list-item:not(:last-child) {
	padding-block-end: 4px !important;
}
.vue-treeselect__menu-container {
  position: absolute !important;
  z-index: 3000 !important;
}
</style>
