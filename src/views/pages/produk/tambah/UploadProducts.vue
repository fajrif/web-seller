<script setup>
import avatar from '@images/misc/img-default.png'
import { useUserDataStore } from '@core/stores/config'
import { useFileUploadProductStore } from '@core/stores/config'
import { useMessageStore } from '@core/stores/config'

const userData = useUserDataStore()
const productStore = useFileUploadProductStore()
const messageStore = useMessageStore()

var successUpload = []
var dataUpload = []
const loading = ref(false)
const isDeleteDataDialogVisible = ref(false)
const isSaveDataDialogVisible = ref(false)
const isEditDataDialogVisible = ref(false)
const isUploadImageDialogVisible = ref(false)
const triggerReset = ref(false)
const triggerLoading = ref(false)
const itemId = ref()
const	imageAttr = {
	title: "Upload Gambar Produk",
	description: "Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG",
	params: {
		type: 'product'
	},
}

const products = computed(() => productStore.products)
const totalProducts = computed(() => productStore.products.length)

const saveProduct = async (productData, id) => {
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
			productStore.remove(id)
			messageStore.setMessage('success', 'Data produk berhasil disimpan')
		})
  } catch (error) {
		loading.value = false
		messageStore.setMessage('error', 'Gagal upload produk, Harap periksa kembali ID Kategori dan Kode Etalase')
    console.error("Error on posting product data:", error)
  }
}

const savingProduct = (id) => {
	loading.value = true
	var item = productStore.products.find(p => p.id === id)

	if(item !== null && typeof item === 'object') {
		if(item.status) {
			/* eslint-disable camelcase */
			saveProduct({
				merchant_id: userData.id,
				name: item.nama_produk,
				description: item.deskripsi,
				category_id: parseInt(item.id_kategori),
				etalase_id: parseInt(item.kode_etalase),
				condition: item.kondisi,
				price: parseInt(item.harga),
				strike_price: parseInt(item.harga_coret),
				amount: parseInt(item.stok),
				minimum_purchase: parseInt(item.minimum_pembelian),
				weight: item.berat.toString(),
				height: item.tinggi.toString(),
				width: item.lebar.toString(),
				length: item.panjang.toString(),
				url: [item.image_url],
			}, id)
			/* eslint-enable */
		} else {
			loading.value = false
			messageStore.setMessage('error', 'Data produk masih salah')
		}
	} else {
		loading.value = false
		messageStore.setMessage('error', 'Gagal upload produk, Harap periksa kembali ID Kategori dan Kode Etalase')
	}
}

const checkUploadProducts = (id, status) => {
	if(status){
		productStore.remove(id)
		successUpload.push(id)
	}
	if(dataUpload.length === 0){
		loading.value = false
		triggerLoading.value = !triggerLoading.value
		if(successUpload.length > 0) {
			messageStore.setMessage('success', `Berhasil upload ${successUpload.length} produk`)
		} else {
			messageStore.setMessage('error', 'Gagal upload produk, Harap periksa kembali ID Kategori dan Kode Etalase')
		}
		successUpload = []
	} else {
		simpanProduct(dataUpload[0])
	}
}

const simpanProduct = async (id) => {
  try {
		dataUpload = dataUpload.filter((i) => i !== id)
		var item = productStore.products.find(p => p.id === id)

		var productData = {
			merchant_id: userData.id,
			name: item.nama_produk,
			description: item.deskripsi,
			category_id: parseInt(item.id_kategori),
			etalase_id: parseInt(item.kode_etalase),
			condition: item.kondisi,
			price: parseInt(item.harga),
			strike_price: parseInt(item.harga_coret),
			amount: parseInt(item.stok),
			minimum_purchase: parseInt(item.minimum_pembelian),
			weight: item.berat.toString(),
			height: item.tinggi.toString(),
			width: item.lebar.toString(),
			length: item.panjang.toString(),
			url: [item.image_url],
		}

    await $apiCore('/seller/command/product/create', {
      method: 'POST',
      body: productData
    })

    await nextTick(() => {
			checkUploadProducts(id, true)
		})
  } catch (error) {
    console.error("Error on posting product data:", error)
		checkUploadProducts(id, false)
  }
}

const uploadAll = (value) => {
	loading.value = true
	successUpload = []
	dataUpload = []
	if(value){
		dataUpload = productStore.products.filter((i) => i.status === true).map(i => i.id)
		if(dataUpload.length > 0){
			simpanProduct(dataUpload[0])
		} else {
			loading.value = false
			triggerLoading.value = !triggerLoading.value
			messageStore.setMessage('error', 'Data produk masih salah')
		}
	} else {
		loading.value = false
		triggerLoading.value = !triggerLoading.value
    messageStore.setMessage('error', 'Data Kosong')
	}
}

const editDataItem = (id) => {
  itemId.value = id
  isEditDataDialogVisible.value = true
}

const saveEditItem = (id) => {
	// do something here ...
	// console.log('save edit item: ' + id)
}

const deleteItem = (id) => {
  itemId.value = id
  isDeleteDataDialogVisible.value = true
}

const deleteItemConfirm = (id) => {
	loading.value = true
	productStore.remove(id)
	if(totalProducts.value <= 0) {
		triggerReset.value = !triggerReset.value
	}
	loading.value = false
}

const saveItem = (id) => {
  itemId.value = id
  isSaveDataDialogVisible.value = true
}

const saveItemConfirm = (id) => {
	savingProduct(id)
}

const openImageDialog = (id) => {
  itemId.value = id
  isUploadImageDialogVisible.value = true
}

const uploadProductPhoto = async (path) => {
	if (path !== '') {
		// add to product urls here...
		var id = itemId.value
		var index = productStore.products.findIndex(p => p.id === id);
		var item = productStore.products[index]
		if(item){
			item.image_url = path
			delete item['status']
			delete item['errors']
			productStore.products[index] = { ...item, ...productStore.validate(item) }
		}
	} else {
    messageStore.setMessage('error', 'Gagal upload gambar')
	}
}

const computedMoreList = computed(() => {
  return paramId => [
    {
      title: 'Ubah',
      value: 'edit',
			onClick: () => {
				editDataItem(paramId)
			},
    },
    {
      title: 'Upload',
      value: 'upload',
			onClick: () => {
				saveItem(paramId)
			},
    },
    {
      title: 'Hapus',
      value: 'remove',
			onClick: () => {
				deleteItem(paramId)
			},
    },
  ]
})
</script>

<template>
	<div>
		<VCard>
			<!-- 👉 Title -->
			<VCardItem class="pb-0">
				<VCardTitle>
					<h4 class="fw-500">
						Upload Produk
					</h4>
				</VCardTitle>
			</VCardItem>
			<!-- 👉 Upload products -->
			<VCardText>
				<FileUploadProductCard
					:trigger-reset="triggerReset"
					:trigger-loading="triggerLoading"
					@upload-all="uploadAll"
					/>
				<div
					v-if="products && totalProducts > 0"
					class="data-products-table border rounded">
					<VDataTable
						:headers="headersFileUpload"
						:items="products"
						:items-length="totalProducts"
						:loading="loading"
						class="text-no-wrap"
						>

						<!-- status -->
						<template #item.status="{ item }">
							<MoreBtn
								:menu-list="computedMoreList(item.id)"
								item-props
								color="undefined"
								class="mx-2"
								/>
							<VTooltip v-if="item.status == false">
								<template #activator="{ props }">
									<VAvatar
										size="28"
										v-bind="props"
										color="error"
										variant="tonal"
										>
										<VIcon
											size="16"
											icon="tabler-info-circle"
											/>
									</VAvatar>
								</template>
								<p v-for="error in item.errors" class="mb-0">
									{{ error }}
								</p>
							</VTooltip>
							<VAvatar v-else
								size="28"
								color="success"
								variant="tonal"
								>
								<VIcon
									size="16"
									icon="tabler-check"
									/>
							</VAvatar>
						</template>

						<!-- Gambar	-->
						<template #item.image_url="{ item }">
							<VAvatar
								v-if="item.image_url !== null && item.image_url !== ''"
								size="50"
								variant="tonal"
								class="my-2"
								style="cursor:pointer;"
								rounded
								:image="item.image_url"
								@click="openImageDialog(item.id)"
								/>
							<VAvatar v-else
								size="50"
								variant="tonal"
								class="my-2"
								style="cursor:pointer;"
								rounded
								:image="avatar"
								@click="openImageDialog(item.id)"
								/>
						</template>

						<!-- harga -->
						<template #item.harga="{ item }">
							<span class="text-body-1 text-high-emphasis">{{ toCurrency(item.harga) }}</span>
						</template>

						<!-- harga_coret -->
						<template #item.harga_coret="{ item }">
							<span class="text-body-1 text-high-emphasis">{{ toCurrency(item.harga_coret) }}</span>
						</template>

						<!-- deskripsi -->
						<template #item.deskripsi="{ item }">
							<span class="text-body-1 text-high-emphasis">{{ truncateText(item.deskripsi, 20) }}</span>
						</template>
					</VDataTable>
				</div>
			</VCardText>
		</VCard>
    <SaveDataDialog
      v-model:is-dialog-visible="isSaveDataDialogVisible"
      v-model:item-id="itemId"
      @save-confirm="saveItemConfirm"
    />
    <DeleteDataDialog
      v-model:is-dialog-visible="isDeleteDataDialogVisible"
      v-model:item-id="itemId"
      @delete-confirm="deleteItemConfirm"
    />
    <EditDataProductDialog
      v-model:is-dialog-visible="isEditDataDialogVisible"
      v-model:item-id="itemId"
      @form-submitted="saveEditItem"
    />
    <UploadCropStencilImageDialog
      v-model:is-dialog-visible="isUploadImageDialogVisible"
      v-model:title="imageAttr.title"
      v-model:description="imageAttr.description"
      v-model:params="imageAttr.params"
      @form-submitted="uploadProductPhoto"
    />
	</div>
</template>

<style scoped>
:deep(.data-products-table) > .v-table .v-table__wrapper > table > tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, .02);
}
:deep(.data-products-table) > .v-table .v-table__wrapper > table > tbody tr:has(i.tabler-check) {
  background-color: aliceblue;
}
</style>
