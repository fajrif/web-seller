<script setup>
import { useNotificationStore } from '@core/stores/config'
import imgFileBox from '@images/icons/ic-file-box.png'

const notifData = useNotificationStore()

// headers
const notifHeaders = [
  {
    title: '',
    key: 'notification',
    sortable: false,
  },
]

const itemsPerPage = ref(PAGINATION_PER_PAGE)
const page = ref(1)
const refreshKey = ref(0)

const {
  data: notificationsData,
	execute: fetchNotifications,
  isFinished: loading
} = await useApiCore(createUrl('/seller/query/notification/list/2', {
  query: {
    page,
  },
}))

const notifications = computed(() => notificationsData.value.data.data)
const totalNotifications = computed(() => notificationsData.value.data.total)

const readNotification = async (notification) => {
  try {
    const res = await $apiCore(`/seller/command/notification/read/${notification.id}`, {
      method: 'POST',
      ignoreResponseError: true
    })
    notification.status = 1
    refreshKey.value++
    notifData.getTotalUnread()
  } catch (error) {
    console.error("Error on read notification:", error)
  }
}

const handleNotificationClick = notification => {
  if (notification.status === 0) {
    readNotification(notification)
  }
}

</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Notifikasi</VCardTitle>
      <p class="text-body-1 mb-0">
        List notifikasi anda
      </p>
    </VCardItem>

    <VCardText>

      <template
        v-if="notifications && totalNotifications > 0"
        >
        <VList class="notification-list rounded-0 py-0" :key="refreshKey">
          <template
            v-for="(item, index) in notifications"
            :key="item.id"
            >
            <VDivider v-if="index > 0" />
            <VListItem
              link
              lines="one"
              min-height="66px"
              class="list-item-hover-class"
              :class="{ 'bg-light-blue': item.status === 0 }"
              @click="handleNotificationClick(item)"
              >
              <!-- Slot: Prepend -->
              <!-- Handles Avatar: Image, Icon, Text -->
              <div class="d-flex align-start gap-3">
                <VAvatar :color="resolveIconType(item.title).color">
                  <VIcon :icon="resolveIconType(item.title).icon" />
                </VAvatar>

                <div>
                  <p class="text-sm font-weight-medium mb-1">
                    {{ item.title }}
                  </p>
                  <p
                    class="text-body-2 mb-2"
                    style=" letter-spacing: 0.4px !important; line-height: 18px;"
                    >
                    {{ item.message }}
                    <template v-if="!isEmpty(item.url_path)">
                      <RouterLink :to="{ name: 'pesanan-view-id', params: { id: resolveNotifOrderId(item.url_path) } }">
                        <small class="text-sm text-primary font-weight-regular">#{{ resolveNotifOrderId(item.url_path) }}</small>
                      </RouterLink>
                    </template>
                  </p>
                  <p
                    class="text-sm text-disabled mb-0"
                    style=" letter-spacing: 0.4px !important; line-height: 18px;"
                    >
                    {{ formattedDate(item.created_at) }}
                  </p>
                </div>
                <VSpacer />

                <div class="d-flex flex-column align-end">
                  <VIcon
                    size="10"
                    icon="tabler-circle-filled"
                    :color="item.status === 0 ? 'primary' : '#a8aaae'"
                    class="mb-2"
                    />
                  <VTooltip
                    v-if="item.status === 0"
                    location="bottom"
                    activator="parent"
                  >
                    <span>Mark as read</span>
                  </VTooltip>
                </div>
              </div>
            </VListItem>
          </template>
        </VList>
        <!-- pagination -->
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalNotifications"
          />
      </template>
      <!-- 👉 Empty Notifications -->
			<template v-else>
				<EmptyData
					:orientation="1"
					:border="false"
					:img-src="imgFileBox"
					title="Notifikasi Kosong"
					description="Saat ini toko anda belum memiliki notifikasi"
					/>
			</template>

    </VCardText>
  </VCard>
</template>

<style lang="scss">
.notification-list thead.v-data-table__thead {
	display: none !important;
}

.notification-section {
  padding-block: 0.75rem;
  padding-inline: 1rem;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notification-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;
    padding-block: 0.75rem !important;
  }
}

// Badge Style Override for Notification Badge
.notification-badge {
  .v-badge__badge {
    /* stylelint-disable-next-line liberty/use-logical-spec */
    min-width: 18px;
    padding: 0;
    block-size: 18px;
  }
}
</style>
