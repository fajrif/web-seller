<script setup>
import sicepat from '@images/logos/delivery/sicepat.png'
import jne from '@images/logos/delivery/jne.png'
import jnt from '@images/logos/delivery/jnt.png'
import ninja from '@images/logos/delivery/ninja.png'
import posaja from '@images/logos/delivery/posaja.png'
import seller from '@images/logos/delivery/seller.png'

const kurirTanpaBiaya = ref([
  {
    logo: ninja,
    name: 'Ninja',
    subtitle: 'Reguler',
    connected: true,
  },
  {
    logo: posaja,
    name: 'PT Pos Indonesia',
    subtitle: 'Reguler (24 Jam)',
    connected: false,
  },
  {
    logo: sicepat,
    name: 'SiCepat',
    subtitle: 'Express',
    connected: true,
  },
])

const kurirBiaya = ref([
  {
    logo: seller,
    name: 'Pengiriman oleh Seller',
    subtitle: 'Pengiriman oleh Seller',
    connected: false,
  },
  {
    logo: jne,
    name: 'JNE',
    links: {
      username: '@JNE',
      link: 'https://www.jne.co.id/',
    },
    connected: false,
  },
  {
    logo: jnt,
    name: 'J&T Express',
    links: {
      username: '@JNT',
      link: 'https://jet.co.id/',
    },
    connected: false,
  },
])
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="6"
        class="pe-md-0 pb-0 pb-md-3"
      >
        <!-- 👉 Shipping Provider -->
        <VCard flat>
          <VCardText>
            <h3 class="mb-2 fw-500">
              Kurir Tanpa Biaya
            </h3>
            <p>Kurir tanpa biaya adalah kurir pengiriman barang / paket dengan metode Request Pick-Up atau DropPoint</p>
            <VList class="card-list">
              <VListItem
                v-for="item in kurirTanpaBiaya"
                :key="item.logo"
              >
                <template #prepend>
                  <VAvatar size="100">
                    <img
                      :src="item.logo"
                      width="100%"
                    >
                  </VAvatar>
                </template>
                <VListItemTitle>
                  <h6 class="text-h6">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  {{ item.subtitle }}
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction>
                    <VSwitch
                      v-model="item.connected"
                      density="compact"
                      class="me-1"
                    />
                  </VListItemAction>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="ps-md-0 pt-0 pt-md-3"
      >
        <!-- 👉 Social Accounts -->
        <VCard flat>
          <VCardText>
            <h3 class="mb-2 fw-500">
              Kurir dengan Biaya
            </h3>
            <p>Kurir adalah jasa pengiriman barang atau paket melalui Seller pribadi atau pengiriman yang di tanggung oleh Pembeli</p>
            <VList class="card-list">
              <VListItem
                v-for="item in kurirBiaya"
                :key="item.logo"
              >
                <template #prepend>
                  <VAvatar size="100">
                    <img
                      :src="item.logo"
                      width="100%"
                    >
                  </VAvatar>
                </template>
                <VListItemTitle>
                  <h6 class="text-h6">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle v-if="item.links?.link">
                  <a
                    :href="item.links.link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ item.links?.username }}</a>
                </VListItemSubtitle>
                <VListItemSubtitle
                  v-else
                  class="text-xs"
                >
                  Tidak Terhubung
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction>
                    <VSwitch
                      v-model="item.connected"
                      density="compact"
                      class="me-1"
                    />
                  </VListItemAction>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 16px;
}
.card-list .v-list-item:not(:last-child) {
	padding-block-end: 0 !important;
}
</style>
