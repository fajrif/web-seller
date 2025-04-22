<script setup>
import { useNotificationStore } from '@core/stores/config'

const notifData = useNotificationStore()

const router = useRouter()
const notifications = ref([])

const { data: notificationsData } = await useApiCore(createUrl('/seller/query/notification/list/2', {
  query: {
    page: 1,
  },
}))

if (notificationsData.value?.success) {
  let tmpNotif = notificationsData.value.data.data
  notifications.value = tmpNotif.map(item => {
    return {
			id: item.id,
      order_id: resolveNotifOrderId(item.url_path),
			icon: resolveIconType(item.title).icon,
			title: item.title,
			subtitle: item.message,
			time: item.created_at,
			color: resolveIconType(item.title).color,
			isSeen: item.status === 1,
    }
  });
}

const readNotification = async (id, orderId) => {
  try {
    const res = await $apiCore(`/seller/command/notification/read/${id}`, {
      method: 'POST',
      ignoreResponseError: true
    })
    redirectToOrderPage(orderId)
  } catch (error) {
    console.error("Error on read notification:", error)
  }
}

const handleNotificationClick = notification => {
  if (!notification.isSeen) {
    readNotification(notification.id, notification.order_id)
  } else {
    redirectToOrderPage(notification.order_id)
  }
}

const redirectToOrderPage = orderId => {
  if(!isEmpty(orderId)) {
    window.location.href = `/pesanan/view/${orderId}`
  }
}

notifData.getTotalUnread()
</script>

<template>
  <Notifications
    class="me-3"
    :notifications="notifications"
    :total-unread="notifData.totalUnread"
    @click:notification="handleNotificationClick"
  />
</template>
