<script setup>
import AllProducts from '@/views/pages/produk/AllProducts.vue'

const route = useRoute('produk-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
		id: 1,
    title: 'Semua',
    tab: 'semua',
		status: null,
  },
  {
		id: 2,
    title: 'Dijual',
    tab: 'dijual',
		status: 1,
  },
  {
		id: 3,
    title: 'Diarsipkan',
    tab: 'arsip',
		status: 0,
  },
  {
		id: 4,
    title: 'Tidak Aktif',
    tab: 'non-aktif',
		status: 2,
  },
  {
		id: 5,
    title: 'Ditolak',
    tab: 'ditolak',
		status: 3,
  },
]

definePage({ meta: { navActiveLink: 'produk-tab' } })
</script>

<template>
  <div>

    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Kelola Produk
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
				<VBtn
					color="primary"
					prepend-icon="tabler-plus"
					@click="$router.push('/produk/tambah')"
					>
					Tambah Produk
				</VBtn>
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
        :to="{ name: 'produk-tab', params: { tab: item.tab } }"
      >
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Semua -->
			<VWindowItem
        v-for="item in tabs"
        :key="item.id"
        :value="item.tab">
        <AllProducts :selectedStatus="item.status" />
      </VWindowItem>

    </VWindow>
  </div>
</template>
