<script setup>
import { useFileUploadProductStore } from '@core/stores/config'
import { useMessageStore } from '@core/stores/config'

const userData = useCookie('userData')
const productStore = useFileUploadProductStore()
const messageStore = useMessageStore()

const loading = ref(false)
const isDeleteDataDialogVisible = ref(false)
const isSaveDataDialogVisible = ref(false)
const isEditDataDialogVisible = ref(false)
const triggerReset = ref(false)
const itemId = ref(-1)

const products = computed(() => productStore.products)
const totalProducts = computed(() => productStore.products.length)

const saveProduct = async (productData, id) => {
  try {
		console.log(productData)
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
    messageStore.setMessage('error', 'Gagal menyimpan data produk')
    console.error("Error on posting product data:", error)
  }
}

const savingProduct = (id) => {
	var item = productStore.products.find(p => p.id === id)

	if(item !== null && typeof item === 'object') {
		/* eslint-disable camelcase */
		saveProduct({
			merchant_id: userData.value.id,
			name: item.nama_produk,
			description: item.deskripsi,
			category_id: parseInt(item.id_kategori),
			etalase_id: parseInt(item.kode_etalase),
			condition: item.kondisi,
			price: parseInt(item.harga),
			strike_price: parseInt(item.harga_coret),
			amount: parseInt(item.stok),
			minimum_purchase: parseInt(item.minimum_pembelian),
			weight: item.berat,
			height: item.tinggi,
			width: item.lebar,
			length: item.panjang,
			status: 9,
			url: [],
		}, id)
		/* eslint-enable */
	} else {
		loading.value = false
    messageStore.setMessage('error', 'Gagal menyimpan data produk')
	}
}

const editDataItem = id => {
  itemId.value = id
  isEditDataDialogVisible.value = true
}

const saveEditItem = (id) => {
	// do something here ...
	console.log('save edit item: ' + id)
}

const deleteItem = id => {
  itemId.value = id
  isDeleteDataDialogVisible.value = true
}

const deleteItemConfirm = id => {
	loading.value = true
  itemId.value = -1
	productStore.remove(id)
	if(totalProducts.value <= 0) {
		triggerReset.value = !triggerReset.value
	}
	loading.value = false
}

const saveItem = id => {
  itemId.value = id
  isSaveDataDialogVisible.value = true
}

const saveItemConfirm = id => {
	loading.value = true
  itemId.value = -1
	savingProduct(id)
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
					/>

				<div
					v-if="products && totalProducts > 0"
					class="border rounded">
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
	</div>
</template>

<style>
.v-table__wrapper thead > tr > th:nth-child(2) {
	min-width: 200px;
}
.v-table__wrapper thead > tr > th:last-child {
	min-width: 800px;
}
</style>
