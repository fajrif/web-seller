<script setup>
import img1 from '@images/icons/ic-rupiah.png'

const props = defineProps({
  displayChangePin: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const isLoggedInIconCash = ref(false)

const { data: dataBalance, execute: fetchBalance, isFinished: loading } = await useApiCore("/iconcash/query/balance/customer")

const currentSaldoPendapatan = computed(() => {
  var _saldo = 0
  if(!isEmpty(dataBalance.value.data)) {
    // change is logged in iconCash here..
    isLoggedInIconCash.value = true
    var obj = dataBalance.value.data.find((b) => parseInt(b.account_type) === 13)
    if(obj){
      _saldo = obj.balance
    }
  }
  return _saldo
})

</script>

<template>
  <VCard color="primary">
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
          >
          <div class="d-flex align-center">
            <VAvatar
              rounded
              size="54"
              class="me-4"
            >
              <VImg
                :src="img1"
                size="38"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6 text-medium-emphasis text-white">
                Saldo Pendapatan
              </h6>
              <h4 class="text-h4 text-white">
                {{ toCurrency(currentSaldoPendapatan) }}
              </h4>
              <a
                v-if="!isLoggedInIconCash"
                href="#"
                class="text-h6 text-medium-emphasis text-error"
              >
                Aktivasi ICON Cash
              </a>
            </div>
          </div>
        </VCol>
        <VCol
          class="d-flex align-center"
          cols="6"
          md="3"
        >
          <div class="d-flex align-center">
            <VAvatar
              rounded
              size="44"
              class="bg-white text-primary me-4"
            >
              <VIcon
                icon="tabler-wallet"
                size="28"
              />
            </VAvatar>
            <div>
              <a
                href="#"
                class="text-h6 text-medium-emphasis text-white"
              >
                Withdrawal
              </a>
            </div>
          </div>
        </VCol>
        <VCol
          class="d-flex align-center"
          cols="6"
          md="3"
        >
          <div
            v-if="displayChangePin"
            class="d-flex align-center mt2">
            <VAvatar
              rounded
              size="44"
              class="bg-white text-primary me-4"
            >
              <VIcon
                icon="tabler-square-key"
                size="28"
              />
            </VAvatar>
            <div>
              <a
                href="#"
                class="text-h6 text-medium-emphasis text-white"
              >
                Ganti PIN
              </a>
            </div>
          </div>
          <div
            v-else
            class="d-flex align-center mt2">
            <VAvatar
              rounded
              size="44"
              class="bg-white text-primary me-4"
            >
              <VIcon
                icon="tabler-rotate-2"
                size="28"
              />
            </VAvatar>
            <div>
              <RouterLink :to="{ name: 'iconcash-balance' }">
                <small class="text-h6 text-medium-emphasis text-white">History</small>
              </RouterLink>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <!-- 👉 Overlay -->
    <VOverlay
      v-show="loading"
      contained
      persistent
      scroll-strategy="none"
      class="align-center justify-center"
    >
      <VProgressCircular indeterminate />
    </VOverlay>
  </VCard>
</template>
