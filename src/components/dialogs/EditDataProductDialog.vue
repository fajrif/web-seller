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

const onSubmit = () => {
	// do something here ...
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('formSubmitted', props.itemId)
			productStore.products[props.itemId - 1] = { id: props.itemId, ...editedItem.value, ...productStore.validate(editedItem.value) }
			onReset()
    }
  })
}

const onReset = () => {
  emit('update:isDialogVisible', false)
	productTab.value = 'product-tab-1'
}

watch(() => props.itemId, (newVal, oldVal) => {
	var item = productStore.products.find(p => p.id === newVal)
	if(item && typeof item === 'object'){
		editedItem.value = { ...item }
	}
});
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
					<VWindowItem value="product-tab-1">
						<VRow>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.nama_produk"
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
					<VWindowItem value="product-tab-2">
						<VRow>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.harga"
									:rules="[requiredValidator,integerValidator]"
									label="Harga"
									type="number"
									placeholder="Tentukan harga"
									class="mb-6"
								/>
							</VCol>
							<VCol cols="12">
								<AppTextField
									v-model="editedItem.harga_coret"
									:rules="[requiredValidator,integerValidator]"
									label="Harga Coret"
									type="number"
									placeholder="Tentukan harga coret"
									class="mb-6"
								/>
							</VCol>
						</VRow>
					</VWindowItem>
					<VWindowItem value="product-tab-3">
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
									class="mb-6"
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
									class="mb-6"
								/>
							</VCol>
						</VRow>
					</VWindowItem>
					<VWindowItem value="product-tab-4">
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
