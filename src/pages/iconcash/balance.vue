<script setup>
import logoIconCash from '@images/logos/iconcash-logo.png'
import CurrentBalance from '@/views/pages/iconcash/CurrentBalance.vue'
import TransactionHistory from '@/views/pages/iconcash/TransactionHistory.vue'
import BankOptions from '@/views/pages/iconcash/BankOptions.vue'

const triggerReset = ref(false)

const reloadCards = () => {
  triggerReset.value = !triggerReset.value
}

</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" class="pb-0">
        <div class="d-flex flex-wrap align-center">
          <div class="me-4">
            <VImg
              :src="logoIconCash"
              width="50"
              />
          </div>
          <h4 class="text-h4 font-weight-medium">
            ICON Cash Dashboard
          </h4>
        </div>
      </VCol>
    </VRow>
    <!-- 👉 Dashboard Balance -->
    <VRow>
      <VCol
        cols="12"
        md="8"
        >
        <VRow>
          <VCol cols="12">
            <!-- 👉 Current Balance -->
            <CurrentBalance
              :display-history="false"
              :display-change-pin="true"
              @finish-updated="reloadCards"
              />
          </VCol>
          <VCol cols="12">
            <!-- 👉 Transaction History -->
            <TransactionHistory
              :trigger-reset="triggerReset"
              />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Bank Options -->
      <VCol
        cols="12"
        md="4"
        >
        <BankOptions
					:trigger-reset="triggerReset"
          />
      </VCol>
    </VRow>
  </div>
</template>
