<script setup>
import shipSeller from '@images/logos/delivery/seller.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const kurirTanpaBiaya = ref([])
const kurirBiaya = ref([])
const selectedShipping = ref([])
const	shipBySeller = ref(false)

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
	// need to save this
  let merchant = merchantDetails.value.data.merchant
	shipBySeller.value = merchant.has_custom_logistic
	let currExpedition = merchant.expedition?.list_expeditions
	selectedShipping.value = currExpedition.split(":")
}

const { data: expeditionsData } = await useApiCore(createUrl('/rajaongkir/couriers'))
if(expeditionsData.value.success) {
	// kurir tanpa biaya => cashless
	kurirTanpaBiaya.value = expeditionsData.value.data
		.filter((item) => {
      return item.type === "cashless"
    })
		.map(item => {
    return {
			name: item.name,
			value: item.value,
			logo: item.logo,
			type: item.type,
		}
  });

	// kurir dgn biaya => tunai
	kurirBiaya.value = expeditionsData.value.data
		.filter((item) => {
      return item.type === "tunai"
    })
		.map(item => {
    return {
			name: item.name,
			value: item.value,
			logo: item.logo,
			type: item.type,
		}
  });

	// add seller shipping
	kurirBiaya.value.unshift({
			name: "Pengiriman oleh Seller",
			value: "seller",
			logo: shipSeller,
			type: "tunai",
	});
}

const saveShipping = async () => {
  try {
		let selected = selectedShipping.value.join(":")
    const res = await $apiCore("/seller/command/merchant/set-expedition", {
      method: 'POST',
      body: { list_expeditions: selected },
      onResponseError({ response }) {
        console.log(response)
      },
    })

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan pengiriman toko')
    console.error("Error on update expedition data data:", error)
  }
}

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
                :key="item.value"
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
                  <h6 class="text-h6 fw-700">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
									<VChip
										size="x-small"
										color="info"
									>
										{{ item.type }}
									</VChip>
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction>
                    <VSwitch
                      v-model="selectedShipping"
											:value="item.value"
                      density="compact"
                      class="me-1"
											@change="saveShipping"
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
                :key="item.value"
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
                  <h6 class="text-h6 fw-700">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
									<VChip
										v-if="item.value !== 'seller'"
										size="x-small"
										color="error"
									>
										<VIcon
											start
											icon="tabler-cash"
										/>
										{{ item.value }}
									</VChip>
									<p v-else>
										{{ shipBySeller == true ? 'Aktif' : 'Non-Aktif' }}
									</p>
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction v-if="item.value !== 'seller'">
                    <VSwitch
                      v-model="selectedShipping"
											:value="item.value"
                      density="compact"
                      class="me-1"
											@change="saveShipping"
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
