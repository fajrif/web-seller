<script setup>
import ProdukSemua from '@/views/pages/produk/ProdukSemua.vue'
import ProdukDijual from '@/views/pages/produk/ProdukDijual.vue'
import ProdukArsip from '@/views/pages/produk/ProdukArsip.vue'
import ProdukNonAktif from '@/views/pages/produk/ProdukNonAktif.vue'
import ProdukDitolak from '@/views/pages/produk/ProdukDitolak.vue'

const route = useRoute('produk-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
    title: 'Semua',
    tab: 'semua',
  },
  {
    title: 'Dijual',
    tab: 'dijual',
  },
  {
    title: 'Diarsipkan',
    tab: 'arsip',
  },
  {
    title: 'Tidak Aktif',
    tab: 'non-aktif',
  },
  {
    title: 'Ditolak',
    tab: 'ditolak',
  },
]

definePage({ meta: { navActiveLink: 'produk-tab' } })
</script>

<template>
  <div>

    <VRow >
      <VCol cols="6">
				<h3>Kelola Produk</h3>
      </VCol>
      <VCol cols="6" class="text-end">
				<VBtn
					color="primary"
					prepend-icon="tabler-plus"
					@click="$router.push('/produk/tambah')"
					>
					Tambah Produk
				</VBtn>
      </VCol>
    </VRow>

    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
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
      <VWindowItem value="semua">
        <ProdukSemua />
      </VWindowItem>

      <!-- Dijual -->
      <VWindowItem value="dijual">
        <ProdukDijual />
      </VWindowItem>

      <!-- Diarsipkan -->
      <VWindowItem value="arsip">
        <ProdukArsip />
      </VWindowItem>

      <!-- Tidak Aktif -->
      <VWindowItem value="non-aktif">
        <ProdukNonAktif />
      </VWindowItem>

      <!-- Ditolak -->
      <VWindowItem value="ditolak">
        <ProdukDitolak />
      </VWindowItem>
    </VWindow>
  </div>
</template>
