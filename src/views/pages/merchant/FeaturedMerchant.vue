<script setup>
import notFoundImg from '@/assets/images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const isAddProductFeaturedDialogVisible = ref(false)

const { data: featuredData, execute: fetchFeatured } = await useApiRails("/merchant/products/featured")

const featuredProducts = computed(() => featuredData.value.products)

const deleteFeatured = async id => {
	try {
		await $apiRails(`/merchant/products/${id}/delete-featured`, { method: 'DELETE' });

		// Refetch products
		fetchFeatured()
		messageStore.setMessage('success', 'Produk unngulan berhasil dihapus')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menghapus produk unggulan')
			console.error("Error on delete featured product data:", error);
	}
}

const addFeatured = async (ids) => {
	try {
		let _ids = ids
		await $apiRails("/merchant/products/add-featured", {
			method: 'POST',
			body: { product: { ids: _ids } },
		});

		// Refetch products
		fetchFeatured()
		messageStore.setMessage('success', 'Produk berhasil ditambahkan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menambahkan produk')
			console.error("Error on add product featured:", error);
	}
}

const addItem = () => {
  isAddProductFeaturedDialogVisible.value = true
}

</script>

<template>
  <div>
		<VCard>
			<!-- 👉 Header  -->
			<VCardItem class="py-3">
				<VCardTitle>Produk Unggulan</VCardTitle>
				<template #append>
					<div>
						<VBtn
							color="primary"
							style="width:fit-content"
							prepend-icon="tabler-plus"
							@click="addItem()"
							>
							Tambah Produk
						</VBtn>
					</div>
				</template>
			</VCardItem>
			<VCardText>
				<VRow>
					<!-- 👉 Featured Products	-->
					<VCol cols="12">
						<VTable v-if="featuredProducts.length > 0" class="text-no-wrap">
							<thead>
								<tr>
									<th>
										Produk
									</th>
									<th>
										Harga
									</th>
									<th>
										Hapus
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="product in featuredProducts"
									:key="product.id"
									>
									<td>
										<div class="d-flex align-center">
											<VAvatar
												size="50"
												variant="tonal"
												class="my-2 me-2"
												rounded
												:image="product.image"
												/>
											<div class="d-flex flex-column">
												<h4 class="fw-500">{{ product.name }}</h4>
												<p class="text-body-2 mb-0">
													{{ product.sku_no }}
												</p>
											</div>
										</div>
									</td>
									<td>
										{{ product.price_label }}
									</td>
									<td>
										<VBtn
											size="small"
											variant="tonal"
											color="error"
											@click="deleteFeatured(product.id)"
											>
											<VIcon icon="tabler-trash" />
										</VBtn>
									</td>
								</tr>
							</tbody>
						</VTable>
						<!-- 👉 Empty products -->
						<div v-else class="d-flex justify-center align-center pa-10 ma-10">
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
									<p class="text-body-2" style="width:400px">
										Anda sekarang belum memiliki produk unggulan. Silahkan pilih produk-produk yang ingin anda tampilkan sebagai <strong>Produk Unggulan</strong> di toko anda.
									</p>
									<VBtn
										color="primary"
										style="width:fit-content"
										prepend-icon="tabler-plus"
										@click="addItem()"
										>
										Tambah Produk
									</VBtn>
								</div>
							</div>
						</div>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
		<AddProductFeaturedSelectionDialog
			v-model:is-dialog-visible="isAddProductFeaturedDialogVisible"
      @form-submitted="addFeatured"
		/>
  </div>
</template>
