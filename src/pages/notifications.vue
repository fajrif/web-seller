<script setup>
const notifications = ref([
  {
    id: 1,
    icon: 'tabler-wallet',
    title: 'Pesanan baru diterima 🎉',
    subtitle: 'Order #01290 dipesan oleh Kartika Sari',
    time: 'Hari ini',
    color: 'primary',
    isSeen: true,
  },
  {
    id: 2,
    icon: 'tabler-wallet',
    title: 'Pesanan baru diterima 🎉',
    subtitle: 'Order #01290 dipesan oleh Chow Lin',
    time: 'Kemarin',
    color: 'primary',
    isSeen: false,
  },
  {
    id: 3,
    icon: 'tabler-cash-banknote',
    title: 'Penarikan dana telah selesai 👋🏻',
    subtitle: 'Anda telah menarik dana sebesar Rp.500rb',
    time: '11 Aug',
    color: 'success',
    isSeen: true,
  },
  {
    id: 4,
    icon: 'tabler-cash-banknote-off',
    title: 'Penarikan dana Gagal',
    subtitle: 'Maaf untuk sementara penarikan dana di tutup',
    time: '25 May',
    isSeen: false,
    color: 'error',
  },
  {
    id: 5,
    icon: 'tabler-package',
    title: 'Pesanan telah sampai 📦',
    subtitle: 'Pesanan order #5453 telah di terima',
    time: '19 Mar',
    color: 'success',
    isSeen: true,
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Notifikasi</VCardTitle>
      <p class="text-body-1 mb-0">
        List notifikasi anda
      </p>
    </VCardItem>

    <VCardText class="px-0">
      <VList class="notification-list rounded-0 py-0">
        <template
          v-for="(notification, index) in notifications"
          :key="notification.title"
        >
          <VDivider v-if="index > 0" />
          <VListItem
            link
            lines="one"
            min-height="66px"
            class="list-item-hover-class"
          >
            <!-- Slot: Prepend -->
            <!-- Handles Avatar: Image, Icon, Text -->
            <div class="d-flex align-start gap-4">
              <VAvatar :color="notification.color && !notification.img ? notification.color : undefined">
                <span v-if="notification.text">{{ avatarText(notification.text) }}</span>
                <VImg
                  v-if="notification.img"
                  :src="notification.img"
                />
                <VIcon
                  v-if="notification.icon"
                  :icon="notification.icon"
                />
              </VAvatar>

              <div>
                <p class="text-sm font-weight-medium mb-1">
                  {{ notification.title }}
                </p>
                <p
                  class="text-body-2 mb-2"
                  style=" letter-spacing: 0.4px !important; line-height: 18px;"
                >
                  {{ notification.subtitle }}
                </p>
                <p
                  class="text-sm text-disabled mb-0"
                  style=" letter-spacing: 0.4px !important; line-height: 18px;"
                >
                  {{ notification.time }}
                </p>
              </div>
              <VSpacer />
            </div>
          </VListItem>
        </template>

        <VListItem
          v-show="!notifications.length"
          class="text-center text-medium-emphasis"
          style="block-size: 56px;"
        >
          <VListItemTitle>No Notification Found!</VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
