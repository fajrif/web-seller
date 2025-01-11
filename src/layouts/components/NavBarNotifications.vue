<script setup>
const notifications = ref([])

const { data: notificationsData } = await useApiCore(createUrl('/seller/query/notification/list/2', {
  query: {
    page: 1,
  },
}))

if (notificationsData.value.success) {
  let tmpNotif = notificationsData.value.data.data
  notifications.value = tmpNotif.map(item => {
    return {
			id: item.id,
			icon: resolveIconType(item.title).icon,
			title: item.title,
			subtitle: item.message,
			time: item.created_at,
			color: resolveIconType(item.title).color,
			isSeen: false,
    }
  });
}

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
