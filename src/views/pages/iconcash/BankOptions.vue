<script setup>
import { VIcon } from 'vuetify/components/VIcon'
import bgBanks from '@images/illustrations/bg-banks.png'

const { data: dataBanks, execute: fetchBanks, isFinished: loading } = await useApiCore("/iconcash/query/customerbank/search")

const banks = computed(() => dataBanks.value.data)
</script>

<template>
  <VCard
    class="banks-background"
    :style="{ backgroundImage: 'url(' + bgBanks + ')' }"
    >
    <VCarousel
      :cycle="false"
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '8' })"
      style="height:fit-content"
      class="carousel-delimiter-bottom-end web-analytics-carousel"
    >
      <VCarouselItem
        v-for="item in banks"
        :key="item.id"
      >
        <div class="d-flex flex-column align-start justify-start py-2 px-4">
          <div class="mb-2">
            <VImg
              :src="item.bank.logoUrl"
              width="100"
            />
          </div>
          <h5 class="text-h5 pt-2 mb-1">
            {{ item.account_number }}
          </h5>
          <h6 class="text-h6 font-weight-bold mb-0">
            {{ item.account_name }}
          </h6>
        </div>
      </VCarouselItem>
    </VCarousel>
  </VCard>
  <div class="text-end pa-2">
    <RouterLink :to="{ name: 'iconcash-bank' }">
      <small class="text-h6 text-medium-emphasis text-primary">Atur Bank</small>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.banks-background {
  position: relative !important;
  background-size: cover !important;
  overflow: hidden !important;
  background-repeat: no-repeat !important;
}

.v-carousel__controls__item .v-icon {
	opacity: 1 !important;
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
