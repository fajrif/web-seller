<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  transactionTypeName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Number,
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
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  backgroundColor: {
    type: String,
    required: false,
    default: 'bg-light-blue',
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog Content -->
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <div class="d-flex flex-column justify-center text-center">
              <h3 class="mb-2">View History</h3>
              <p class="text-body-2 mb-0">
                Data detil riwayat transaksi
              </p>
            </div>
          </VCol>
          <VCol cols="12">
            <div
              class="d-flex justify-center rounded py-6 px-4 mb-2"
              :class="props.backgroundColor"
              >
              <div class="me-auto">
                <p class="mb-2">
                  Transaksi
                </p>
                <p class="mb-2">
                  Status
                </p>
                <p class="mb-2">
                  Tanggal
                </p>
                <p v-if="!isEmpty(props.bankName)" class="mb-2">
                  Bank
                </p>
                <p v-if="!isEmpty(props.accountNo)" class="mb-2">
                  Nomor Rekening
                </p>
                <p v-if="!isEmpty(props.accountName)" class="mb-2">
                  Pemilik Rekening
                </p>
                <p class="mb-0">
                  Nominal
                </p>
              </div>

              <div class="ms-auto text-end">
                <p class="fw-700 mb-2">
                  {{ resolveBalanceType(props.transactionTypeName).text }}
                </p>
                <p class="fw-700 mb-2">
                  <VChip
                    label
                    :color="resolveBalanceStatus[props.status]"
                    size="small"
                    >
                    {{ toTitleCase(props.status) }}
                  </VChip>
                </p>
                <p class="fw-700 mb-2">
                  {{ toLocaleDateTime(props.orderDate) }}
                </p>
                <p v-if="!isEmpty(props.bankName)" class="fw-700 mb-2">
                  {{ props.bankName }}
                </p>
                <p v-if="!isEmpty(props.accountNo)" class="fw-700 mb-2">
                  {{ props.accountNo }}
                </p>
                <p v-if="!isEmpty(props.accountName)" class="fw-700 mb-2">
                  {{ props.accountName }}
                </p>
                <p class="fw-700 mb-0"
                  :class="resolveTransactionAmount(props.transactionTypeName, props.amount).color"
                  >
                  {{ resolveTransactionAmount(props.transactionTypeName, props.amount).text }}
                </p>
              </div>
            </div>
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-center gap-3 flex-wrap">
              <VBtn @click="onReset">
                Tutup
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
