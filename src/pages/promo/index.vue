<script setup>
const eventsData = ref([])

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
	if(merchantDetails.value.data.merchant.can_registered_product_event){
		eventsData.value = merchantDetails.value.data.merchant.can_registered_product_event.filter((e) => e.event_type == 'promo')
	}
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Daftar Promo
        </h4>
      </div>
    </div>
    <VCard class="pa-2">
			<VRow v-if="eventsData.length > 0">
        <!-- 👉 Events Data	-->
        <VCol
          v-for="event in eventsData"
          :key="event.event_key"
          cols="12"
          md="6"
        >
          <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row border border-radius-8">
            <div class="ma-auto pa-5">
              <VImg
                width="137"
                height="176"
                :src="event.event_logo"
              />
            </div>

            <div>
              <VCardItem>
                <VCardTitle>{{ event.event_name }}</VCardTitle>
								<VChip size="small" color="warning" class="mt-2">
									<VIcon
										start
										icon="tabler-speakerphone"
									/>
									Promo
								</VChip>
              </VCardItem>

              <VCardText>
                {{ event.event_description }}
              </VCardText>

              <VCardText class="text-subtitle-1">
                <span>Tanggal :</span>
              </VCardText>

              <VCardActions class="justify-space-between">
                <VBtn variant="plain">
                  <RouterLink :to="{ name: 'promo-products', query: { type: event.event_type, key: event.event_key } }">
                    <span class="ms-2">Daftarkan Produk</span>
                  </RouterLink>
                </VBtn>

                <RouterLink :to="{ name: 'promo-products', query: { type: event.event_type, key: event.event_key } }">
                  <IconBtn
                    color="secondary"
                    icon="tabler-chevron-right"
                  />
                </RouterLink>
              </VCardActions>
            </div>
          </div>
        </VCol>
      </VRow>

			<!-- 👉 Empty Data -->
			<VRow v-else>
				<VCol cols="12">
					<EmptyData
						:orientation="1"
						:border="false"
						title="Belum ada Promo"
						description="Saat ini PLN Mobile belum ada Promo yang berjalan untuk Anda.<br/> Tingkatkan transaksi terus ya di PLN Mobile agar dapat mengikuti Event dan Promo di PLN Mobile"
						/>
				</VCol>
			</VRow>
    </VCard>
  </div>
</template>

