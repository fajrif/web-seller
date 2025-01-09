<script setup>
import { register } from 'swiper/element/bundle'
import notFoundImg from '@images/icons/ic-search.png'

const route = useRoute('produk-view-id')
const productData = ref()

const { data: productDetails } = await useApiCore(`/seller/query/product/detail/${ route.params.id }`)
if (productDetails.value.success) {
	productData.value = productDetails.value.data
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
      <div class="d-flex gap-4">
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
          v-if="productData"
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
            <div class="d-flex gap-2 flex-wrap align-center">
              <p class="text-body-1 text-medium-emphasis mb-0" style="text-decoration:line-through;">
								{{ toCurrency(productData.strike_price) }}
              </p>

              <VChip color="error">
                10%
              </VChip>
            </div>

            <div class="d-flex align-center my-2 pa-4 border border-radius-8">
              <div class="d-flex">
                <VIcon
                  icon="tabler-star-filled"
                  color="warning"
                  size="24"
                  class="me-2"
                />
                <div class="text-body-1">
                  5.0 dari 100
                </div>
              </div>
              &nbsp;&nbsp;|&nbsp;&nbsp; Terjual 200 kali &nbsp;&nbsp;|&nbsp;&nbsp; Dilihat 15rb kali
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
              style="width:350px"
            >
              Maaf produk yang anda cari tidak ditemukan. Silahkan coba beberapa saat lagi.
            </p>
            <VBtn
              color="primary"
              style="width:fit-content"
              @click="$router.push('/produk/semua')"
            >
              Kelola Produk
            </VBtn>
          </div>
        </div>
      </div>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
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
    border: 5px solid black;
    block-size: 100%;
    inline-size: 25%;
    opacity: 0.4;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
}
</style>
