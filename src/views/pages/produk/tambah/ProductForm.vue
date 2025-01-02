<script setup>
import { reactive } from 'vue';

const valid = false
const router = useRouter()

const productData = reactive({
	name: '',
	description: '',
	category_id: '',
	showcase_id: '',
	condition: '',
	price: '',
	fake_price: '',
	stock: '',
	min_purchase: '',
	weight: '',
	height: '',
	width: '',
	length: '',
	featured: '',
	status: '',
})

const statusProduct = [
	{
			id: 0,
			name: "Arsip"
	},
	{
			id: 1,
			name: "Dijual"
	},
	{
			id: 2,
			name: "Non-Aktif"
	},
	{
			id: 3,
			name: "Ditolak"
	},
]
const conditionProduct = [
	{
			id: 0,
			name: "Bekas / Lama"
	},
	{
			id: 1,
			name: "Baru"
	},
]

const { data: categoriesData, execute: fetchCategories } = await useApiRails(createUrl('/categories'))
const { data: showcasesData, execute: fetchShowcases } = await useApiRails(createUrl('/merchant/showcases'))

const categories = computed(() => categoriesData.value)
const showcases = computed(() => showcasesData.value)

const saveProduct = async () => {
	try {
			const newProduct = {
				name: productData.name,
				description: productData.description,
				category_id: productData.category_id,
				showcase_id: productData.showcase_id,
				condition: productData.condition,
				price: productData.price,
				fake_price: productData.fake_price,
				stock: productData.stock,
				min_purchase: productData.min_purchase,
				weight: productData.weight,
				height: productData.height,
				width: productData.width,
				length: productData.length,
				featured: productData.featured,
				status: productData.status,
			}

			await $apiRails('/merchant/products', {
				method: 'POST',
				body: { product: newProduct },
			})

			router.push('/produk/semua');
	} catch (error) {
			console.error("Error on posting data:", error);
	}
}
</script>

<template>
  <div>
		<!-- 👉 Form -->
		<VForm
			v-model="valid"
			@submit.prevent="saveProduct"
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
										v-model="productData.name"
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
										v-model="productData.category_id"
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
										v-model="productData.showcase_id"
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
										v-model="productData.status"
										placeholder="Pilih Status"
										label="Status"
										:items="statusProduct"
										/>
								</VCol>
								<VCol
									cols="12"
									md="6"
								>
									<AppSelect
										v-model="productData.condition"
										placeholder="Pilih Kondisi"
										label="Kondisi"
										:items="conditionProduct"
										/>
								</VCol>

								<VCol>
									<span class="mb-1">Deskripsi Produk</span>
									<ProductDescriptionEditor
										v-model="productData.description"
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
										v-model="productData.weight"
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
										v-model="productData.width"
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
										v-model="productData.length"
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
										v-model="productData.height"
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
								v-model="productData.price"
								label="Harga Satuan"
								prefix="Rp"
								type="number"
								:rules="[requiredValidator]"
								placeholder="Masukan harga jual"
								class="mb-6"
							/>
							<AppTextField
								v-model="productData.fake_price"
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
									v-model="productData.featured"
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
								v-model="productData.stock"
								label="Stock"
								suffix="Buah"
								type="number"
								placeholder="Tentukan jumlah stock"
								class="mb-6"
							/>
							<AppTextField
								v-model="productData.min_purchase"
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
