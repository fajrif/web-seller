<script setup>
import { useMessageStore } from '@core/stores/config'

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
  shippingType: {
    type: String,
    required: true,
    default: '',
  },
  isPickup: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDropPoint: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
  'formSubmittedGenerateResi',
])

const messageStore = useMessageStore()
const refForm = ref()
const orderData = ref()
const addressDetail = ref('')
const imgLogistic = ref('')
const toggleMode = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')

const statusSelected = computed(() => !isEmpty(selectedDate.value) && !isEmpty(selectedTime.value))
const selectedTimeText = computed(() => {
  const selectedItem = timeOptionsJemput.find(item => item.value === selectedTime.value);
  return selectedItem ? selectedItem.label : '';
})

const toggleRequestPickUp = () => {
  toggleMode.value = !toggleMode.value
}

const checkDateTime = (time) => {
  if(isEmpty(selectedDate.value)) {
    return false;
  } else {
    if(isDateToday(selectedDate.value)){
      return isMoreThanHour(time);
    } else {
      return false;
    }
  }
}

const checkDateChanges = (val) => {
  selectedTime.value = ''
}

const generateResiOtomatis = () => {
  emit('formSubmittedGenerateResi', props.orderId)
  onReset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  selectedDate.value = ''
  selectedTime.value = ''
  toggleMode.value = false
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // or this one
      emit('formSubmitted', props.orderId, selectedDate.value + ' ' + selectedTime.value)
      onReset()
    }
  })
}

watch(() => props.isDialogVisible, async (visible) => {
  try {
    if (visible) {
      window.scrollTo(0,0);
      const { data: orderDetails, execute: fetchOrder } = await useApiCore(`/seller/query/transaction/detail/${ props.orderId }`)
      if (orderDetails.value?.status == 200) {
        orderData.value = orderDetails.value.data
        addressDetail.value = resolveCompleteAddress(orderData.value.merchant, false)
        imgLogistic.value = orderData.value.delivery.image_logistic
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
    min-height="380"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
      <VForm
        ref="refForm"
        @submit.prevent="onSubmit"
      >
        <!-- 👉 Title -->
        <VCardItem class="pb-0">
          <VCardTitle>
            <h4 class="text-h4 mb-0">
              Request Pick Up (Order ID: #{{ props.orderId }})
            </h4>
          </VCardTitle>
        </VCardItem>
        <VCardText class="py-2">
          <VRow>
            <template v-if="toggleMode">
              <VCol cols="12" class="pb-0">
                <AppTextarea
                  v-model="addressDetail"
                  prepend-inner-icon="tabler-map-pin"
                  label="Lokasi Penjemputan"
                  placeholder="Alamat penjemputan"
                  readonly
                  rows="2"
                  />
              </VCol>
              <VCol cols="6" class="pb-0">
                <AppDateTimePicker
                  v-model="selectedDate"
                  label="Tanggal"
                  prepend-inner-icon="tabler-calendar"
                  placeholder="Pilih tanggal"
                  @update:model-value="checkDateChanges"
                  :config="{ enableTime: false, dateFormat: 'Y-m-d', minDate: 'today' }"
                  />
              </VCol>
              <VCol cols="6" class="pb-0">
                <AppSelect
                  v-model="selectedTime"
                  :items="timeOptionsJemput"
                  item-title="label"
                  item-value="value"
                  :disabled="isEmpty(selectedDate)"
                  label="Waktu"
                  prepend-inner-icon="tabler-clock"
                  placeholder="Pilih waktu"
                  >
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :disabled="checkDateTime(item.raw.limit)"
                    ></v-list-item>
                  </template>
                </AppSelect>
              </VCol>
              <VCol v-show="statusSelected" cols="12" class="pb-0">
                <h6 class="text-h6 mb-2">
                  Detail Request Pick Up
                </h6>
                <div class="border px-4 py-0">
                  <div class="d-flex align-center gap-4 mb-2">
                    <v-img
                      style="max-width:80px"
                      :width="80"
                      cover
                      :src="imgLogistic"
                      ></v-img>
                    <div>
                      <h6 class="text-h6">
                        {{ props.shippingType }}
                      </h6>
                      <p class="text-body-2 mb-0">
                        Estimasi penjemputan hingga <strong>{{ toLocaleDateTime(selectedDate,'dddd, DD MMMM YYYY') }} {{ selectedTimeText }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </VCol>
            </template>
            <template v-else>
              <VCol
                v-if="props.isPickup === true"
                cols="12" class="pb-0">
                <div
                  class="border cursor-pointer pa-4"
                  @click="toggleRequestPickUp"
                  >
                  <div class="d-flex justify-space-between align-center gap-4 mb-2">
                    <VAvatar
                      rounded="lg"
                      color="info"
                      variant="tonal"
                      icon="tabler-truck-delivery"
                      />
                    <div>
                      <h6 class="text-h6">
                        Request Pick Up
                      </h6>
                      <p class="text-body-2 mb-0">
                        Kurir {{ props.shippingType }} akan mengambil paket ke alamat anda
                      </p>
                    </div>
                    <IconBtn
                      color="secondary"
                      icon="tabler-chevron-right"
                      @click="toggleRequestPickUp"
                      />
                  </div>
                </div>
              </VCol>
              <VCol
                v-if="props.isDropPoint === true"
                cols="12" class="pb-0">
                <div
                  class="border cursor-pointer pa-4"
                  @click="generateResiOtomatis"
                  >
                  <div class="d-flex justify-space-between align-center gap-4 mb-2">
                    <VAvatar
                      rounded="lg"
                      color="info"
                      variant="tonal"
                      icon="tabler-receipt"
                    />
                    <div>
                      <h6 class="text-h6">
                        Generate Resi Otomatis
                      </h6>
                      <p class="text-body-2 mb-0">
                        Resi akan digenerate secara otomatis. Cetak resi
                        dan tempelkan pada paket Anda. Anda dapat
                        mengirimkan paket Anda ke counter terdekat
                      </p>
                    </div>
                    <IconBtn
                      color="secondary"
                      icon="tabler-chevron-right"
                      @click="generateResiOtomatis"
                    />
                  </div>
                </div>
              </VCol>
            </template>
            <VCol cols="12">
              <ShipmentOrderInfo
                :is-show-info="toggleMode"
                />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText v-show="statusSelected">
          <VBtn
            type="submit"
            class="w-100"
          >
            Request Pick Up
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
