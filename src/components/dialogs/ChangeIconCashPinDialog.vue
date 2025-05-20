<script setup>
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
  'formSubmitted',
])

const loading = ref(false)
const isPinError = ref(false)
const errorMessage = ref('')
const oldPin = ref('')
const newPin = ref('')
const confirmPin = ref('')

const onReset = () => {
  emit('update:isDialogVisible', false)
  loading.value = false
  isPinError.value = false
  errorMessage.value = ''
  oldPin.value = ''
  newPin.value = ''
  confirmPin.value = ''
}

const submitChangePin = async (old_pin, new_pin, confirm_new_pin) => {
  try {
    const res = await $apiCore('/iconcash/auth/changepin', {
      method: 'POST',
      body: {
        old_pin: old_pin,
        new_pin: new_pin,
        confirm_new_pin: confirm_new_pin,
      },
      ignoreResponseError: true
    })

    if(res.status_code == 200) {
      onReset()
      emit('formSubmitted')
    } else {
      throw res
    }

  } catch (err) {
    loading.value = false
    isPinError.value = true
    errorMessage.value = translateErrorMessage('change-pin', err)
  }
}

const onSubmit = () => {
  try {
    loading.value = true
    errorMessage.value = ''
    isPinError.value = false
    if(oldPin.value.length < 6 || newPin.value.length < 6 || confirmPin.value.length < 6) {
      throw 'Harap masukkan semua 6 digit PIN'
    } else {
      if(newPin.value !== confirmPin.value) {
        throw 'Konfirmasi PIN tidak sesuai'
      } else {
        var oldPinString = props.phone + oldPin.value
        var newPinString = props.phone + newPin.value
        var confirmPinString = props.phone + confirmPin.value
        createHash(oldPinString).then((hashedOldPin) => {
          oldPinString = hashedOldPin
          createHash(newPinString).then((hashedNewPin) => {
            newPinString = hashedNewPin
            createHash(confirmPinString).then((hashedConfirmPin) => {
              confirmPinString = hashedConfirmPin
              submitChangePin(oldPinString, newPinString, confirmPinString)
            });
          });
        });
      }
    }
  } catch (err) {
    loading.value = false
    isPinError.value = true
    errorMessage.value = err
    oldPin.value = ''
    newPin.value = ''
    confirmPin.value = ''
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
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
			<VForm
				@submit.prevent="onSubmit"
				>
        <VCardText>
          <VRow>
            <!-- OTP -->
            <VCol cols="12">
              <div class="d-flex flex-wrap align-center mb-2">
                <VBtn
                  icon="tabler-arrow-narrow-left"
                  variant="text"
                  color="black"
                  class="me-1"
                  @click="onReset"
                />
                <h4 class="text-h4 font-weight-medium">
                  Ubah PIN
                </h4>
              </div>
              <p v-if="!isEmpty(errorMessage)"
                class="text-error"
              >
                {{ errorMessage }}
              </p>
              <div>
                <h6 class="text-body-1 mb-1">
                  Masukkan 6 digit PIN Lama Anda
                </h6>
                <VOtpInput
                  v-model="oldPin"
                  :disabled="loading"
                  :error="isPinError"
                  type="password"
                  length="6"
                  class="pa-0 mb-2"
                  @keypress="checkNumber($event)"
                  />
              </div>
              <div>
                <h6 class="text-body-1 mb-1">
                  Masukkan PIN Baru Anda
                </h6>
                <VOtpInput
                  v-model="newPin"
                  :disabled="loading"
                  :error="isPinError"
                  type="password"
                  length="6"
                  class="pa-0 mb-2"
                  @keypress="checkNumber($event)"
                  />
              </div>
              <div>
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
                  @keypress="checkNumber($event)"
                  />
              </div>
              <VBtn
                :loading="loading"
                :disabled="loading"
                block
                type="submit"
              >
                Selanjutnya
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
