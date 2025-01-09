<script setup>
import notFoundImg from '@images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const userData = useCookie('userData')
const messageStore = useMessageStore()

const isAddEtalaseDialogVisible = ref(false)
const isEditEtalaseDialogVisible = ref(false)
const isDeleteEtalaseDialogVisible = ref(false)

const newEtalaseId = ref(0)
const etalaseId = ref(0)
const etalaseName = ref('')
const etalaseJmlProduk = ref(0)

const { data: dataShowcases, execute: fetchShowcases } = await useApiCore("/seller/query/etalase")

const showcasesData = computed(() => dataShowcases.value.etalase)

const addShowcase = async (id, name) => {
  try {
    /* eslint-disable camelcase */
    const res = await $apiCore("/seller/command/etalase/store", {
      method: 'POST',
      body: {
        merchant_id: userData.value.id,
        name: name,
      },
    })
    /* eslint-enable */

    // Refetch showcases
    fetchShowcases()
    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menambahkan etalase')
    console.error("Error on add merchant showcase:", error)
  }
}

const updateShowcase = async (id, name) => {
  try {
    const res = await $apiCore(`/seller/command/etalase/update/${id}`, {
      method: 'POST',
      body: { name: name },
    })

    // Refetch showcases
    fetchShowcases()
    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal update etalase')
    console.error("Error on add merchant showcase:", error)
  }
}

const deleteShowcase = async id => {
  try {
    const res = await $apiCore(`/seller/command/etalase/delete/${id}`, { method: 'DELETE' })

    // Refetch showcases
    fetchShowcases()
    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal menghapus etalase')
    console.error("Error on delete showcase data:", error)
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
              @click="addItem"
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
            <VTable
              v-if="showcasesData.length > 0"
              class="text-no-wrap"
            >
              <thead>
                <tr>
                  <th>
                    Nama Etalase
                  </th>
                  <th class="text-center">
                    Jumlah Produk
                  </th>
                  <th class="text-center" />
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
                    {{ item.total_product }}
                  </td>
                  <td class="text-center">
                    <div
                      v-if="item.id != 1"
                      class="d-flex justify-center flex-wrap gap-2"
                    >
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
                        @click="deleteItem(item.id,item.name,item.total_product)"
                      >
                        <VIcon icon="tabler-trash" />
                      </VBtn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </VTable>
            <!-- 👉 Empty products -->
            <div
              v-else
              class="d-flex justify-center align-center pa-10 ma-10"
            >
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
                    style="width:400px"
                  >
                    Anda sekarang belum memiliki etalase toko. Silahkan tambahkan etalase toko anda.
                  </p>
                  <VBtn
                    color="primary"
                    style="width:fit-content"
                    prepend-icon="tabler-plus"
                    @click="addItem"
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
