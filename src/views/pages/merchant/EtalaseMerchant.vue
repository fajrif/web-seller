<script setup>
import notFoundImg from '@/assets/images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isAddEtalaseDialogVisible = ref(false)
const isEditEtalaseDialogVisible = ref(false)
const isDeleteEtalaseDialogVisible = ref(false)

const newEtalaseId = ref(0)
const etalaseId = ref(0)
const etalaseName = ref('')
const etalaseJmlProduk = ref(0)

const { data: showcasesData, execute: fetchShowcases } = await useApiRails("/merchant/showcases")

// const showcasesData = computed(() => dataShowcases.value)

const addShowcase = async (id, name) => {
	try {
		await $apiRails("/merchant/showcases", {
			method: 'POST',
			body: { showcase: { name: name } },
		});

		// Refetch showcases
		fetchShowcases()
		messageStore.setMessage('success', 'Etalase berhasil ditambahkan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menambahkan etalase')
			console.error("Error on add merchant showcase:", error);
	}
}

const updateShowcase = async (id, name) => {
	try {
		await $apiRails(`/merchant/showcases/${id}`, {
			method: 'PUT',
			body: { showcase: { name: name } },
		});

		// Refetch showcases
		fetchShowcases()
		messageStore.setMessage('success', 'Etalase berhasil ditambahkan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menambahkan etalase')
			console.error("Error on add merchant showcase:", error);
	}
}

const deleteShowcase = async id => {
	try {
		await $apiRails(`/merchant/showcases/${id}`, { method: 'DELETE' });

		// Refetch showcases
		fetchShowcases()
		messageStore.setMessage('success', 'Etalase berhasil dihapus')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal menghapus etalase')
			console.error("Error on delete showcase data:", error);
	}
}

const addItem = () => {
  isAddEtalaseDialogVisible.value = true
}

const editItem = (id, name) => {
  etalaseId.value = id
  etalaseName.value = name
  isEditEtalaseDialogVisible.value = true
}

const deleteItem = (id, name, jml) => {
  etalaseId.value = id
  etalaseName.value = name
  etalaseJmlProduk.value = jml
  isDeleteEtalaseDialogVisible.value = true
}

</script>

<template>
  <div>
		<VCard>
			<VCardItem class="py-3">
				<VCardTitle>Etalase Toko</VCardTitle>
				<template #append>
					<div>
						<VBtn
							color="primary"
							style="width:fit-content"
							prepend-icon="tabler-plus"
							@click="addItem()"
							>
							Tambah Etalase
						</VBtn>
					</div>
				</template>
			</VCardItem>
			<VCardText>
				<VRow>
					<!-- 👉 Etalase list data	-->
					<VCol cols="12">
						<VTable v-if="showcasesData.length > 0" class="text-no-wrap">
							<thead>
								<tr>
									<th>
										Nama Etalase
									</th>
									<th class="text-center">
										Jumlah Produk
									</th>
									<th class="text-center">
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="item in showcasesData"
									:key="item.id"
									>
									<td>
										<strong>{{ item.name }}</strong>
									</td>
									<td class="text-center">
										{{ item.products_size }}
									</td>
									<td class="text-center">
										<div v-if="item.id != 1" class="d-flex justify-center flex-wrap gap-2">
											<VBtn
												size="small"
												variant="tonal"
												color="secondary"
												@click="editItem(item.id,item.name)"
												>
												<VIcon icon="tabler-pencil" />
											</VBtn>
											<VBtn
												size="small"
												variant="tonal"
												color="error"
												@click="deleteItem(item.id,item.name,item.products_size)"
												>
												<VIcon icon="tabler-trash" />
											</VBtn>
										</div>
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
										Anda sekarang belum memiliki etalase toko. Silahkan tambahkan etalase toko anda.
									</p>
									<VBtn
										color="primary"
										style="width:fit-content"
										prepend-icon="tabler-plus"
										@click="addItem()"
										>
										Tambah Etalase
									</VBtn>
								</div>
							</div>
						</div>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
		<AddEditEtalaseDialog
			v-model:is-dialog-visible="isAddEtalaseDialogVisible"
			v-model:etalase-id="newEtalaseId"
      @form-submitted="addShowcase"
		/>
		<AddEditEtalaseDialog
			v-model:is-dialog-visible="isEditEtalaseDialogVisible"
			v-model:etalase-id="etalaseId"
			v-model:etalase-name="etalaseName"
      @form-submitted="updateShowcase"
		/>
		<DeleteEtalaseDialog
			v-model:is-dialog-visible="isDeleteEtalaseDialogVisible"
			v-model:etalase-id="etalaseId"
			v-model:etalase-name="etalaseName"
			v-model:etalase-jml-produk="etalaseJmlProduk"
      @form-submitted="deleteShowcase"
		/>
  </div>
</template>
