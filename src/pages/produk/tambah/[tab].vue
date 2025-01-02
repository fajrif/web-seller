<script setup>
import ProductForm from '@/views/pages/produk/tambah/ProductForm.vue'
import UploadProducts from '@/views/pages/produk/tambah/UploadProducts.vue'

const route = useRoute('produk-tambah-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
		id: 1,
    title: 'Tambah Produk',
    tab: 'tambah-produk',
  },
  {
		id: 2,
    title: 'Tambah Produk Sekaligus',
    tab: 'upload-produk-sekaligus',
  },
]

definePage({ meta: { navActiveLink: 'produk-tambah-tab' } })
</script>

<template>
  <div>

    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Tambah Produk
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
        :to="{ name: 'produk-tambah-tab', params: { tab: item.tab } }"
      >
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Tambah Produk -->
			<VWindowItem value="tambah-produk">
        <ProductForm />
      </VWindowItem>

      <!-- Upload Produk Sekaligus -->
			<VWindowItem value="upload-produk-sekaligus">
        <UploadProducts />
      </VWindowItem>

    </VWindow>
  </div>
</template>
