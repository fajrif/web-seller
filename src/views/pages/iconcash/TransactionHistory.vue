<script setup>
const props = defineProps({
  triggerReset: {
    type: Boolean,
    required: true,
  },
})

const isLoggedInIconCash = ref(false)
const isViewHistoryTransaksiDialogVisible = ref(false)

// Data table options
const page = ref(1)
const dateRange = ref('')
const startDate = ref('')
const endDate = ref('')

const tipe = ref('')
const status = ref('')
const orderDate = ref(0)
const bankName = ref('')
const accountNo = ref('')
const accountName = ref('')
const amount = ref(0)

const getSyncData = computed(() => {
  return page.value == 1
})

const {
  data: dataBalances,
  execute: fetchBalances, isFinished: loading,
} = await useApiCore(createUrl('/iconcash/history/saldo-pendapatanv2', {
  query: {
    start_date: startDate,
    end_date: endDate,
    page,
    sync_data: getSyncData
  },
}))

const transactions = computed(() => {
  var _data = []
  if(dataBalances.value?.data?.data) {
    isLoggedInIconCash.value = true
    _data = dataBalances.value.data.data
  } else {
    isLoggedInIconCash.value = false
  }
  return _data
})

const totalTransaction = computed(() => dataBalances.value.data.total)

const openViewTransaksi = (id) => {
  var obj = transactions.value.find((t) => t.order_id === id)
  if(obj){
    tipe.value = obj.transaction_type_name
    status.value = obj.status
    bankName.value = obj.bank_name
    accountNo.value = obj.beneficiary_account
    accountName.value = obj.beneficiary_name
    amount.value = obj.amount
    orderDate.value = obj.transaction_date
    isViewHistoryTransaksiDialogVisible.value = true
  }
}

watch(() => props.triggerReset, (newVal, oldVal) => {
	if(newVal !== oldVal){
    page.value = 1
		fetchBalances()
	}
});

watch(dateRange, (newVal, oldVal) => {
  page.value = 1
  if (newVal !== null && newVal !== oldVal) {
		var arr = newVal.split(' to ')
		startDate.value = arr[0]
		endDate.value = arr[0]
		if(arr.length > 1){
			endDate.value = arr[1]
		}
  } else {
    startDate.value = ''
    endDate.value = ''
  }
  fetchBalances()
})

const headersTransaction = [
  {
    title: 'TRANSAKSI',
    sortable: false,
    key: 'transaksi',
  },
  {
    title: 'TANGGAL',
    sortable: false,
    key: 'tanggal',
  },
  {
    title: 'STATUS',
    sortable: false,
    key: 'status',
  },
  {
    title: 'NOMINAL',
    sortable: false,
    key: 'nominal',
  },
]
</script>

<template>
  <VCard>
    <VCardText v-if="transactions && isLoggedInIconCash">
      <div class="d-flex flex-wrap gap-4 mb-6">
        <div class="d-flex align-center">
          <h4 class="text-h4 font-weight-medium">History Transaksi</h4>
        </div>
        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppDateTimePicker
            v-model="dateRange"
            placeholder="Pilih Tanggal"
            style="inline-size: 200px;"
            :disabled="!loading"
            :config="{ mode: 'range' }"
            />
        </div>
      </div>
      <VDataTable
        v-if="!isEmpty(transactions)"
        :headers="headersTransaction"
        :items="transactions"
        :items-per-page="10"
        :loading="!loading"
      >
        <!-- Transaksi -->
        <template #item.transaksi="{ item }">
          <div class="d-flex align-center my-3">
            <VAvatar
              color="primary"
              variant="tonal"
              rounded
              size="38"
              class="me-4"
              >
              <VIcon
                :icon="resolveBalanceType(item.transaction_type_name).icon"
                size="26"
                />
            </VAvatar>
            <div>
              <a
                href="#"
                class="d-block font-weight-medium text-base mb-0 text-high-emphasis"
                @click="openViewTransaksi(item.order_id)"
                >
                {{ resolveBalanceType(item.transaction_type_name).text }}
              </a>
              <template v-if="!isEmpty(item.order)">
                <RouterLink :to="{ name: 'pesanan-view-id', params: { id: item.order.id } }">
                  <small class="text-sm text-secondary font-weight-regular">{{ item.order.trx_no }}</small>
                </RouterLink>
              </template>
            </div>
          </div>
        </template>
        <!-- Tanggal -->
        <template #item.tanggal="{ item }">
          <span class="text-high-emphasis text-body-2 mb-0">
            {{ toLocaleDateTime(item.transaction_date) }}
          </span>
        </template>
        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            label
            :color="resolveBalanceStatus[item.status]"
            size="small"
            >
            {{ toTitleCase(item.status) }}
          </VChip>
        </template>
        <!-- Status -->
        <template #item.nominal="{ item }">
          <div
            class="text-high-emphasis font-weight-bold"
            :class="resolveTransactionAmount(item.transaction_type_name, item.amount_fee).color"
            >
            {{ resolveTransactionAmount(item.transaction_type_name, item.amount_fee).text }}
          </div>
        </template>
        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="10"
            :total-items="totalTransaction"
            />
        </template>
      </VDataTable>
      <!-- 👉 Empty Transaction History -->
      <template v-else>
        <EmptyData
          description="Anda belum memiliki transaksi history<br/>Silahkan lakukan transaksi pada iconcash anda."
          wrapper-class="px-10 py-15"
          />
      </template>
    </VCardText>
    <VCardText v-else>
      <VTable class="text-no-wrap transaction-table">
        <tbody>
          <tr>
            <td><v-skeleton-loader type="list-item-avatar"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="paragraph"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="paragraph"></v-skeleton-loader></td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
  <ViewHistoryTransaksiDialog
    v-model:is-dialog-visible="isViewHistoryTransaksiDialogVisible"
    v-model:transaction-type-name="tipe"
    v-model:status="status"
    v-model:order-date="orderDate"
    v-model:bank-name="bankName"
    v-model:account-no="accountNo"
    v-model:account-name="accountName"
    v-model:amount="amount"
  />
</template>

<style lang="scss">
.transaction-table {
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
    border-block-end: none !important;
  }
}
</style>
