<script setup>
import DashboardBanner from '@/views/dashboards/analytics/DashboardBanner.vue'
import ShippingOptions from '@/views/dashboards/analytics/ShippingOptions.vue'
import CurrentBalance from '@/views/dashboards/analytics/CurrentBalance.vue'
import OrderActivity from '@/views/dashboards/analytics/OrderActivity.vue'
import StockStatus from '@/views/dashboards/analytics/StockStatus.vue'
import PopularProducts from '@/views/dashboards/analytics/PopularProducts.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Dashboard Banner -->
    <VCol
      cols="12"
      md="8"
    >
      <VRow>
        <VCol cols="12">
          <DashboardBanner />
        </VCol>
        <VCol cols="12">
          <CurrentBalance />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Shipping Options -->
    <VCol
      cols="12"
      md="4"
    >
      <ShippingOptions />
    </VCol>
  </VRow>
  <VRow>
    <!-- 👉 Order Activity -->
    <VCol
      cols="12"
      md="8"
    >
      <OrderActivity />
    </VCol>

    <!-- 👉 Stock Status -->
    <VCol
      cols="12"
      md="4"
    >
      <VRow>
        <VCol cols="12">
          <StockStatus />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <PopularProducts />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
