<script setup>
import notFoundImg from '@images/icons/ic-status.png'

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

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-if="notifications && totalNotifications > 0"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="notifHeaders"
        :items="notifications"
        :items-length="totalNotifications"
        :loading="!loading"
				class="notification-list"
      >
				<!-- 👉 Template Notifications -->
				<template #item.notification="{ item }">
					<div class="list-item-hover-class py-2">
						<!-- Slot: Prepend -->
						<!-- Handles Avatar: Image, Icon, Text -->
						<div class="d-flex align-start gap-4">
							<VAvatar :color="resolveIconType(item.title).color">
								<VIcon :icon="resolveIconType(item.title).icon" />
							</VAvatar>
							<div>
								<p class="text-md font-weight-bold mb-1">
									{{ item.title }}
								</p>
								<p
									class="text-body-2 mb-2"
									style=" letter-spacing: 0.4px !important; line-height: 18px;"
								>
									{{ item.message }}
								</p>
								<p
									class="text-sm text-disabled mb-0"
									style=" letter-spacing: 0.4px !important; line-height: 18px;"
								>
									{{ item.created_at }}
								</p>
							</div>
							<VSpacer />
						</div>
					</div>
				</template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalNotifications"
          />
        </template>
      </VDataTableServer>

      <!-- 👉 Empty Notifications -->
      <div
        v-else
        class="d-flex justify-center align-center pa-10 ma-10"
      >
        <div class="d-flex align-center">
          <VAvatar
            size="100"
            class="me-6"
          >
            <VImg
              :src="notFoundImg"
              class="mb-2"
            />
          </VAvatar>
          <div class="d-flex flex-column">
            <p
              class="text-body-2"
              style="width:350px"
            >
              Saat ini toko anda belum memiliki notifikasi
            </p>
          </div>
        </div>
      </div>

    </VCardText>
  </VCard>
</template>

<style lang="scss">
.notification-list thead.v-data-table__thead {
	display: none !important;
}
</style>
