<script setup>
import notFoundImg from '@images/icons/ic-search.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const isAddProductFeaturedDialogVisible = ref(false)

const { data: featuredData, execute: fetchFeatured } = await useApiCore("/seller/query/product/featured?page=1")

const featuredProducts = computed(() => featuredData.value.data.data)

const addFeatured = async ids => {
  try {
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
  let updateSelectedIds = featuredProducts.value.map(item => {
    return {
      id: item.id,
      is_featured_product: item.id !== id,
    }
  })
  addFeatured(updateSelectedIds)

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
                  <th class="text-center">
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
                          <RouterLink :to="{ name: 'produk-view-id', params: { id: product.id } }">
                            {{ product.name }}
                          </RouterLink>
                        </h4>
                        <p class="text-body-2 mb-0">
                          {{ product.condition }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-body-1 text-high-emphasis">{{ toCurrency(product.price) }}</span>
                      <div v-if="product.strike_price && product.price < product.strike_price">
                        <span class="text-body-2 text-decoration-line-through me-1">{{ toCurrency(product.strike_price) }}</span>
                        <VChip
                          :label="false"
                          size="x-small"
                          color="error"
                        >
                          {{ calculateDiscount(product.price, product.strike_price) }}
                        </VChip>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
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
