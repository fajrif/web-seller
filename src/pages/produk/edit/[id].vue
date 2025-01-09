<script setup>
import { reactive } from 'vue'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const router = useRouter()
const route = useRoute('produk-edit-id')

const isFormValid = ref(false)
const refForm = ref()
const	merchantId = ref(0)
const	productName = ref('')
const	productDescription = ref('')
const	productCategory = ref()
const	productEtalase = ref()
const	productCondition = ref('')
const	productPrice = ref()
const	productStrikePrice = ref()
const	productStock = ref()
const	productMinPurchase = ref(1)
const	productWeight = ref()
const	productHeight = ref()
const	productWidth = ref()
const	productLength = ref()
const	productFeatured = ref(false)
const	productStatus = ref(9)
const	productPhotoUrl = ref([])

const { data: productDetails } = await useApiCore(`/seller/query/product/detail/${ route.params.id }`)
if (productDetails.value.success) {
	let productData = productDetails.value.data
  merchantId.value = productData.merchant_id
  productName.value = productData.name
  productDescription.value = productData.description
  productCategory.value = productData.category_id
  productEtalase.value = productData.etalase_id
  productCondition.value = productData.condition
  productPrice.value = productData.price
  productStrikePrice.value = productData.strike_price
  productStock.value = productData.product_stock[0].amount
  productMinPurchase.value = productData.minimum_purchase
  productWeight.value = productData.weight
  productHeight.value = productData.height
  productWidth.value = productData.width
  productLength.value = productData.length
  productFeatured.value = productData.is_featured_product
  productStatus.value = productData.status
	if(productData.product_photo) {
		productPhotoUrl.value = productData.product_photo.map(item => item.url)
	}
}

const { data: categoriesData, execute: fetchCategories } = await useApiCore(createUrl('/seller/query/category/all'))
const { data: showcasesData, execute: fetchShowcases } = await useApiCore(createUrl('/seller/query/etalase'))

const categories = computed(() => categoriesData.value.data)
const showcases = computed(() => showcasesData.value.etalase)

const saveProduct = async productData => {
  try {
    const res = await $apiCore(`/seller/command/product/edit/${ route.params.id }`, {
      method: 'POST',
			body: productData,
      onResponseError({ response }) {
				messageStore.setMessage('error', response._data.message)
      },
    })

    router.push('/produk/semua')
    messageStore.setMessage('success', 'Data produk berhasil diubah')
  } catch (error) {
    messageStore.setMessage('error', 'Gagal mengubah data produk')
    console.error("Error on posting product data:", error)
  }
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      /* eslint-disable camelcase */
      saveProduct({
        merchant_id: merchantId.value,
        name: productName.value,
        description: productDescription.value,
        category_id: productCategory.value,
        etalase_id: productEtalase.value,
        condition: productCondition.value,
        price: parseInt(productPrice.value),
        strike_price: parseInt(productStrikePrice.value),
        amount: parseInt(productStock.value),
        minimum_purchase: productMinPurchase.value,
        weight: productWeight.value,
        height: productHeight.value,
        width: productWidth.value,
        length: productLength.value,
        is_featured_product: productFeatured.value,
        status: productStatus.value,
				url: productPhotoUrl.value,
      })
      /* eslint-enable */
    }
  })
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Edit Produk
        </h4>
      </div>
    </div>
    <!-- 👉 Form -->
    <VForm
      ref="refForm"
      v-model="isFormValid"
      @submit.prevent="onSubmit"
    >
      <VRow>
        <VCol md="8">
          <!-- 👉 Product Information -->
          <VCard
            class="mb-6"
            title="Informasi Produk"
          >
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="productName"
                    :rules="[requiredValidator]"
                    label="Nama Produk"
                    placeholder="Masukan nama barang anda"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="productCategory"
                    :rules="[requiredValidator]"
                    placeholder="Pilih Kategori"
                    label="Kategori"
                    :items="categories"
                    item-title="value"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="productEtalase"
                    :rules="[requiredValidator]"
                    placeholder="Pilih Etalase"
                    label="Etalase"
                    :items="showcases"
                    item-title="name"
                    item-value="id"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="productStatus"
                    placeholder="Pilih Status"
                    label="Status"
                    :items="statusProduct"
                    item-title="name"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="productCondition"
                    placeholder="Pilih Kondisi"
                    label="Kondisi"
                    :items="conditionProduct"
                    item-title="name"
                    item-value="name"
                  />
                </VCol>

                <VCol>
                  <span class="mb-1">Deskripsi Produk</span>
                  <ProductDescriptionEditor
                    v-model="productDescription"
                    placeholder="Masukan informasi dan detil deskripsi produk anda"
                    class="border rounded"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- 👉 Ukuran Paket -->
          <VCard
            class="mb-6"
            title="Ukuran Paket"
          >
            <VCardText>
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="productWeight"
                    :rules="[requiredValidator]"
                    label="Berat"
                    suffix="gr"
                    type="number"
                    placeholder="0"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="productWidth"
                    :rules="[requiredValidator]"
                    label="Lebar"
                    suffix="cm"
                    type="number"
                    placeholder="0"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="productLength"
                    :rules="[requiredValidator]"
                    label="Panjang"
                    suffix="cm"
                    type="number"
                    placeholder="0"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="productHeight"
                    :rules="[requiredValidator]"
                    label="Tinggi"
                    suffix="cm"
                    type="number"
                    placeholder="0"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- 👉 Media -->
          <VCard class="mb-6">
            <VCardItem>
              <template #title>
                Gambar Produk
              </template>
            </VCardItem>

            <VCardText>
              <DropZone />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          md="4"
          cols="12"
        >
          <!-- 👉 Pricing -->
          <VCard
            title="Harga"
            class="mb-6"
          >
            <VCardText>
              <AppTextField
                v-model="productPrice"
                label="Harga Satuan"
                prefix="Rp"
                type="number"
                :rules="[requiredValidator]"
                placeholder="Masukan harga jual"
                class="mb-6"
              />
              <AppTextField
                v-model="productStrikePrice"
                label="Harga Coret"
                prefix="Rp"
                type="number"
								:rules="[requiredValidator]"
                placeholder="Masukan harga coret"
                class="mb-6"
              />

              <VDivider class="my-2" />

              <div class="d-flex flex-raw align-center justify-space-between">
                <span class="fw-700">Produk Unggulan</span>
                <VSwitch
                  v-model="productFeatured"
                  density="compact"
                />
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Stock -->
          <VCard
            title="Stock"
            class="mb-6"
          >
            <VCardText>
              <AppTextField
                v-model="productStock"
								:rules="[requiredValidator]"
                label="Stock"
                suffix="Buah"
                type="number"
                placeholder="Tentukan jumlah stock"
                class="mb-6"
              />
              <AppTextField
                v-model="productMinPurchase"
								:rules="[requiredValidator]"
                label="Pembelian Minimum"
                suffix="Buah"
                type="number"
                placeholder="Tentukan pembelian minimum"
                class="mb-6"
              />
            </VCardText>
          </VCard>

          <div class="d-flex flex-wrap gap-4 justify-end">
            <VBtn
              type="reset"
              variant="tonal"
              color="secondary"
            >
              Reset
            </VBtn>
            <VBtn type="submit">
              Simpan
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<style lang="scss" scoped>
  .drop-zone {
    border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 6px;
  }
</style>

<style lang="scss">
.ProseMirror {
  p {
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    float: inline-start;
    pointer-events: none;
  }
}
</style>
