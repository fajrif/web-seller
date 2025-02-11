<script setup>
import { register } from 'swiper/element/bundle'

const route = useRoute('produk-view-id')
const productData = ref()
const isSwiperDialogVisible = ref(false)

const { data: productDetails } = await useApiCore(`/seller/query/product/detail/${ route.params.id }`)
if (productDetails.value.success) {
  productData.value = productDetails.value.data
}

const openSwiperDialog = () => {
  isSwiperDialogVisible.value = true
}

register()
</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">
          Produk Detail
        </h4>
      </div>
			<div
				v-if="productData"
				class="d-flex gap-4"
				>
        <VBtn variant="outlined">
          <VIcon
            icon="tabler-eye"
            class="me-1"
          />
          Tinjau Tampilan
        </VBtn>
        <VBtn
          color="primary"
          @click="$router.push(`/produk/edit/${route.params.id}`)"
        >
          Ubah Produk
        </VBtn>
      </div>
    </div>
    <VCard>
      <VRow v-if="productData">
        <!-- 👉 Product Images	-->
        <VCol
          cols="12"
          md="6"
          lg="5"
        >
          <VCardText>
            <!-- 👉 Swiper	-->
            <swiper-container
              class="mySwiper swiperMain"
              thumbs-swiper=".mySwiper2"
              loop="true"
              space-between="10"
              navigation="true"
              centered-slides="true"
              events-prefix="swiper-"
            >
              <swiper-slide
                v-for="swiperImg in productData.product_photo"
                :key="swiperImg.id"
              >
                <VImg
                  :src="swiperImg.url"
									style="cursor:pointer;"
									@click="openSwiperDialog"
                  cover
                />
              </swiper-slide>
            </swiper-container>

            <swiper-container
              class="mySwiper2"
              loop="true"
              free-mode="true"
              events-prefix="swiper-"
              slides-per-view="4"
            >
              <swiper-slide
                v-for="swiperImg in productData.product_photo"
                :key="swiperImg.id"
              >
                <VImg
                  :src="swiperImg.url"
                  cover
                />
              </swiper-slide>
            </swiper-container>
            <!-- End Swiper	-->
          </VCardText>
        </VCol>
        <!-- 👉 Product Detail	-->
        <VCol
          cols="12"
          md="6"
          lg="7"
        >
          <VCardText>
            <h4 class="text-h4 mb-3 fw-700">
              {{ productData.name }}
            </h4>
            <h3 class="text-h3 mb-1 fw-700 text-primary">
              {{ toCurrency(productData.price) }}
            </h3>
            <div
              v-if="productData.strike_price && productData.price < productData.strike_price"
              class="d-flex gap-2 flex-wrap align-center"
            >
              <p
                class="text-body-1 text-medium-emphasis mb-0"
                style="text-decoration:line-through;"
              >
                {{ toCurrency(productData.strike_price) }}
              </p>

              <VChip
                :label="false"
                size="small"
                color="error"
              >
                {{ calculateDiscount(productData.price, productData.strike_price) }}
              </VChip>
            </div>

            <div class="d-flex align-center my-2 pa-4 border border-radius-8">
              <div class="d-flex me-2">
                <VIcon
                  icon="tabler-star-filled"
                  color="warning"
                  size="24"
                  class="me-2"
                />
                <div class="text-body-1">
									<template v-if="productData?.avg_rating">
										{{ productData?.avg_rating }} dari 5.0
									</template>
									<template v-else>
										N/A
									</template>
                </div>
              </div>
							|
							<div class="text-body-1 mx-2">
								<template v-if="productData?.order_details_count">
									Terjual {{ productData?.order_details_count }} kali
								</template>
								<template v-else>
									N/A
								</template>
							</div>
							|
							<div class="text-body-1 ms-2">
								<template v-if="productData?.review_count">
									Ulasan {{ productData?.review_count }} kali
								</template>
								<template v-else>
									N/A
								</template>
							</div>
            </div>

            <h5 class="text-h5 my-4">
              Deskripsi
            </h5>
            <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
              <div>
                <VList class="card-list text-medium-emphasis">
                  <VListItem>
                    <VListItemTitle>Kategori: <strong>{{ productData?.category_id }}</strong></VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Kondisi: <strong>{{ productData?.condition }}</strong></VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Berat: <strong>{{ productData?.weight }}</strong></VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Stock: <strong>{{ productData?.product_stock[0].amount }}</strong></VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Pembelian Minimum: <strong>{{ productData?.minimum_purchase }}</strong></VListItemTitle>
                  </VListItem>
                </VList>
              </div>
            </div>
            <VDivider class="my-6" />

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="productData?.description" />
          </VCardText>
        </VCol>
      </VRow>
      <!-- 👉 Empty Data -->
			<template v-else>
				<EmptyData
					:orientation="1"
					:border="false"
					title="Produk tidak ditemukan"
					description="Maaf produk yang anda cari tidak ditemukan.<br/>Silahkan coba beberapa saat lagi."
					btn-text="Kelola Produk"
					@click-button="() => $router.push('/produk/semua')"
					/>
			</template>
    </VCard>
    <SwiperDialog
      v-model:is-dialog-visible="isSwiperDialogVisible"
      v-model:images="productData.product_photo"
    />
  </div>
</template>

<style lang="scss">
.card-list .v-list-item:not(:last-child) {
	padding-block-end: 8px !important;
}
swiper-container {
  margin-top: 10px;
}
swiper-container.swiperMain {
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 20px 10px;
}

.mySwiper2 {
  swiper-slide {
    border: 3px solid #e9e9e9;
    block-size: 100%;
    inline-size: 25%;
    opacity: 0.4;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
}
</style>
