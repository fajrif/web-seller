<script setup>
import img1 from '@images/banner/support-banner.png'
import icon1 from '@images/icons/ic-info.png'
import icon2 from '@images/icons/ic-phone.png'

const currentTab = ref('tab-1')
const activeQuestion = ref(0)

// const { data: faqsData, execute: fetchFaqs } = await useApiCore(createUrl('/setting/faq'))

// const faqs = computed(() => faqsData.value.data)

const faqs = [
  {
    id: 1,
    question: 'Kapan pembayaran pesanan saya diambil?',
    answer: 'Pembayaran diambil selama proses checkout ketika Anda membayar pesanan Anda. Nomor pesanan yang muncul pada layar konfirmasi menandakan pembayaran telah berhasil diproses.',
  },
  {
    id: 2,
    question: 'Bagaimana cara saya membayar pesanan saya?',
    answer: 'Kami menerima Visa®, MasterCard®, American Express®, dan PayPal®. Server kami mengenkripsi semua informasi yang dikirimkan kepada mereka, sehingga Anda dapat yakin bahwa informasi kartu kredit Anda akan tetap aman dan terlindungi.',
  },
  {
    id: 3,
    question: 'Apa yang harus saya lakukan jika saya kesulitan melakukan pemesanan?',
    answer: 'Untuk kesulitan teknis apa pun yang Anda alami dengan situs web kami, silakan hubungi kami di portal dukungan kami, atau Anda dapat menghubungi kami melalui WhatsApp di 0811-8230-433, atau email kami di support.marketplace@iconpln.co.id',
  },
  {
    id: 4,
    question: 'Lisensi manakah yang saya perlukan agar dapat mengakses PLN Seller Marketplace?',
    answer: 'Anda tidak memerlukan lisensi khusus jika ingin menjadi seller pada aplikasi PLN Mobile Marketplace, cukup mendaftarkan diri sebagai pengguna dan mengaktifkan fitur sebagai Seller',
  },
]

const contactUs = [
  {
    icon: 'tabler-mail',
    via: 'support.marketplace@iconpln.co.id',
    tagLine: 'Email Support',
  },
  {
    icon: 'tabler-phone',
    via: '0811-8230-433',
    tagLine: 'Nomor WhatsApp',
  },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pa-0">
          <VRow>
            <VCol cols="12">
              <VImg :src="img1" />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTabs
                v-model="currentTab"
                grow
                stacked
              >
                <VTab>
                  <div class="d-flex align-start">
                    <VAvatar class="me-4 mt-2">
                      <VImg :src="icon1" />
                    </VAvatar>
                    <div class="d-flex flex-column text-start">
                      <h3 class="mb-1">
                        FAQ
                      </h3>
                      <p class="text-body-2 mb-0 me-3">
                        Pertanyaan yang umum ditanyakan oleh pengguna terkait Marketplace PLN Mobile.
                      </p>
                    </div>
                  </div>
                </VTab>

                <VTab>
                  <div class="d-flex align-start">
                    <VAvatar class="me-4 mt-2">
                      <VImg :src="icon2" />
                    </VAvatar>
                    <div class="d-flex flex-column text-start">
                      <h3 class="mb-1">
                        Hubungi Kami
                      </h3>
                      <p class="text-body-2 mb-0 me-3">
                        Sampaikan masalah atau saran kamu melalui channel - channel komunikasi kami.
                      </p>
                    </div>
                  </div>
                </VTab>
              </VTabs>

              <VCardText class="px-2">
                <VWindow v-model="currentTab">
                  <VWindowItem
                    value="tab-1"
                    class="bg-white"
                  >
                    <VExpansionPanels v-model="activeQuestion">
                      <VExpansionPanel
                        v-for="item in faqs"
                        :key="item.id"
                        :title="item.question"
                        :text="item.answer"
                      />
                    </VExpansionPanels>
                  </VWindowItem>
                  <VWindowItem value="tab-2">
                    <!-- contacts -->
                    <VRow class="mt-0">
                      <VCol
                        v-for="contact in contactUs"
                        :key="contact.icon"
                        sm="6"
                        cols="12"
                      >
                        <VCard
                          flat
                          style="background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));"
                        >
                          <VCardText class="pb-4">
                            <VAvatar
                              rounded
                              color="primary"
                              variant="tonal"
                              size="46"
                            >
                              <VIcon
                                :icon="contact.icon"
                                size="26"
                              />
                            </VAvatar>
                          </VCardText>
                          <VCardText>
                            <h5 class="text-h5 mb-1">
                              {{ contact.via }}
                            </h5>
                            <div>{{ contact.tagLine }}</div>
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>
                  </VWindowItem>
                </VWindow>
              </VCardText>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scope>
.v-tabs--density-comfortable.v-tabs--stacked {
	--v-tabs-height: 100px !important;
}
.v-btn--stacked {
	display: flex !important;
	justify-content: start !important;
	width: 200px !important;
	margin: 0 10px !important;
	padding: 20px !important;
	border: 2px solid #eee !important;
	border-radius: 8px !important;
}
.v-tabs.v-tabs--horizontal:not(.v-tabs-pill) {
	border-block-end: none;
}
.v-btn.v-tab-item--selected.v-tab--selected {
	border-color: var(--v-theme-primary) !important;
	background-color: #d3eef2;
}
.v-tab__slider {
	display: none;
}
.v-expansion-panel {
  border: 1px solid #eee;
}
</style>
