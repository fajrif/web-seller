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

const removeNotification = notificationId => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = notification => {
  if (!notification.isSeen)
    markRead([notification.id])
}
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
