<script setup>
import { reactive } from 'vue'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const router = useRouter()
const route = useRoute('produk-edit-id')

const isFormValid = ref(false)
const refForm = ref()
const	productName = ref('')
const	productDescription = ref('')
const	productCategory = ref()
const	productShowcase = ref()
const	productCondition = ref(1)
const	productPrice = ref()
const	productFakePrice = ref()
const	productStock = ref()
const	productMinPurchase = ref(1)
const	productWeight = ref()
const	productHeight = ref()
const	productWidth = ref()
const	productLength = ref()
const	productFeatured = ref(false)
const	productStatus = ref(0)

const { data: productDetails } = await useApiCore(`/merchant/products/${ route.params.id }`)
if (productDetails.value) {
  productName.value = productDetails.value.name
  productDescription.value = productDetails.value.name
  productCategory.value = productDetails.value.category_id
  productShowcase.value = productDetails.value.showcase_id
  productCondition.value = productDetails.value.condition
  productPrice.value = productDetails.value.price
  productFakePrice.value = productDetails.value.fake_price
  productStock.value = productDetails.value.stock
  productMinPurchase.value = productDetails.value.min_purchase
  productWeight.value = productDetails.value.weight
  productHeight.value = productDetails.value.height
  productWidth.value = productDetails.value.width
  productLength.value = productDetails.value.length
  productFeatured.value = productDetails.value.featured == 1
  productStatus.value = productDetails.value.status
}

const statusProduct = [
  {
    id: 0,
    name: "Arsip",
  },
  {
    id: 1,
    name: "Dijual",
  },
  {
    id: 2,
    name: "Non-Aktif",
  },
  {
    id: 3,
    name: "Ditolak",
  },
]

const conditionProduct = [
  {
    id: 1,
    name: "Baru",
  },
  {
    id: 0,
    name: "Bekas / Lama",
  },
]

const { data: categoriesData, execute: fetchCategories } = await useApiCore(createUrl('/categories'))
const { data: showcasesData, execute: fetchShowcases } = await useApiCore(createUrl('/merchant/showcases'))

const categories = computed(() => categoriesData.value)
const showcases = computed(() => showcasesData.value)

const saveProduct = async productdata => {
  try {
    await $apiCore(`/merchant/products/${ route.params.id }`, {
      method: 'PUT',
      body: { product: productdata },
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
      let isFeatured = 0
      if(productFeatured.value) {
        isFeatured = 1
      }
      /* eslint-disable camelcase */
      saveProduct({
        name: productName.value,
        description: productDescription.value,
        category_id: productCategory.value,
        showcase_id: productShowcase.value,
        condition: productCondition.value,
        price: productPrice.value,
        fake_price: productFakePrice.value,
        stock: productStock.value,
        min_purchase: productMinPurchase.value,
        weight: productWeight.value,
        height: productHeight.value,
        width: productWidth.value,
        length: productLength.value,
        featured: isFeatured,
        status: productStatus.value,
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
                    item-title="name"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="productShowcase"
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
                    item-value="id"
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
                v-model="productFakePrice"
                label="Harga Coret"
                prefix="Rp"
                type="number"
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
                label="Stock"
                suffix="Buah"
                type="number"
                placeholder="Tentukan jumlah stock"
                class="mb-6"
              />
              <AppTextField
                v-model="productMinPurchase"
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
