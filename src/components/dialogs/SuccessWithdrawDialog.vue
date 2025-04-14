<script setup>
import iconWait from '@images/icons/ic-wait.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const onClose = () => {
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onClose"
  >
    <!-- Dialog Content -->
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <div class="d-flex flex-column justify-center text-center">
              <h6 class="text-h6">{{ props.bankName }}</h6>
              <h3>{{ props.accountNo }}</h3>
              <h6 class="text-h6">{{ props.accountName }}</h6>
              <VImg
                :src="iconWait"
                class="mx-auto my-2"
                width="100"
              />
              <h4 class="text-h4">{{ props.title }}</h4>
              <p class="text-body-1">
                {{ props.orderDate }}
              </p>
              <h3 class="text-h3">{{ toCurrency(props.totalAmount) }}</h3>
              <p class="text-body-1 mb-0 mx-6">
                {{ props.message }}
              </p>
            </div>
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap justify-center text-center">
              <VBtn
                color="primary"
                @click="onClose"
                >
                Tutup
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
