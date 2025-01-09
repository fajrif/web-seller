<script setup>
import notFoundImg from '@images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const isAddProductFeaturedDialogVisible = ref(false)

const { data: featuredData, execute: fetchFeatured } = await useApiCore("/seller/query/product/merchant?is_featured_product=true&page=1")

const featuredProducts = computed(() => featuredData.value.data.data)

const addFeatured = async ids => {
  try {
    console.log(ids)
    let _ids = ids

    /* eslint-disable camelcase */
    const res = await $apiCore("/seller/command/product/featured/edit", {
      method: 'POST',
      body: { product_feature: ids },
      onResponseError({ response }) {
        console.log(response)
        throw response._data.message
      },
    })
    /* eslint-enable */

    // Refetch products
    fetchFeatured()
    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', error)
    console.error("Error on add product featured:", error)
  }
}

const deleteFeatured = async id => {
  messageStore.setMessage('error', 'Gagal menghapus produk unggulan')

  // try {
  // 	await $apiCore(`/merchant/products/${id}/delete-featured`, { method: 'DELETE' });

  // 	// Refetch products
  // 	fetchFeatured()
  // 	messageStore.setMessage('success', 'Produk unngulan berhasil dihapus')
  // } catch (error) {
  // 		messageStore.setMessage('error', 'Gagal menghapus produk unggulan')
  // 		console.error("Error on delete featured product data:", error);
  // }
}


const addItem = () => {
  isAddProductFeaturedDialogVisible.value = true
}

const toCurrency = price => {
  let _price = price
  if (typeof value !== "number") {
    _price
  }
  var formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })
  
  return formatter.format(parseInt(price))
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
              @click="addItem"
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
            <VTable
              v-if="featuredProducts.length > 0"
              class="text-no-wrap"
            >
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
                        :image="product.product_photo[0].url"
                      />
                      <div class="d-flex flex-column">
                        <h4 class="fw-500">
                          {{ product.name }}
                        </h4>
                        <p class="text-body-2 mb-0">
                          {{ product.condition }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {{ toCurrency(product.price) }}
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
                    Anda sekarang belum memiliki produk unggulan. Silahkan pilih produk-produk yang ingin anda tampilkan sebagai <strong>Produk Unggulan</strong> di toko anda.
                  </p>
                  <VBtn
                    color="primary"
                    style="width:fit-content"
                    prepend-icon="tabler-plus"
                    @click="addItem"
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
