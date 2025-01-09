<script setup>
import { VIcon } from 'vuetify/components/VIcon'
import sliderBar1 from '@images/banner/sample-banner.png'

const banners = [
  {
    id: 1,
    name: 'Gelegar PLN Mobile 2022',
    slideImg: sliderBar1,
  },
  {
    id: 2,
    name: 'Gelegar PLN Mobile 2023',
    slideImg: sliderBar1,
  },
  {
    id: 3,
    name: 'Gelegar PLN Mobile 2024',
    slideImg: sliderBar1,
  },
]
</script>

<template>
  <VCard
    color="lightblue"
    height="280"
  >
    <VCarousel
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '8' })"
      height="280"
      class="carousel-delimiter-top-end web-analytics-carousel"
    >
      <VCarouselItem
        v-for="item in banners"
        :key="item.id"
      >
        <VRow>
          <VCol
            cols="12"
            class="align-center"
          >
            <img
              :src="item.slideImg"
              class="card-website-analytics-img"
            >
          </VCol>
        </VRow>
      </VCarouselItem>
    </VCarousel>
  </VCard>
</template>

<style lang="scss">
.v-carousel__controls__item .v-icon {
	opacity: 1 !important;
}

.card-website-analytics-img {
  block-size: 200px;
}

@media screen and (min-width: 600px) {
  .card-website-analytics-img {
    margin: 0;
		width: 100%;
		height: 100%;
  }
}

.web-analytics-carousel {
  .v-carousel__controls {
    .v-carousel__controls__item {
      &.v-btn--active {
        .v-icon {
          opacity: 1 !important;
        }
      }
    }
  }
}
</style>
