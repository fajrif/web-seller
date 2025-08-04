<script setup>
import tikTokShopLogo from '@images/logos/tiktok-shop.png'
import SyncProducts from '@/views/pages/tiktokshop/SyncProducts.vue'

import { useMessageStore } from '@core/stores/config'
import { useTikTokShopStore } from '@core/stores/tiktokShop'

// Composables
const tikTokStore = useTikTokShopStore()

// Reactive data
const connecting = ref(false)
const syncing = ref(false)
const updating = ref(false)
const loading = ref(false)
const loadingMessage = ref('')

// Computed properties
const connectionStatus = computed(() => tikTokStore.connectionStatus)

// Methods
const connectTikTokShop = async () => {
  connecting.value = true
  try {
    const authUrl = await tikTokStore.getAuthUrl()

    // Open popup window for OAuth
    const popup = window.open(
      authUrl,
      'tiktok-auth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )

    // Listen for OAuth completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        checkConnection()
        connecting.value = false
      }
    }, 1000)

  } catch (error) {
    console.error('Failed to get auth URL:', error)
		messageStore.setMessage('error', 'Gagal terhubung dengan TikTok Shop')
    connecting.value = false
  }
}

const checkConnection = async () => {
  try {
    await tikTokStore.testConnection()
    if (tikTokStore.connectionStatus.connected) {
      messageStore.setMessage('success', 'Akun berhasil terhubung ke TikTok Shop!')
      await loadSyncStatus()
    }
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

// const loadSyncStatus = async () => {
//   try {
//     await tikTokStore.fetchSyncStatus()
//     const latestSync = syncRecords.value
//       .filter(record => record.last_sync_at)
//       .sort((a, b) => new Date(b.last_sync_at) - new Date(a.last_sync_at))[0]
//
//     if (latestSync) {
//       lastSyncTime.value = latestSync.last_sync_at
//     }
//   } catch (error) {
//     console.error('Failed to load sync status:', error)
//   }
// }

// Lifecycle
onMounted(async () => {
  loading.value = true
  loadingMessage.value = 'Memuat produk dari TikTok Shop...'

  try {
    // Load products and check connection
    await Promise.all([
      tikTokStore.testConnection()
    ])

    // if (tikTokStore.connectionStatus.connected) {
    //   await loadSyncStatus()
    // }
  } catch (error) {
    console.error('Failed to load initial data:', error)
  } finally {
    loading.value = false
  }
})

</script>
<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Kelola Produk TikTok Shop
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VChip v-if="connectionStatus.connected"
          color="success"
          >
          <VIcon
            start
            icon="tabler-circle-check"
          />
          Terhubung ke TikTok Shop
        </VChip>
        <VChip v-else
          color="error"
          >
          <VIcon
            start
            icon="tabler-circle-x"
          />
          Tidak Terhubung
        </VChip>
      </div>
    </div>

    <!-- 👉 products -->
    <VCard>
			<VCardText>
        <template v-if="!connectionStatus.connected">
          <div class="d-flex justify-center align-center pa-10 ma-10">
            <div class="d-flex flex-column align-center text-center">
              <VAvatar
                size="150"
                class="mb-5"
                rounded="0"
              >
                <VImg
                  :src="tikTokShopLogo"
                  contain
                  />
              </VAvatar>
              <div class="d-flex flex-column align-center text-center">
                <p class="text-body-2 mx-auto">
                  Sambungkan akun TikTok Shop Anda untuk mulai mengelola <br/> produk dan pesanan langsung dari PLN Web Seller.
                </p>
                <VBtn
                  :disabled="connecting"
                  :loading="connecting"
                  class="connect-btn"
                  @click="connectTikTokShop"
                >
                  Hubungkan ke TikTok Shop
                </VBtn>
              </div>
            </div>
          </div>
        </template>
				<!-- 👉 Empty products -->
				<template v-else>
					<SyncProducts />
				</template>
			</VCardText>
    </VCard>
    <!-- Loading Overlay -->
    <OrderLoadingDialog
      v-model:is-dialog-visible="loading"
      :is-progress-linear="true"
      :message-text="loadingMessage"
    />
  </div>
</template>
