<script setup>
import { VIcon } from 'vuetify/components/VIcon'
import bgBanks from '@images/illustrations/bg-banks.png'

const props = defineProps({
  triggerReset: {
    type: Boolean,
    required: true,
  },
})

const { data: dataBanks, execute: fetchBanks, isFinished: loading } = await useApiCore("/iconcash/query/customerbank/search")

const banks = computed(() => dataBanks.value.data)

watch(() => props.triggerReset, (newVal, oldVal) => {
	if(newVal !== oldVal){
		fetchBanks()
	}
});
</script>

<template>
  <div>
    <VCard
      v-if="!isEmpty(banks)"
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
                :src="resolveBankLogo(item.bank.id)"
                width="100"
                height="50"
                />
            </div>
            <h6 class="text-h6 pt-2 mb-1">
              {{ item.account_number }}
            </h6>
            <h6 class="text-h6 font-weight-bold mb-0">
              {{ item.account_name }}
            </h6>
          </div>
        </VCarouselItem>
      </VCarousel>
    </VCard>
    <v-skeleton-loader
      v-else
      :elevation="2"
      type="card">
    </v-skeleton-loader>
    <div class="text-end pa-2">
      <RouterLink :to="{ name: 'iconcash-bank' }">
        <small class="text-h6 text-medium-emphasis text-primary">Atur Bank</small>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss">
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
