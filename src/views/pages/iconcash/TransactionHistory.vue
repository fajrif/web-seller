<script setup>
const props = defineProps({
  triggerReset: {
    type: Boolean,
    required: true,
  },
})

const isLoggedInIconCash = ref(false)

const { data: dataBalances, execute: fetchBalances, isFinished: loading } = await useApiCore("/iconcash/history/saldo-pendapatan?page=1")

const transactions = computed(() => {
  var _data = []
  if(dataBalances.value?.data) {
    isLoggedInIconCash.value = true
    _data = dataBalances.value.data.filter((t) => t.source_account_type === "Saldo Pendapatan")
  } else {
    isLoggedInIconCash.value = false
  }
  return _data
})

const getPaddingStyle = index => index ? 'padding-block-end: 1.5rem;' : 'padding-block: 1.5rem;'

watch(() => props.triggerReset, (newVal, oldVal) => {
	if(newVal !== oldVal){
		fetchBalances()
	}
});
</script>

<template>
  <VCard title="History Transaksi">
    <VCardText v-if="transactions && isLoggedInIconCash">
      <VTable
        v-if="!isEmpty(transactions)"
        class="text-no-wrap transaction-table">
        <thead>
          <tr>
            <th>TRANSAKSI</th>
            <th>TANGGAL</th>
            <th>STATUS</th>
            <th>NOMINAL</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in transactions"
            :key="index"
            >
            <td :style="getPaddingStyle(index)">
              <div class="d-flex align-center">
                <VAvatar
                  color="primary"
                  variant="tonal"
                  rounded
                  size="38"
                  class="me-4"
                  >
                  <VIcon
                    :icon="resolveBalanceType(transaction.transaction_type_name).icon"
                    size="26"
                    />
                </VAvatar>
                <div>
                  <p class="font-weight-medium text-base mb-0 text-high-emphasis">
                    {{ resolveBalanceType(transaction.transaction_type_name).text }}
                  </p>
                  <p class="text-sm mb-0">
                    {{ transaction.client_ref }}
                  </p>
                </div>
              </div>
            </td>
            <td :style="getPaddingStyle(index)">
              <p class="text-high-emphasis text-body-2 mb-0">
                {{ toLocaleDateTime(transaction.transaction_date) }}
              </p>
            </td>
            <td :style="getPaddingStyle(index)">
              <VChip
                label
                :color="resolveBalanceStatus[transaction.status]"
                size="small"
                >
                {{ toTitleCase(transaction.status) }}
              </VChip>
            </td>
            <td :style="getPaddingStyle(index)">
              <div
                class="text-high-emphasis font-weight-bold"
                :class="resolveTransactionAmount(transaction.transaction_type_name, transaction.amount_fee).color"
                >
                {{ resolveTransactionAmount(transaction.transaction_type_name, transaction.amount_fee).text }}
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
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
</template>

<style lang="scss">
.transaction-table {
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
    border-block-end: none !important;
  }
}
</style>
