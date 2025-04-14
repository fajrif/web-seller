<script setup>
import { useUserDataStore } from '@core/stores/config'
import { useMessageStore } from '@core/stores/config'
import CurrentBalance from '@/views/pages/iconcash/CurrentBalance.vue'
import bgBanks from '@images/illustrations/bg-banks.png'

const userData = useUserDataStore()
const messageStore = useMessageStore()

const isConfirmationWithdrawDialogVisible = ref(false)
const isSuccessWithdrawDialogVisible = ref(false)
const loading = ref(false)

const refCardBalance = ref(null)
const refForm = ref()
const jmlPenarikan = ref()
const withdrawAll = ref(false)
const selectedBank = ref(0)
const phone = ref('')

const orderId = ref(0)
const orderDate = ref('')
const bankName = ref('')
const accountNo = ref('')
const accountName = ref('')
const amount = ref(0)
const adminFee = ref(0)
const totalAmount = ref(0)
const title = ref('')
const message = ref('')


const { data: dataBanks, execute: fetchBanks } = await useApiCore("/iconcash/query/customerbank/search")

const banks = computed(() => dataBanks.value.data)

const isLoggedInIconCash = computed(() => {
  let _isLoggedIn = false
  _isLoggedIn = refCardBalance.value?.$.exposed.isLoggedInIconCash.value
  return _isLoggedIn
})

const currentSaldoPendapatan = computed(() => {
  let _currentSaldo = 0
  _currentSaldo = refCardBalance.value?.$.exposed.currentSaldoPendapatan.value
  return _currentSaldo
})

const sourceAccountId = computed(() => {
  let _sourceAccountId = null
  _sourceAccountId = refCardBalance.value?.$.exposed.sourceAccountId.value
  return _sourceAccountId
})

const onChangeWithdrawAll = () => {
  if(withdrawAll.value) {
    jmlPenarikan.value = currentSaldoPendapatan.value
  } else {
    jmlPenarikan.value = 0
  }
}

const ableToWithdraw = computed(() => currentSaldoPendapatan == 0 || isEmpty(banks))

const displayWithdrawSuccess = async (data) => {
  try {
    orderId.value = data.order_id
    bankName.value = data.bank_name
    accountNo.value = data.bank_account_no
    accountName.value = data.bank_account_name
    totalAmount.value = data.total

    var date = new Date();
    orderDate.value = formattedDate(date.toLocaleString())
    title.value = "Permohonan Terkirim"
    message.value = "Request withdrawal akan diproses dalam jangka waktu H+2 hari kerja"

    isSuccessWithdrawDialogVisible.value = true

  } catch (error) {
		messageStore.setMessage('error', 'Gagal melakukan penarikan saldo')
    console.error("Error on iconcash withdraw:", error)
  }
}

const withdrawInquiry = async (bank, nominal, sourceId) => {
  try {
    /* eslint-disable camelcase */
    const res = await $apiCore('/iconcash/command/disbursement/inquiry', {
      method: 'POST',
      body: {
        bank_account_name: bank.account_name,
        bank_account_no: bank.account_number,
        bank_id: bank.bank.id,
        nominal: nominal,
        source_account_id: sourceId
      },
      ignoreResponseError: true
    })
    /* eslint-enable */

    if(res.data) {
      phone.value = userData.phone
      orderId.value = res.data.order_id
      bankName.value = res.data.bank_name
      accountNo.value = res.data.bank_account_no
      accountName.value = res.data.bank_account_name
      adminFee.value = parseInt(res.data.admin_fee) + parseInt(res.data.fee)
      amount.value = parseInt(res.data.nominal) - adminFee.value
      totalAmount.value = amount.value + adminFee.value

      isConfirmationWithdrawDialogVisible.value = true
      loading.value = false
    } else {
      throw res.message
    }

  } catch (error) {
    loading.value = false
		messageStore.setMessage('error', error)
    console.error("Error on iconcash withdraw inquiry:", error)
  }
}

const clearVariables = () => {
  orderId.value = 0
  orderDate.value = ''
  bankName.value = ''
  accountNo.value = ''
  accountName.value = ''
  amount.value = 0
  adminFee.value = 0
  totalAmount.value = 0
  title.value = ''
  message.value = ''
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      try {
        loading.value = true
        clearVariables()
        var bank = banks.value[selectedBank.value]
        if(isEmpty(bank)) throw "Data akun bank tidak dipilih";
        if(isEmpty(sourceAccountId.value)) throw "Data source account ID tidak ditemukan";
        withdrawInquiry(bank, jmlPenarikan.value, sourceAccountId.value)
      }
      catch(err) {
        messageStore.setMessage('error', err)
        loading.value = false
      }
    }
  })
}

watch(isLoggedInIconCash, (val, oldVal) => {
	 if (val !== oldVal) {
     fetchBanks()
	 }
})

</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="8" offset-md="2">
        <VRow>
          <VCol cols="12" class="pb-0">
            <div class="d-flex flex-wrap align-center">
              <VBtn
                icon="tabler-arrow-narrow-left"
                variant="text"
                color="black"
                class="me-1"
                @click="$router.go(-1)"
              />
              <h4 class="text-h4 font-weight-medium">
                Withdraw
              </h4>
            </div>
          </VCol>
        </VRow>
        <!-- 👉 Withdraw Balance -->
        <VRow>
          <VCol
            cols="12"
            >
            <VRow>
              <VCol cols="12">
                <!-- 👉 Current Balance -->
                <CurrentBalance
                  ref="refCardBalance"
                  :display-withdrawal="false"
                  :display-history="false"
                  />
              </VCol>
              <VCol cols="12">
                <!-- 👉 Jml Penarikan -->
                <VCard v-if="isLoggedInIconCash">
                  <VForm
                    ref="refForm"
                    @submit.prevent="onSubmit"
                    >
                    <VCardText>
                      <div class="mb-4">
                        <AppCurrencyInput
                          v-model="jmlPenarikan"
                          label="Jumlah Penarikan"
                          :disabled="loading"
                          :rules="[requiredValidator, minIntegerValidator(jmlPenarikan,25000)]"
                          class="mb-4"
                          />
                        <div class="d-flex flex-raw align-center justify-start mt-20">
                          <VSwitch
                            v-model="withdrawAll"
                            density="compact"
                            :disabled="loading"
                            @update:model-value="onChangeWithdrawAll"
                            />
                          <span class="fw-600 ms-4">Tarik Semua Saldo</span>
                        </div>
                      </div>

                      <div class="d-flex flex-wrap justify-space-between align-start mb-5">
                        <div class="d-flex flex-column align-start">
                          <h6 class="text-h6 font-weight-bold">
                            Pilih Akun Bank
                          </h6>
                          <p class="text-body-2 font-weight-medium mb-0">
                            Penarikan dana Anda akan ditransfer ke rekening tujuan yang dipilih
                          </p>
                        </div>
                        <div class="text-end pa-2">
                          <RouterLink :to="{ name: 'iconcash-bank' }">
                            <small class="text-h6 text-medium-emphasis text-primary">Atur Bank</small>
                          </RouterLink>
                        </div>
                      </div>

                      <v-sheet
                        class="mx-auto"
                        elevation="0"
                        style="background-color:#f8f8f8"
                        max-width="800"
                      >
                        <p v-if="isEmpty(banks)"
                          class="text-error text-center"
                         >
                         Akun bank tidak ditemukan
                        </p>
                        <v-slide-group
                          v-else
                          v-model="selectedBank"
                          class="pa-4"
                          :center-active="true"
                          :disabled="loading"
                          mandatory
                          show-arrows
                        >
                          <v-slide-group-item
                            v-for="item in banks"
                            :key="item.id"
                            v-slot="{ isSelected, toggle, selectedClass }"
                          >
                            <v-card
                              :class="['ma-4', 'banks-background', selectedClass]"
                              :style="{ backgroundImage: 'url(' + bgBanks + ')' }"
                              color="grey-lighten-1"
                              height="fit-content"
                              width="300"
                              @click="toggle"
                            >
                              <div class="d-flex flex-column align-start justify-start w-100 py-2 px-4">
                                <div class="d-flex justify-space-between w-100 mb-2">
                                  <div>
                                    <VImg
                                      :src="resolveBankLogo(item.bank.id)"
                                      width="100"
                                      height="50"
                                      />
                                  </div>
                                  <div>
                                    <v-scale-transition>
                                      <v-icon
                                        v-if="isSelected"
                                        color="success"
                                        icon="tabler-circle-check"
                                        size="32"
                                        ></v-icon>
                                    </v-scale-transition>
                                  </div>
                                </div>
                                <h6 class="text-h6 pt-2 mb-1">
                                  {{ item.account_number }}
                                </h6>
                                <h6 class="text-h6 font-weight-bold mb-0">
                                  {{ item.account_name }}
                                </h6>
                              </div>
                            </v-card>
                          </v-slide-group-item>
                        </v-slide-group>
                      </v-sheet>
                      <VBtn
                        type="submit"
                        :disabled="ableToWithdraw"
                        :loading="loading"
                        class="w-100 mt-4"
                      >
                        Konfirmasi Penarikan Saldo
                      </VBtn>
                    </VCardText>
                  </VForm>
                </VCard>
                <v-skeleton-loader
                  v-else
                  :elevation="2"
                  type="card">
                </v-skeleton-loader>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
    <ConfirmationWithdrawDialog
      v-model:is-dialog-visible="isConfirmationWithdrawDialogVisible"
      v-model:order-id="orderId"
      v-model:phone="phone"
      v-model:bank-name="bankName"
      v-model:account-no="accountNo"
      v-model:account-name="accountName"
      v-model:amount="amount"
      v-model:admin-fee="adminFee"
      v-model:total-amount="totalAmount"
      @form-submitted="displayWithdrawSuccess"
    />
    <SuccessWithdrawDialog
      v-model:is-dialog-visible="isSuccessWithdrawDialogVisible"
      v-model:title="title"
      v-model:message="message"
      v-model:bank-name="bankName"
      v-model:account-no="accountNo"
      v-model:account-name="accountName"
      v-model:order-date="orderDate"
      v-model:total-amount="totalAmount"
    />
  </div>
</template>

<style lang="scss">
.v-slide-group__next, .v-slide-group__prev {
  flex-basis: auto !important;
  min-width: auto !important;
}
</style>
