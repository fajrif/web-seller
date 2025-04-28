<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
    default: 0,
  },
  orderDate: {
    type: String,
    required: true,
  },
  noResi: {
    type: String,
    required: true,
  },
  cityFrom: {
    type: String,
    required: true,
  },
  cityTo: {
    type: String,
    required: true,
  },
  shippingType: {
    type: String,
    required: true,
    default: '',
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const statusCourier = ref('')
const estimateDate = ref('')
const activeState = ref(0)
const orderData = ref()
const trackData = ref()
const dataTimeLine = ref([])

const onReset = () => {
  emit('update:isDialogVisible', false)
  statusCourier.value = ''
  estimateDate.value = ''
  orderData.value = null
  trackData.value = null
  activeState.value = 0
}

const getOrderData = async () => {
  const { data: orderDetails } = await useApiCore(`/seller/query/transaction/detail/${ props.orderId }`)
  if (orderDetails.value?.status == 200) {
    orderData.value = orderDetails.value.data
    let _progressActive = orderData.value.progress_active
    if(_progressActive) {
      let _data = resolveCustomShipment(_progressActive)
      dataTimeLine.value = [ { date: _progressActive.updated_at, description: _data.description }]
      statusCourier.value = _data.title
      activeState.value = _data.state
    }
    // set estimateDate
    let _orderDate = orderData.value.order_date
    let _num = orderData.value.delivery.estimate_delivered_day || 0
    estimateDate.value = getRespondTime(_orderDate, _num)
  }
}

const getTrackingData = async () => {
  const { data: trackingDetails } = await useApiCore(`/track/${ props.orderId }`)
  if (trackingDetails.value?.status == 200) {
    trackData.value = trackingDetails.value.data
    dataTimeLine.value = trackData.value.tracking
    if(!isEmpty(dataTimeLine.value)) {
      let obj = dataTimeLine.value[0]
      if(typeof obj === 'object') {
        statusCourier.value = obj.status_courier
        activeState.value = resolveStateShipment(obj.status)
      }
      estimateDate.value = toLocaleDateTime(trackData.value.estimate_delivered_date, 'DD MMM YYYY')
    }
  }
}

watch(() => props.isDialogVisible, (visible) => {
  try {
    if (visible) {
      if(props.shippingType == 'custom') {
        getOrderData()
      } else {
        getTrackingData()
      }
    }
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
      <!-- 👉 Title -->
      <VCardItem class="pb-0">
        <VCardTitle>
          <h4 class="text-h4 text-center mb-0">
            Lacak Pengiriman
          </h4>
        </VCardTitle>
      </VCardItem>
      <VCardText class="py-2">
        <VRow>
          <VCol cols="12">
            <!-- Draw timeline status pengiriman -->
            <div v-if="!isEmpty(dataTimeLine)">

              <h6 class="text-h6 text-center mb-2">
                {{ statusCourier }}
              </h6>
              <h6 class="text-body-2 text-center mb-1">
                No.Resi: {{ props.noResi }}
              </h6>

              <VTimeline
                align="start"
                line-inset="0"
                truncate-line="both"
                justify="center"
                density="default"
                direction="horizontal"
                class="mb-2 mx-6"
              >

                <!-- SECTION Timeline Item: Document -->
                <VTimelineItem
                  fill-dot
                  dot-color="white"
                  size="large"
                >
                  <template #icon>
                    <div class="v-timeline-avatar-wrapper rounded-circle">
                      <VAvatar
                        size="40"
                        :color="activeState >= 1 ? 'primary' : 'secondary'"
                      >
                        <VIcon
                          icon="tabler-archive"
                          size="25"
                        />
                      </VAvatar>
                    </div>
                  </template>
                </VTimelineItem>
                <!-- !SECTION -->

                <!-- SECTION Timeline Item: Delivery -->
                <VTimelineItem
                  fill-dot
                  dot-color="white"
                  size="large"
                >
                  <template #icon>
                    <div class="v-timeline-avatar-wrapper rounded-circle">
                      <VAvatar
                        size="40"
                        :color="activeState >= 2 ? 'primary' : 'secondary'"
                      >
                        <VIcon
                          icon="tabler-truck-delivery"
                          size="25"
                        />
                      </VAvatar>
                    </div>
                  </template>
                </VTimelineItem>
                <!-- !SECTION -->

                <!-- SECTION Timeline Item: Received -->
                <VTimelineItem
                  fill-dot
                  dot-color="white"
                  size="large"
                >
                  <template #icon>
                    <div class="v-timeline-avatar-wrapper rounded-circle">
                      <VAvatar
                        size="40"
                        :color="activeState >= 3 ? 'primary' : 'secondary'"
                      >
                        <VIcon
                          icon="tabler-package"
                          size="25"
                        />
                      </VAvatar>
                    </div>
                  </template>
                </VTimelineItem>
                <!-- !SECTION -->

                <!-- SECTION Timeline Item: Success -->
                <VTimelineItem
                  fill-dot
                  dot-color="white"
                  size="large"
                >
                  <template #icon>
                    <div class="v-timeline-avatar-wrapper rounded-circle">
                      <VAvatar
                        size="40"
                        :color="activeState >= 4 ? 'primary' : 'secondary'"
                      >
                        <VIcon
                          icon="tabler-circle-check"
                          size="25"
                        />
                      </VAvatar>
                    </div>
                  </template>
                </VTimelineItem>
                <!-- !SECTION -->

              </VTimeline>

              <div class="d-flex justify-space-between align-center gap-2 flex-wrap text-center mb-4">
                <div style="width:100px">
                  <small>{{ toLocaleDateTime(props.orderDate, 'DD MM YYYY') }}</small>
                  <span class="d-block fw-900 text-body-2">{{ props.cityFrom }}</span>
                </div>
                <div style="width:100px">
                  <small v-if="!isEmpty(estimateDate)">
                    {{ estimateDate }}
                  </small>
                  <small v-else>N/A</small>
                  <span class="d-block fw-900 text-body-2">{{ props.cityTo }}</span>
                </div>
              </div>

              <VTimeline
                side="end"
                align="start"
                line-inset="8"
                truncate-line="start"
                density="compact"
                >
                <template
                  v-for="(item, index) in dataTimeLine"
                  :key="index"
                  >
                  <!-- SECTION Timeline Item: status -->
                  <VTimelineItem
                    :dot-color="index === 0 ? 'primary' : 'secondary'"
                    size="x-small"
                    >
                    <span
                      class="app-timeline-title text-body-2"
                      :class="{ 'fw-600': index === 0 }"
                      >
                      {{ toLocaleDateTime(item.date) }}
                    </span>
                    <div
                      class="app-timeline-text mt-1"
                      :class="{ 'text-primary': index === 0 }"
                      >
                      {{ item.description }}
                    </div>
                  </VTimelineItem>
                  <!-- !SECTION -->
                </template>
              </VTimeline>
            </div>
            <!-- End Draw timeline status pengiriman -->
            <div v-else>
              <p class="text-body-1 font-weight-regular">
                Lacak pengiriman tidak dapat ditampilkan...
              </p>
            </div>

          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style>
.v-timeline-item .app-timeline-title {
  font-weight: 300;
}
</style>

