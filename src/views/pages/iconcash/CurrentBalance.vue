<script setup>
import { useUserDataStore } from '@core/stores/config'
import logoSuccessBlue from '@images/icons/ic-success-info.png'
import img1 from '@images/icons/ic-rupiah.png'
import logoIconCash from '@images/logos/iconcash-logo.png'

const props = defineProps({
  displayWithdrawal: {
    type: Boolean,
    required: false,
    default: true,
  },
  displayHistory: {
    type: Boolean,
    required: false,
    default: true,
  },
  displayChangePin: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits([
  'finishUpdated',
])

const userData = useUserDataStore()

const loading = ref(false)
const isLoggedInIconCash = ref(false)
const isActivationIconCashDialogVisible = ref(false)
const isChangeIconCashPinDialogVisible = ref(false)
const isSuccessConfirmationDialogVisible = ref(false)

const currentSaldoPendapatan = ref(0)
const sourceAccountId = ref(null)
const phone = ref('')
const title = ref('')
const message = ref('')
const imgWidth = 70


const loadingState = computed(() => !loading)
const activeCursor = computed(() => isLoggedInIconCash.value === true ? 'pointer' : 'initial')

const openActivationDialog = () => {
  phone.value = userData.phone
  isActivationIconCashDialogVisible.value = true
}

const openChangePinDialog = () => {
  if(isLoggedInIconCash.value === true) {
   phone.value = userData.phone
   isChangeIconCashPinDialogVisible.value = true
  }
}

const finishActivation = async () => {
  reloadCardBalance();
  title.value = "Aktivasi Berhasil"
  message.value = "Selamat Anda telah berhasil mengaktifkan ICON Cash Anda."
  isSuccessConfirmationDialogVisible.value = true
  emit('finishUpdated')
}

const finishChangePin = async () => {
  reloadCardBalance();
  title.value = "Ganti PIN Berhasil"
  message.value = "Selamat PIN Anda telah berhasil diperbarui."
  isSuccessConfirmationDialogVisible.value = true
  emit('finishUpdated')
}

const reloadCardBalance = async () => {
  loading.value = true
  const { data: dataBalance } = await useApiCore("/iconcash/query/balance/customer")
  if(dataBalance.value?.data) {
    if(!isEmpty(dataBalance.value.data)) {
      // is logged in iconCash here..
      isLoggedInIconCash.value = true
      var obj = dataBalance.value.data.find((b) => parseInt(b.account_type) === 13)
      if(obj){
        sourceAccountId.value = obj.id
        currentSaldoPendapatan.value = obj.balance
      }
    }
  } else {
    isLoggedInIconCash.value = false
    sourceAccountId.value = null
    currentSaldoPendapatan.value = 0
  }
  loading.value = false
}

defineExpose({
  isLoggedInIconCash,
  currentSaldoPendapatan,
  sourceAccountId,
})

reloadCardBalance();
</script>

<template>
  <div>
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
                  :src="isLoggedInIconCash ? img1 : logoIconCash"
                  size="38"
                  />
              </VAvatar>
              <div>
                <template v-if="isLoggedInIconCash">
                  <h6 class="text-h6 text-medium-emphasis text-white">
                    Saldo Pendapatan
                  </h6>
                  <h4 class="text-h4 text-white">
                    {{ toCurrency(currentSaldoPendapatan) }}
                  </h4>
                </template>
                <template v-else>
                  <a
                    style="cursor:pointer"
                    class="text-h6 text-medium-emphasis text-white"
                    @click="openActivationDialog"
                    >
                    Aktivasi ICON Cash
                  </a>
                  <VTooltip
                    location="top"
                    >
                    <template #activator="{ props }">
                      <VIcon
                        v-bind="props"
                        class="ms-2"
                        icon="tabler-help-circle"
                        color="error"
                        />
                    </template>
                    <span>
                      Anda belum aktivasi iconcash atau token telah expired<br/>
                      (klik pada link berikut untuk melakukan aktivasi)
                    </span>
                  </VTooltip>
                </template>
              </div>
            </div>
          </VCol>
          <VCol
            class="d-flex align-center"
            cols="6"
            md="3"
            >
            <div
              v-if="props.displayWithdrawal"
              class="d-flex align-center">
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
                <component
                  :is="isLoggedInIconCash ? 'router-link' : 'span'"
                  :to="{ name: 'iconcash-withdraw' }">
                  <small class="text-h6 text-medium-emphasis text-white">Withdrawal</small>
                </component>
              </div>
            </div>
          </VCol>
          <VCol
            class="d-flex align-center"
            cols="6"
            md="3"
            >
            <div
              v-if="props.displayHistory"
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
                <component
                  :is="isLoggedInIconCash ? 'router-link' : 'span'"
                  :to="{ name: 'iconcash-balance' }">
                  <small class="text-h6 text-medium-emphasis text-white">History</small>
                </component>
              </div>
            </div>
            <div
              v-if="props.displayChangePin"
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
                  :style="{ cursor: activeCursor }"
                  class="text-h6 text-medium-emphasis text-white"
                  @click="openChangePinDialog"
                  >
                  Ganti PIN
                </a>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <!-- 👉 Overlay -->
      <VOverlay
        v-model="loadingState"
        contained
        persistent
        scroll-strategy="none"
        class="align-center justify-center"
      >
        <VProgressCircular indeterminate />
      </VOverlay>
    </VCard>
    <ActivationIconCashDialog
      v-model:is-dialog-visible="isActivationIconCashDialogVisible"
      v-model:phone="phone"
      @form-activation-submitted="finishActivation"
      @form-forgot-submitted="finishChangePin"
    />
    <ChangeIconCashPinDialog
      v-model:is-dialog-visible="isChangeIconCashPinDialogVisible"
      v-model:phone="phone"
      @form-submitted="finishChangePin"
    />
    <SuccessConfirmationDialog
      v-model:is-dialog-visible="isSuccessConfirmationDialogVisible"
      v-model:title="title"
      v-model:message="message"
      :img-src="logoSuccessBlue"
      :img-width="imgWidth"
    />
  </div>
</template>
