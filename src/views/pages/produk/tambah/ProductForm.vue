<script setup>
import { reactive } from 'vue'
import { useMessageStore } from '@core/stores/config'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

const userData = useCookie('userData')
const messageStore = useMessageStore()
const router = useRouter()

const isFormValid = ref(false)
const refForm = ref()
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

const { data: categoriesData, execute: fetchCategories } = await useApiCore(createUrl('/seller/query/category/all'))
const { data: showcasesData, execute: fetchShowcases } = await useApiCore(createUrl('/seller/query/etalase'))

const categories = computed(() => sanitizeNullChilds(categoriesData.value.data))
const showcases = computed(() => showcasesData.value.etalase)

const saveProduct = async productData => {
  try {
    const res = await $apiCore('/seller/command/product/create', {
      method: 'POST',
      body: productData,
      onResponseError({ response }) {
        messageStore.setMessage('error', response._data.message)
      },
    })

    router.push('/produk/semua')
    messageStore.setMessage('success', 'Data produk berhasil disimpan')
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menyimpan data produk')
    console.error("Error on posting product data:", error)
  }
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      /* eslint-disable camelcase */
      saveProduct({
        merchant_id: userData.id,
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
								<div class="flex-grow-1">
									<label class="v-label mb-1 text-body-2" style="line-height: 15px;">Kategori</label>
									<treeselect
                    v-model="productCategory"
										:multiple="false"
										:show-count="true"
                    placeholder="Pilih Kategori"
                    :options="categories"
										:normalizer="normalizerCategories"
										/>
								</div>
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
                label="Pembelian Minimum"
                suffix="Buah"
                type="number"
                :rules="[requiredValidator]"
                placeholder="Tentukan pembelian minimum"
                class="mb-6"
              />
            </VCardText>
          </VCard>

          <div class="d-flex flex-wrap gap-4 justify-end">
            <VBtn type="submit">
              Simpan
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

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
