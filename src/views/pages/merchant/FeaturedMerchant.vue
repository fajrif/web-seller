<script setup>
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()
const isAddProductFeaturedDialogVisible = ref(false)
const selected = ref([])

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
    messageStore.setMessage('success', 'Berhasil update produk unggulan')
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
}

const addItem = () => {
	selected.value = featuredData.value.data.data.map(f => f.id)
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
              class="text-wrap"
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
												v-if="product.product_photo && product.product_photo[0]"
                        size="50"
                        variant="tonal"
                        class="my-2 me-2"
                        rounded
                        :image="product.product_photo[0].url"
                      />
                      <div class="d-flex flex-column">
												<RouterLink :to="{ name: 'produk-view-id', params: { id: product.id } }" class="d-block my-2" style="width:200px">
													{{ product.name }}
												</RouterLink>
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
						<template v-else>
							<EmptyData
								:border="false"
								description="Anda sekarang belum memiliki produk unggulan. Silahkan pilih produk-produk <br/>yang ingin anda tampilkan sebagai <strong>Produk Unggulan</strong> di toko anda."
								btn-text="Tambah Produk"
								@click-button="addItem"
								/>
						</template>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <AddProductFeaturedSelectionDialog
      v-model:is-dialog-visible="isAddProductFeaturedDialogVisible"
      v-model:selected-value="selected"
      @form-submitted="addFeatured"
    />
  </div>
</template>
