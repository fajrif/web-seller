<script setup>

const { data: dataBalances, execute: fetchBalances, isFinished: loading } = await useApiCore("/iconcash/history/saldo-pendapatan")

const transactions = computed(() => dataBalances.value.data.filter((t) => t.source_account_type === "Saldo Pendapatan"))

const getPaddingStyle = index => index ? 'padding-block-end: 1.5rem;' : 'padding-block: 1.5rem;'
</script>

<template>
  <VCard title="History Transaksi">
    <VCardText>
      <VTable class="text-no-wrap transaction-table">
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
