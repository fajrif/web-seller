<script setup>
import phoneTopbar from '@images/misc/phone-topbar.png'
import badge from '@images/misc/badge.png'
import badgeDiskon from '@images/misc/badge-diskon.png'
import featuredBadge from '@images/misc/featured-badge.png'
import { register } from 'swiper/element/bundle'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

definePage({
  meta: {
    layout: 'preview',
    unauthenticatedOnly: false,
  },
})

const route = useRoute('produk-view-id')
const modules = [Pagination]
const productData = ref()

const { data: productDetails } = await useApiCore(`/seller/query/product/detail/${ route.params.id }`)
if (productDetails.value.success) {
  productData.value = productDetails.value.data
}

register()
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-0">
    <div class="position-relative">
      <!-- 👉 Auth card -->
      <VCard
        class="auth-card rounded-0 pa-0"
        max-width="460"
				style="background-color:#8e8e8e;"
      >
        <VCardText class="bg-white pa-0 mb-3">
					<VImg :src="phoneTopbar" />
					<swiper-container
						:modules="modules"
						:pagination="{ el: '.swiper-pagination', type: 'fraction' }"
						events-prefix="swiper-"
						>
						<swiper-slide
                v-for="swiperImg in productData.product_photo"
                :key="swiperImg.id"
						>
							<VImg :src="swiperImg.url" />
						</swiper-slide>
						<img
							v-show="productData.is_featured_product"
							:src="featuredBadge"
							class="featured-badge"
							/>
					</swiper-container>
					<div class="swiper-pagination"></div>
					<div class="pa-4">
						<div class="d-flex align-center justify-space-between mb-4">
							<div v-show="productData.event_badge_active" class="d-block">
								<img :src="productData.event_badge_image_url" class="me-2" />
							</div>

							<IconBtn
								color="secondary"
								icon="tabler-heart"
							/>
						</div>
						<VChip
							v-if="productData.product_stock.length > 0"
							:label="false"
							size="small"
							color="error"
							style="border-radius:6px;"
						>
							Sisa {{ productData.product_stock[0].amount }} Produk
						</VChip>
						<VChip
							v-else
							:label="false"
							size="small"
							color="error"
							style="border-radius:6px;"
						>
							Stock Habis
						</VChip>
						<h5 class="text-h5 text-black mt-2">
							{{ productData.name }}
						</h5>
            <h4 class="text-h4 mb-1 fw-700 text-black">
              {{ toCurrency(productData.price) }}
            </h4>
            <div
              v-if="productData.strike_price && productData.price < productData.strike_price"
              class="d-flex gap-2 flex-wrap align-center"
            >
              <VChip
                :label="false"
                size="small"
                color="error"
								style="border-radius:6px;"
              >
                {{ calculateDiscount(productData.price, productData.strike_price) }}
              </VChip>
              <p
                class="text-body-1 text-medium-emphasis text-secondary mb-0"
                style="text-decoration:line-through;"
              >
                {{ toCurrency(productData.strike_price) }}
              </p>
            </div>
            <div class="d-flex align-center my-4 pa-4 border border-radius-8">
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
					</div>
        </VCardText>
        <VCardText class="bg-white pa-4">
					<h4 class="text-h4 mb-4 pt-3 fw-700 text-black">
						Deskripsi Produk
					</h4>
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
					<p class="my-4">
						{{ productData.description }}
					</p>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
<style lang="scss">
.card-list .v-list-item:not(:last-child),
.card-list .v-list-item:last-child {
	padding-block-end: 8px !important;
}
.swiper-pagination-fraction {
	width: fit-content;
	height: fit-content;
	padding: 7px;
	background-color: #f7f7f7;
	position: absolute;
	border-radius: 8px;
	top: 10%;
	left: auto;
	right: 15px;
}
.featured-badge {
	position: absolute;
	bottom: 0;
}
</style>
