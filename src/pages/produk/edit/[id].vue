<script setup>
import addBannerImg from '@images/misc/add-banner.png'
import notFoundImg from '@images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'
import '@cholakovdev/vue3-treeselect/dist/vue3-treeselect.css'

const messageStore = useMessageStore()
const router = useRouter()
const route = useRoute('produk-edit-id')

const isUploadImageDialogVisible = ref(false)
const	imageAttr = {
	title: "Upload Gambar Produk",
	description: "Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG",
	params: {
		type: 'product'
	},
}

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

const categories = computed(() => sanitizeNullChilds(categoriesData.value.data))
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

    messageStore.setMessage('success', 'Data produk berhasil diubah')
  } catch (error) {
    messageStore.setMessage('error', 'Gagal mengubah data produk')
    console.error("Error on posting product data:", error)
  }
}

const savingProduct = () => {
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

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
			savingProduct()
    }
  })
}

const deleteImage = (index) => {
  // Delete from product urls
	if (index !== -1) {
    productPhotoUrl.value.splice(index, 1)
		savingProduct()
	}
}

const openImageDialog = () => {
  isUploadImageDialogVisible.value = true
}

const uploadProductPhoto = async (path) => {
	if (path !== '') {
		// add to product urls here...
		productPhotoUrl.value.push(path)
		savingProduct()
	} else {
    messageStore.setMessage('error', 'URL path gambar kosong')
	}
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
        <VCol cols="12">
          <!-- 👉 Product Information -->
          <VCard
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
									<AppTreeSelect
                    v-model="productCategory"
                    :rules="[requiredValidator]"
										:searchable="false"
										:multiple="false"
										open-direction="below"
										:show-count="true"
										:disable-branch-nodes="true"
                    label="Kategori"
                    placeholder="Pilih Kategori"
                    :options="categories"
										:normalizer="normalizerCategories"
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
                <VCol
                  cols="12"
                  md="6"
                >
									<div class="d-flex flex-raw align-center justify-start">
										<span class="fw-700 me-4">Produk Unggulan</span>
										<VSwitch
											v-model="productFeatured"
											density="compact"
											/>
									</div>
                </VCol>

                <VCol cols="12">
									<p class="fw-700 mb-2">Deskripsi Produk</p>
                  <ProductDescriptionEditor
                    v-model="productDescription"
                    placeholder="Masukan informasi dan detil deskripsi produk anda"
                    class="border rounded"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
				</VCol>
        <VCol
          md="6"
          cols="12"
        >
          <!-- 👉 Pricing -->
          <VCard
            title="Harga"
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
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          md="6"
          cols="12"
        >
          <!-- 👉 Stock -->
          <VCard
            title="Pengelolaan"
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
        </VCol>
				<VCol cols="12">
					<!-- 👉 Ukuran Paket -->
					<VCard
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
				<VCol cols="12">
					<div class="d-flex flex-wrap gap-4 justify-end">
						<VBtn type="submit">
							Simpan
						</VBtn>
					</div>
				</VCol>

				<VCol cols="12">
          <!-- 👉 Media -->
          <VCard title="Gambar Produk">
            <VCardText>
							<div
								v-if="productPhotoUrl && productPhotoUrl.length > 0"
								class="d-flex justify-center align-center gap-3 flex-wrap"
							>
								<VRow class="match-height w-100">
									<template
										v-for="(url, index) in productPhotoUrl"
										:key="index"
									>
										<VCol
											cols="6"
											md="2"
										>
											<VCard :ripple="false">
												<VCardText class="d-flex flex-column pa-2">
													<VImg
														rounded
														:src="url"
														class="w-100 mx-auto"
													/>
												</VCardText>
												<VCardActions>
													<VBtn
														size="small"
														variant="tonal"
														color="error"
														block
														@click.stop="deleteImage(index)"
													>
														Hapus
													</VBtn>
												</VCardActions>
											</VCard>
										</VCol>
									</template>
										<VCol
											cols="6"
											md="2"
										>
											<VCard :ripple="false">
												<VCardText class="d-flex flex-column px-2 pt-4 pb-2">
													<VImg
														rounded
														:src="addBannerImg"
														class="w-100 mx-auto"
													/>
												</VCardText>
												<VCardActions>
													<VBtn
														size="small"
														variant="flat"
														color="primary"
														block
														@click="openImageDialog"
													>
														Tambah
													</VBtn>
												</VCardActions>
											</VCard>
										</VCol>
								</VRow>
							</div>

							<!-- 👉 Empty banners -->
							<div v-else class="d-flex justify-center align-center px-10 py-15 border border-radius-8">
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
											Anda belum menambahkan gambar untuk produk anda. Silahkan menambahkan gambar produk anda
										</p>
										<VBtn
											color="primary"
											style="width:fit-content"
											prepend-icon="tabler-plus"
											@click="openImageDialog"
										>
											Tambah Gambar
										</VBtn>
									</div>
								</div>
							</div>
            </VCardText>
          </VCard>
        </VCol>

      </VRow>
    </VForm>
    <UploadCropStencilImageDialog
      v-model:is-dialog-visible="isUploadImageDialogVisible"
      v-model:title="imageAttr.title"
      v-model:description="imageAttr.description"
      v-model:params="imageAttr.params"
      @form-submitted="uploadProductPhoto"
    />
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
