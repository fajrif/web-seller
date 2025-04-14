<script setup>
import iconExclamation from '@images/icons/ic-excalamation.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
  },
  phone: {
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
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  adminFee: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
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
  'formSubmitted',
])

const isInputPin = ref(false)
const errorMessage = ref('')
const pin = ref('')
const isPinInserted = ref(false)
const isPinError = ref(false)

const onToggleNextInputPin = () => {
  pin.value = ''
  errorMessage.value = ''
	isPinInserted.value = false
  isPinError.value = false
  isInputPin.value = !isInputPin.value
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  isInputPin.value = false
  errorMessage.value = ''
  pin.value = ''
  isPinInserted.value = false
  isPinError.value = false
}

const sendWithdrawalRequest = async (orderId, hashedPin) => {
  try {
    const res = await $apiCore('/iconcash/command/disbursement', {
      method: 'POST',
      body: {
        order_id: orderId,
        pin: hashedPin,
      },
      ignoreResponseError: true
    })

    if(res.data) {
      emit('formSubmitted', res.data)
      onReset()
    } else {
      throw res.message
    }

  } catch (err) {
    isPinInserted.value = false
		isPinError.value = true
    errorMessage.value = err
  }
}

const onSubmit = () => {
  errorMessage.value = ''
	isPinInserted.value = true
  if(pin.value.length < 6) {
    errorMessage.value = 'Harap masukkan 6 digit PIN transaksi anda'
    isPinInserted.value = false
  } else {
    let inputString = props.phone + pin.value
    createHash(inputString).then((hashedPin) => {
      sendWithdrawalRequest(props.orderId,hashedPin)
    });
  }
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
			<VForm
				@submit.prevent="onSubmit"
				>
        <VCardText v-if="isInputPin">
          <VRow>
            <!-- OTP -->
            <VCol cols="12">
              <div class="d-flex flex-wrap align-center mb-2">
                <VBtn
                  icon="tabler-arrow-narrow-left"
                  variant="text"
                  color="black"
                  class="me-1"
                  @click="onToggleNextInputPin"
                />
                <h4 class="text-h4 font-weight-medium">
                  PIN Transaksi
                </h4>
              </div>
              <h6 class="text-body-1 mb-4">
                Masukkan 6 digit PIN Anda
              </h6>
              <VOtpInput
                v-model="pin"
                :disabled="isPinInserted"
                :error="isPinError"
                type="password"
                length="6"
                class="pa-0 mb-4"
                @finish="onSubmit"
              />
              <p v-if="!isEmpty(errorMessage)"
                class="text-error"
              >
                {{ errorMessage }}
              </p>
              <VBtn
                :loading="isPinInserted"
                :disabled="isPinInserted"
                block
                type="submit"
              >
                Verifikasi
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText v-else>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="iconExclamation"
                  class="mx-auto mb-2"
                  width="100"
                />
                <h3 class="mb-2">Konfirmasi</h3>
                <p class="text-body-2 mb-0">
                  Mohon pastikan data-data yang Anda masukkan sudah benar.
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
                    Bank
                  </p>
                  <p class="mb-2">
                    Nomor Rekening
                  </p>
                  <p class="mb-2">
                    Pemilik Rekening
                  </p>
                  <p class="mb-2">
                    Nominal Diterima
                  </p>
                  <p class="mb-2">
                    Biaya Admin
                  </p>
                  <p class="mb-0">
                    Total
                  </p>
                </div>

                <div class="ms-auto text-end">
                  <p class="fw-700 mb-2">
                    {{ props.bankName }}
                  </p>
                  <p class="fw-700 mb-2">
                    {{ props.accountNo }}
                  </p>
                  <p class="fw-700 mb-2">
                    {{ props.accountName }}
                  </p>
                  <p class="fw-700 mb-2">
                    {{ toCurrency(props.amount) }}
                  </p>
                  <p class="fw-700 mb-2">
                    {{ toCurrency(props.adminFee) }}
                  </p>
                  <p class="fw-700 mb-0">
                    {{ toCurrency(props.totalAmount) }}
                  </p>
                </div>
              </div>
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-center gap-3 flex-wrap">
                <VBtn
                  color="primary"
                  variant="outlined"
                  @click="onReset"
                  >
                  Kembali
                </VBtn>
                <VBtn
                  @click="onToggleNextInputPin"
                  >
                  Ya, Tarik Saldo
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
