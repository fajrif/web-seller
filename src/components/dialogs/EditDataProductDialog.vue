<script setup>
import { useFileUploadProductStore } from '@core/stores/config'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  itemId: {
    type: Number,
    required: true,
		default: -1
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const productStore = useFileUploadProductStore()
const { data: categoriesData, execute: fetchCategories } = await useApiCore(createUrl('/seller/query/category/all'))
const { data: showcasesData, execute: fetchShowcases } = await useApiCore(createUrl('/seller/query/etalase'))

const categories = computed(() => sanitizeNullChilds(categoriesData.value.data))
const showcases = computed(() => showcasesData.value.etalase)

const defaultItem = {
	id: -1,
	image_url: '',
	nama_produk: '',
	deskripsi: '',
	id_kategori: '',
	kode_etalase: '',
	kondisi: '',
	harga: -1,
	harga_coret: -1,
	stok: -1,
	minimum_pembelian: -1,
	berat: -1,
	tinggi: -1,
	lebar: -1,
	panjang: -1,
}

const productTab = ref('product-tab-1')
const refForm = ref()
const editedItem = ref(defaultItem)
const errorMessage = ref(false)

const onSubmit = () => {
	// do something here ...
  refForm.value?.validate().then(({ valid, errors }) => {
		errorMessage.value = !valid
    if (valid) {
			// this need to be fixed
			var id = editedItem.value.id
			var index = productStore.products.findIndex(p => p.id === id);
			var item = productStore.products[index]
			editedItem.value.image_url = item.image_url
			productStore.products[index] = { ...editedItem.value, ...productStore.validate(editedItem.value) }
      emit('formSubmitted', id)
			onReset()
		}
  })
}

const onReset = () => {
  emit('update:isDialogVisible', false)
	productTab.value = 'product-tab-1'
}

watch(() => props.itemId, (val) => {
	var item = productStore.products.find(p => p.id === val)
	if(item && typeof item === 'object'){
		editedItem.value = { ...item }
		errorMessage.value = !editedItem.value.status
		// skip if only image_url blank
		if(item.errors.length == 1){
			if(item.errors[0].indexOf('image_url') !== -1){
				errorMessage.value = !errorMessage.value
			}
		}
	}
})
</script>

<template>
  <!-- 👉 Edit Dialog  -->
  <VDialog
    persistent
    max-width="600px"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />
    <VCard title="Ubah Data">
			<VAlert v-show="errorMessage" color="error" style="border-radius:0;">
				Data produk masih ada yang salah harap lakukan perbaikan
			</VAlert>
			<VForm
				ref="refForm"
				@submit.prevent="onSubmit"
			>
			<VTabs v-model="productTab">
				<VTab value="product-tab-1">Informasi Produk</VTab>
				<VTab value="product-tab-2">Harga</VTab>
				<VTab value="product-tab-3">Stock</VTab>
				<VTab value="product-tab-4">Dimensi Produk</VTab>
			</VTabs>
      <VCardText>
				<VWindow v-model="productTab">
					<VWindowItem value="product-tab-1" :eager="true">
						<VRow>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.nama_produk"
									:rules="[requiredValidator,alphaDashValidator]"
									label="Nama Produk"
									placeholder="Masukan nama barang anda"
									/>
							</VCol>
							<VCol
								cols="12"
								md="6"
								>
								<AppTreeSelect
									v-model="editedItem.id_kategori"
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
									v-model="editedItem.kode_etalase"
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
									v-model="editedItem.kondisi"
									:rules="[requiredValidator]"
									placeholder="Pilih Kondisi"
									label="Kondisi"
									:items="conditionProduct"
									item-title="name"
									item-value="name"
									/>
							</VCol>

							<VCol cols="12">
								<AppTextarea
									v-model="editedItem.deskripsi"
									:rules="[requiredValidator,lineBreaksValidator,minLengthValidator(editedItem.deskripsi,100)]"
									counter
									label="Deskripsi Produk"
									placeholder="Tambahkan detil informasi produk"
									/>
							</VCol>
						</VRow>
					</VWindowItem>
					<VWindowItem value="product-tab-2" :eager="true">
						<VRow>
							<VCol cols="12">
								<AppCurrencyInput
									v-model="editedItem.harga"
									label="Harga"
									:rules="[requiredValidator, minIntegerValidator(editedItem.harga,1)]"
									placeholder="Masukan harga jual satuan"
								/>
							</VCol>
							<VCol cols="12">
								<AppCurrencyInput
									v-model="editedItem.harga_coret"
									label="Harga Coret"
									:rules="[requiredValidator, minIntegerValidator(editedItem.harga_coret,editedItem.harga)]"
									placeholder="Masukan harga coret"
								/>
							</VCol>
						</VRow>
					</VWindowItem>
					<VWindowItem value="product-tab-3" :eager="true">
						<VRow>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.stok"
									:rules="[requiredValidator,integerValidator,betweenValidator(editedItem.stok,1,9999)]"
									label="Stock"
									suffix="Buah"
									type="number"
									min="1"
									max="9999"
									placeholder="Tentukan jumlah stock"
								/>
							</VCol>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.minimum_pembelian"
									label="Pembelian Minimum"
									suffix="Buah"
									type="number"
									min="1"
									max="9999"
									:rules="[requiredValidator,integerValidator,betweenValidator(editedItem.minimum_pembelian,1,9999)]"
									placeholder="Tentukan pembelian minimum"
								/>
							</VCol>
						</VRow>
					</VWindowItem>
					<VWindowItem value="product-tab-4" :eager="true">
						<VRow>
							<VCol
								cols="12"
								md="6"
								>
								<AppTextField
									v-model="editedItem.berat"
									:rules="[requiredValidator,integerValidator,minIntegerValidator(editedItem.berat,10)]"
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
									v-model="editedItem.lebar"
									:rules="[requiredValidator,integerValidator,minIntegerValidator(editedItem.lebar,10)]"
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
									v-model="editedItem.panjang"
									:rules="[requiredValidator,integerValidator,minIntegerValidator(editedItem.panjang,10)]"
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
									v-model="editedItem.tinggi"
									:rules="[requiredValidator,integerValidator,minIntegerValidator(editedItem.tinggi,10)]"
									label="Tinggi"
									suffix="cm"
									type="number"
									min="10"
									placeholder="0"
									/>
							</VCol>
						</VRow>
					</VWindowItem>
				</VWindow>
      </VCardText>
      <VCardText>
        <div class="self-align-end d-flex gap-4 justify-end">
          <VBtn
            color="warning"
            variant="outlined"
            @click="onReset"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            type="submit"
          >
            Simpan
          </VBtn>
        </div>
      </VCardText>
			</VForm>
    </VCard>
  </VDialog>
</template>
