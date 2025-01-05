<script setup>
import notFoundImg from '@/assets/images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const route = useRoute('event-id')
const isAddProductDialogVisible = ref(false)
const isDeleteProductDialogVisible = ref(false)
const productId = ref(0)
const productName = ref('')

const { data: dataEvent, execute: fetchEvent } = await useApiRails(`/events/${ route.params.id }`)

const eventData = computed(() => dataEvent.value)

const deleteProduct = async id => {
	try {
		await $apiRails(`/events/${route.params.id}/delete/${id}`, { method: 'DELETE' });

		// Refetch products
		fetchEvent()
		messageStore.setMessage('success', 'Produk berhasil dihapus')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menghapus produk')
			console.error("Error on delete product data:", error);
	}
}

const addProducts = async (id, ids) => {
	try {
		let _ids = ids
		await $apiRails(`/events/${id}/add`, {
			method: 'POST',
			body: { product: { ids: _ids } },
		});

		// Refetch products
		fetchEvent()
		messageStore.setMessage('success', 'Produk berhasil ditambahkan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menambahkan produk')
			console.error("Error on add product event:", error);
	}
}

const addItem = () => {
  isAddProductDialogVisible.value = true
}

const deleteItem = (id, name) => {
  productId.value = id
  productName.value = name
  isDeleteProductDialogVisible.value = true
}

</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <div v-if="eventData" class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">
					{{ eventData.name }}
        </h4>
				<p class="text-body-1 text-medium-emphasis mb-0">
					Event dan Promo
				</p>
      </div>
      <div class="d-flex gap-4">
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
		<VCard>
			<VRow v-if="eventData">
				<!-- 👉 Event Data	-->
				<VCol cols="12">
					<VTable v-if="eventData.products.length > 0" class="text-no-wrap">
						<thead>
							<tr>
								<th>
									Produk Anda
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
								v-for="product in eventData.products"
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
										@click="deleteItem(product.id,product.name)"
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
									Anda sekarang belum memiliki produk untuk promo <strong>{{ eventData.name }}</strong>. Silahkan pilih produk-produk yang ingin anda tampilkan sebagai Produk Promo <strong>{{ eventData.name }}</strong> di toko anda.
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
			<!-- 👉 Empty Data -->
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
						<p class="text-body-2" style="width:350px">
							Maaf event yang anda cari tidak ditemukan. Silahkan coba beberapa saat lagi.
						</p>
						<VBtn
							color="primary"
							style="width:fit-content"
							@click="$router.push('/event')"
							>
							Lihat Event dan Promo
						</VBtn>
					</div>
				</div>
			</div>
		</VCard>
		<AddProductSelectionDialog
			v-model:is-dialog-visible="isAddProductDialogVisible"
			v-model:event-id="eventData.id"
			v-model:event-name="eventData.name"
      @form-submitted="addProducts"
		/>
		<DeleteProductDialog
			v-model:is-dialog-visible="isDeleteProductDialogVisible"
			v-model:product-id="productId"
			v-model:product-name="productName"
      @form-submitted="deleteProduct"
		/>
  </div>
</template>
