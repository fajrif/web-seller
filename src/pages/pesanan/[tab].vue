<script setup>
import AllOrders from '@/views/pages/pesanan/AllOrders.vue'

const isExportOrderDataDialogVisible = ref(false)
const route = useRoute('pesanan-tab')

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
    status: "01,02,03,08,09,88",
  },
  {
    id: 2,
    title: 'Pesanan Baru',
    tab: 'pesanan-baru',
    status: "01",
  },
  {
    id: 3,
    title: 'Siap Dikirim',
    tab: 'siap-dikirim',
    status: "02",
  },
  {
    id: 4,
    title: 'Dalam Pengiriman',
    tab: 'pengiriman',
    status: "03,08",
  },
  {
    id: 5,
    title: 'Berhasil',
    tab: 'berhasil',
    status: "88",
  },
  {
    id: 6,
    title: 'Dibatalkan',
    tab: 'batal',
    status: "09",
  },
]

const openExportDataDialog = () => {
  isExportOrderDataDialogVisible.value = true
}

definePage({ meta: { navActiveLink: 'pesanan-tab' } })
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Kelola Pesanan
        </h4>
      </div>
			<div
				class="d-flex gap-4"
				>
				<VBtn
					color="primary"
					style="width:fit-content"
          size="small"
					prepend-icon="tabler-download"
          @click="openExportDataDialog"
					>
					Export Pesanan
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
        :to="{ name: 'pesanan-tab', params: { tab: item.tab } }"
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
        :value="item.tab"
      >
        <AllOrders :selected-status="item.status" />
      </VWindowItem>
    </VWindow>
    <ExportOrderDataDialog
      v-model:is-dialog-visible="isExportOrderDataDialogVisible"
    />
  </div>
</template>
