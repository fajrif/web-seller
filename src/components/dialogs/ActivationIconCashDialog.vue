<script setup>
import { useMessageStore } from '@core/stores/config'
import askImg from '@images/icons/ic-status.png'
import logoIconCash from '@images/logos/iconcash-logo.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formActivationSubmitted',
  'formForgotSubmitted',
])

const messageStore = useMessageStore()

const loading = ref(false)
const isForgotHome = ref(false)
const isInputOtp = ref(false)
const isInputPin = ref(false)
const isOtpError = ref(false)
const isPinError = ref(false)
const errorMessageOtp = ref('')
const errorMessagePin = ref('')
const otp = ref('')
const pin = ref('')
const confirmPin = ref('')

const onReset = () => {
  emit('update:isDialogVisible', false)
  clearStateVariables('home')
}

const clearStateVariables = (state) => {
  errorMessageOtp.value = ''
  errorMessagePin.value = ''
  pin.value = ''
  confirmPin.value = ''
  isOtpError.value = false
  isPinError.value = false

  switch(state) {
    case 'home':
      otp.value = ''
      isForgotHome.value = false
      isInputOtp.value = false
      isInputPin.value = false
      break;
    case 'home-forgot':
      otp.value = ''
      isForgotHome.value = true
      isInputOtp.value = false
      isInputPin.value = false
      break;
    case 'otp':
      otp.value = ''
      isInputOtp.value = true
      isInputPin.value = false
      break;
    case 'pin':
      isInputOtp.value = false
      isInputPin.value = true
      break;
  }
  loading.value = false
}

const onRequestOTP = async () => {
  loading.value = true
  try {
    const res = await $apiCore('/iconcash/command/otp', {
      method: 'GET',
      ignoreResponseError: true
    })

    if(res.data) {
      clearStateVariables('otp')
    } else {
      if(res.code === 5006) {
        clearStateVariables('otp')
        errorMessageOtp.value = res.message
      } else {
        throw res.message
      }
    }
  } catch (error) {
    loading.value = false
		messageStore.setMessage('error', error)
    console.error("Error on iconcash request OTP:", error)
  }
}

const onValidateOTP = async () => {
  loading.value = true
  try {
    if(otp.value.length < 4) {
      throw 'Kode OTP salah'
    } else {
      const res = await $apiCore('/iconcash/query/otp/validate', {
        method: 'POST',
        body: {
          otp: otp.value
        },
        ignoreResponseError: true
      })

      if(res.status_code == 200) {
        clearStateVariables('pin')
      } else {
        throw res.message
      }
    }
  } catch (error) {
    loading.value = false
    console.error("Error on iconcash validate OTP:", error)
    errorMessageOtp.value = error
    isOtpError.value = true
  }
}

const submitChangePin = async (_otp, new_pin, confirm_new_pin) => {
  try {
    const res = await $apiCore('/iconcash/auth/forgotpin', {
      method: 'POST',
      body: {
        otp: _otp,
        new_pin: new_pin,
        confirm_new_pin: confirm_new_pin,
      },
      ignoreResponseError: true
    })

    if(res.status_code == 200) {
      emit('formForgotSubmitted')
      onReset()
    } else {
      throw res.message
    }
  } catch (error) {
    loading.value = false
    console.error("Error on submit forgot PIN:", error)
    errorMessagePin.value = error
    isPinError.value = true
  }
}

const onChangePin = () => {
  loading.value = true
  try {
    if(pin.value.length < 6 || confirmPin.value.length < 6) {
      throw 'Harap masukkan semua 6 digit PIN'
    } else {
      if(pin.value !== confirmPin.value) {
        throw '6 digit PIN baru anda tidak sama'
      } else {
        var newPinString = props.phone + pin.value
        var confirmPinString = props.phone + confirmPin.value
        createHash(newPinString).then((hashedNewPin) => {
          newPinString = hashedNewPin
          createHash(confirmPinString).then((hashedConfirmPin) => {
            confirmPinString = hashedConfirmPin
            submitChangePin(otp.value, newPinString, confirmPinString)
          });
        });
      }
    }
  } catch (error) {
    loading.value = false
    console.error("Error on change forgot PIN:", error)
    errorMessagePin.value = error
    isPinError.value = true
  }
}

const onActivation = () => {
  loading.value = true
  try {
    if(pin.value.length < 6) {
      throw 'Harap masukkan semua 6 digit PIN'
    } else {
      var pinString = props.phone + pin.value
      createHash(pinString).then((hashedPin) => {
        submitActivation(otp.value, hashedPin)
      });
    }
  } catch (error) {
    loading.value = false
    console.error("Error on activation PIN:", error)
    errorMessagePin.value = error
    isPinError.value = true
  }
}

const submitActivation = async (_otp, _pin) => {
  try {
    const res = await $apiCore('/iconcash/auth/login', {
      method: 'POST',
      body: {
        pin: _pin,
      },
      ignoreResponseError: true
    })

    if(res.data) {
      emit('formActivationSubmitted')
      onReset()
    } else {
      throw res.message
    }
  } catch (error) {
    loading.value = false
    console.error("Error on submit activation PIN:", error)
    errorMessagePin.value = error
    isPinError.value = true
  }
}

const onSubmitPin = () => {
  if(isForgotHome.value === true) {
    onChangePin()
  } else {
    onActivation()
  }
}

const onBackToOtp = () => {
  clearStateVariables('otp')
}

const onBackToHome = () => {
  clearStateVariables(isForgotHome.value ? 'home-forgot' : 'home')
}

const openForgotPinDialog = () => {
  isForgotHome.value = true
}

</script>

<template>
  <div>
    <VDialog
      persistent
      max-width="450"
      :model-value="props.isDialogVisible"
      @update:model-value="onReset"
      >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="onReset" />
      <!-- Dialog Content -->
      <VCard>
        <VCardText v-if="isInputOtp">
          <VRow>
            <!-- OTP -->
            <VCol cols="12">
              <div class="d-flex flex-wrap align-center mb-2">
                <VBtn
                  icon="tabler-arrow-narrow-left"
                  variant="text"
                  color="black"
                  class="me-1"
                  @click="onBackToHome"
                  />
                <h4 class="text-h4 font-weight-medium">
                  Kode OTP
                </h4>
              </div>
              <h6 class="text-body-1 mb-4">
                Masukkan 4 digit Kode OTP yang dikirimkan nomor anda <strong>{{ props.phone }}</strong>
              </h6>
              <VOtpInput
                v-model="otp"
                :disabled="loading"
                :error="isOtpError"
                type="password"
                length="4"
                class="pa-0 mb-6"
                />
              <p v-if="!isEmpty(errorMessageOtp)"
                class="text-error"
                >
                {{ errorMessageOtp }}
              </p>
              <VBtn
                :loading="loading"
                :disabled="loading"
                block
                @click="onValidateOTP"
                >
                Verifikasi
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText v-else-if="isInputPin">
          <VRow>
            <!-- PIN baru -->
            <VCol cols="12">
              <div class="d-flex flex-wrap align-center mb-2">
                <VBtn
                  icon="tabler-arrow-narrow-left"
                  variant="text"
                  color="black"
                  class="me-1"
                  @click="onBackToOtp"
                  />
                <h4 class="text-h4 font-weight-medium">
                  {{ isForgotHome ? 'Buat PIN Baru' : 'PIN Transaksi' }}
                </h4>
              </div>
              <p v-if="!isEmpty(errorMessagePin)"
                class="text-error"
                >
                {{ errorMessagePin }}
              </p>
              <div>
                <h6 class="text-body-1 mb-4">
                  {{ `Masukkan 6 digit PIN ${isForgotHome ? 'baru' : 'ICON Cash'} anda` }}
                </h6>
                <VOtpInput
                  v-model="pin"
                  :disabled="loading"
                  :error="isPinError"
                  type="password"
                  length="6"
                  class="pa-0 mb-4"
                  />
              </div>
              <div v-if="isForgotHome">
                <h6 class="text-body-1 mb-1">
                  Konfirmasi PIN Baru Anda
                </h6>
                <VOtpInput
                  v-model="confirmPin"
                  :disabled="loading"
                  :error="isPinError"
                  type="password"
                  length="6"
                  class="pa-0 mb-4"
                  />
              </div>
              <VBtn
                :loading="loading"
                :disabled="loading"
                block
                @click="onSubmitPin"
                >
                Selanjutnya
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText v-else-if="isForgotHome">
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="askImg"
                  width="100"
                  class="mx-auto my-4"
                  />
                <div class="mx-10 mb-4">
                  <h3 class="mb-1">Buat PIN Baru</h3>
                  <p class="text-body-2 mb-0">
                    Apakah Anda ingin membuat PIN Baru?
                  </p>
                </div>
                <VBtn
                  color="primary"
                  class="w-100"
                  @click="onRequestOTP"
                  >
                  Kirim Kode OTP
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText v-else>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="logoIconCash"
                  width="100"
                  class="mx-auto my-4"
                  />
                <div class="mx-10 mb-4">
                  <h3 class="mb-1">Aktivasi ICON Cash</h3>
                  <p class="text-body-2 mb-0">
                    Apakah anda ingin mengaktivasi ICON Cash anda?
                  </p>
                </div>
                <div class="d-flex flex-column justify-center align-center gap-3">
                  <VBtn
                    color="primary"
                    class="w-100"
                    @click="onRequestOTP"
                    >
                    Kirim Kode OTP
                  </VBtn>
                  <a
                    href="#"
                    class="text-h6 text-medium-emphasis text-primary"
                    @click="openForgotPinDialog"
                    >
                    Lupa PIN
                  </a>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>

      </VCard>
    </VDialog>
  </div>
</template>
