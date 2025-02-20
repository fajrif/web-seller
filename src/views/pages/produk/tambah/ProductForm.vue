<script setup>
import { reactive } from 'vue'
import { useMessageStore } from '@core/stores/config'
import { useUserDataStore } from '@core/stores/config'
import '@cholakovdev/vue3-treeselect/dist/vue3-treeselect.css'

const userData = useUserDataStore()
const messageStore = useMessageStore()
const router = useRouter()

const isUploadImageDialogVisible = ref(false)
const	imageAttr = {
	title: "Upload Gambar Produk",
	description: "Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG",
	params: {
		type: 'product'
	},
}

const loading = ref(false)
const refForm = ref()
const dirtyForm = ref(false)
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
const	productPhotoUrl = ref([])

const { data: categoriesData, execute: fetchCategories } = await useApiCore(createUrl('/seller/query/category/all'))
const { data: showcasesData, execute: fetchShowcases } = await useApiCore(createUrl('/seller/query/etalase'))

const { data: featuredData, execute: fetchFeatured } = await useApiCore("/seller/query/product/featured?page=1")

const categories = computed(() => sanitizeNullChilds(categoriesData.value.data))
const showcases = computed(() => showcasesData.value.etalase)
const totalFeatured = computed(() => featuredData.value.data.total)

const saveProduct = async productData => {
  try {
    const res = await $apiCore('/seller/command/product/create', {
      method: 'POST',
      body: productData,
      onResponseError({ response }) {
				loading.value = false
        messageStore.setMessage('error', response._data.message)
      },
    })

    await nextTick(() => {
			loading.value = false
			messageStore.setMessage('success', 'Data produk berhasil disimpan')
			router.push('/produk/semua')
		})
  } catch (error) {
		loading.value = false
    messageStore.setMessage('error', 'Gagal menyimpan data produk')
    console.error("Error on posting product data:", error)
  }
}

const savingProduct = () => {
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
		url: productPhotoUrl.value,
	})
	/* eslint-enable */
}

const onSubmit = () => {
	loading.value = true
	refForm.value?.validate().then(({ valid }) => {
		if (valid) {
			dirtyForm.value = false
			if(productPhotoUrl.value.length >= 1) {
				setTimeout(() => {
					savingProduct()
				}, 1000)
			} else {
				loading.value = false
				messageStore.setMessage('error', 'Produk minimal ada 1 gambar')
			}
		} else {
			loading.value = false
			messageStore.setMessage('error', 'Gagal simpan data produk')
		}
	})
}

const deleteImage = (index) => {
  // Delete from product urls
	if (index !== -1) {
    productPhotoUrl.value.splice(index, 1)
		dirtyForm.value = true
	}
}

const openImageDialog = () => {
  isUploadImageDialogVisible.value = true
}

const uploadProductPhoto = async (path) => {
	if (path !== '') {
		// add to product urls here...
		productPhotoUrl.value.push(path)
		dirtyForm.value = true
	} else {
    messageStore.setMessage('error', 'URL path gambar kosong')
	}
}

const somethingChanged = () => {
	dirtyForm.value = true
}

// When the user leave the page in your Vue app
onBeforeRouteLeave((to, from, next) => {
	if(dirtyForm.value){
		const answer = window.confirm('Apakah Anda yakin ingin keluar dari halaman ini? Data yang sudah Anda masukkan akan hilang')
    if (answer) {
      return next()
    } else {
			// cancel the navigation and stay on the same page
      return next(false)
    }
  }
  return next()
});

const onChangeFeatured = async () => {
	loading.value = true
	if(productFeatured.value === true) {
		if(totalFeatured.value >= 5) {
			messageStore.setMessage('error', 'Produk Unggulan sudah mencapai batas max:5')
			productFeatured.value = false
		}
	}
	loading.value = false
}

// When the user refresh/leave the current tab
useEventListener(window, "beforeunload", (event) => {
	if(dirtyForm.value){
		event.preventDefault();
	}
});
</script>

<template>
  <div>
    <!-- 👉 Form -->
    <VForm
      ref="refForm"
			@change="somethingChanged"
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
                    :rules="[requiredValidator, alphaDashValidator]"
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
									class="d-flex align-center"
                >
									<div class="d-flex flex-raw align-center justify-start mt-20">
										<span class="fw-700 me-4">Produk Unggulan</span>
										<VSwitch
											v-model="productFeatured"
											:loading="loading"
											density="compact"
											@update:model-value="onChangeFeatured"
											/>
									</div>
                </VCol>

                <VCol cols="12">
									<AppTextarea
										v-model="productDescription"
										:rules="[requiredValidator,lineBreaksValidator,minLengthValidator(productDescription,100)]"
										counter
										label="Deskripsi Produk"
										placeholder="Masukan informasi dan detil deskripsi produk anda"
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
              <AppCurrencyInput
                v-model="productPrice"
                label="Harga Satuan"
                :rules="[requiredValidator, minIntegerValidator(productPrice,1)]"
                placeholder="Masukan harga jual"
                class="mb-6"
              />
							<!-- 👉 MDR Component -->
              <MdrDisplay v-model="productPrice" />

              <AppCurrencyInput
                v-model="productStrikePrice"
                label="Harga Coret"
                :rules="[requiredValidator, minIntegerValidator(productStrikePrice,productPrice)]"
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
                :rules="[requiredValidator,integerValidator,betweenValidator(productStock,1,9999)]"
                label="Stock"
                suffix="Buah"
                type="number"
								min="1"
                placeholder="Tentukan jumlah stock"
                class="mb-6"
              />
              <AppTextField
                v-model="productMinPurchase"
                label="Pembelian Minimum"
                suffix="Buah"
                type="number"
								min="1"
								max="9999"
								:rules="[requiredValidator,integerValidator,betweenValidator(productMinPurchase,1,9999)]"
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
										:rules="[requiredValidator,integerValidator,minIntegerValidator(productWeight,10)]"
										label="Berat"
										suffix="gr"
										type="number"
										min="10"
										placeholder="0"
										/>
								</VCol>
								<VCol
									cols="12"
									md="6"
									>
									<AppTextField
										v-model="productWidth"
										:rules="[requiredValidator,integerValidator,minIntegerValidator(productWidth,10)]"
										label="Lebar"
										suffix="cm"
										type="number"
										min="10"
										placeholder="0"
										/>
								</VCol>

								<VCol
									cols="12"
									md="6"
									>
									<AppTextField
										v-model="productLength"
										:rules="[requiredValidator,integerValidator,minIntegerValidator(productLength,10)]"
										label="Panjang"
										suffix="cm"
										type="number"
										min="10"
										placeholder="0"
										/>
								</VCol>
								<VCol
									cols="12"
									md="6"
									>
									<AppTextField
										v-model="productHeight"
										:rules="[requiredValidator,integerValidator,minIntegerValidator(productHeight,10)]"
										label="Tinggi"
										suffix="cm"
										type="number"
										min="10"
										placeholder="0"
										/>
								</VCol>
							</VRow>
						</VCardText>
					</VCard>
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
													<div class="d-flex flex-column justify-center align-center border-dashed-primary border-radius-8 py-6">
														<IconBtn
															color="primary"
															variant="tonal"
															class="rounded-sm my-4"
															@click.stop="openImageDialog"
															>
															<VIcon icon="tabler-photo-up" />
														</IconBtn>
														<span class="text-sm text-primary">Tambah Gambar</span>
													</div>
												</VCardText>
												<VCardActions>
													<VBtn
														size="small"
														variant="flat"
														color="primary"
														block
														@click.stop="openImageDialog"
													>
														Tambah
													</VBtn>
												</VCardActions>
											</VCard>
										</VCol>
								</VRow>
							</div>
							<!-- 👉 Empty banners -->
							<template v-else>
								<EmptyData
									description="Anda belum menambahkan gambar untuk produk anda.<br/> Silahkan menambahkan gambar produk anda"
									wrapper-class="px-10 py-15"
									btn-text="Tambah Gambar"
									@click-button="openImageDialog"
									/>
							</template>
            </VCardText>
          </VCard>
        </VCol>
				<VCol cols="12">
					<div class="d-flex flex-wrap gap-4 justify-end">
						<VBtn
							:disabled="loading"
							:loading="loading"
							type="submit"
							class="w-100 w-md-auto"
							>
							Simpan
						</VBtn>
					</div>
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
