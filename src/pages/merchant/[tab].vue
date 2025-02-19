<script setup>
import InfoMerchant from '@/views/pages/merchant/InfoMerchant.vue'
import EtalaseMerchant from '@/views/pages/merchant/EtalaseMerchant.vue'
import AddressMerchant from '@/views/pages/merchant/AddressMerchant.vue'
import JadwalMerchant from '@/views/pages/merchant/JadwalMerchant.vue'
import ShippingMerchant from '@/views/pages/merchant/ShippingMerchant.vue'
import FeaturedMerchant from '@/views/pages/merchant/FeaturedMerchant.vue'

const route = useRoute('merchant-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
    id: 1,
    title: 'Informasi Toko',
    tab: 'info-toko',
  },
  {
    id: 2,
    title: 'Etalase',
    tab: 'etalase-toko',
  },
  {
    id: 3,
    title: 'Alamat Toko',
    tab: 'alamat-toko',
  },
  {
    id: 4,
    title: 'Jadwal Toko',
    tab: 'jadwal-toko',
  },
  {
    id: 5,
    title: 'Pengiriman',
    tab: 'shipping-toko',
  },
  {
    id: 5,
    title: 'Produk Unggulan',
    tab: 'featured-products',
  },
]

definePage({ meta: { navActiveLink: 'merchant-tab' } })
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Kelola Merchant
        </h4>
      </div>
    </div>

    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.id"
        :value="item.tab"
        :to="{ name: 'merchant-tab', params: { tab: item.tab } }"
      >
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Informasi Toko -->
      <VWindowItem value="info-toko">
        <InfoMerchant />
      </VWindowItem>

      <!-- Etalase -->
      <VWindowItem value="etalase-toko">
        <EtalaseMerchant />
      </VWindowItem>

      <!-- Address -->
      <VWindowItem value="alamat-toko">
        <AddressMerchant />
      </VWindowItem>

      <!-- Jadwal Toko -->
      <VWindowItem value="jadwal-toko">
        <JadwalMerchant />
      </VWindowItem>

      <!-- Shipping -->
      <VWindowItem value="shipping-toko">
        <ShippingMerchant />
      </VWindowItem>

      <!-- Produk Unggulan -->
      <VWindowItem value="featured-products">
        <FeaturedMerchant />
      </VWindowItem>
    </VWindow>
  </div>
</template>
