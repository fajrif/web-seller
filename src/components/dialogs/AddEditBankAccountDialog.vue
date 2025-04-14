<script setup>
import bgBanks from '@images/illustrations/bg-banks.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  itemId: {
    type: Number,
    required: true,
    default: 0,
  },
  bankId: {
    type: Number,
    required: false,
  },
  accountNo: {
    type: String,
    required: false,
  },
  accountName: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const refForm = ref()
const loading = ref(false)
const checking = ref(false)
const banks = ref([])
const bankId = ref()
const errMessage = ref('')
const accountName = ref('')
const accountNo = ref('')

const { data: dataBanks } = await useApiCore("/iconcash/query/ref/bank")
if(dataBanks.value.status === 200) {
  banks.value = dataBanks.value.data
}

const checkBankAccount = async (bank_id, account_no) => {
  try {
    const res = await $apiCore(`/iconcash/query/disbursement/customerbank/check-beneficiary?bank_id=${bank_id}&account_number=${account_no}`, { method: 'GET' })

    await nextTick(() => {
      if(res.status == 200) {
        let account_name = res.data?.account_name
        accountName.value = account_name
      } else {
        errMessage.value = res.message
      }
      loading.value = false
    })
  } catch (error) {
    loading.value = false
    errMessage.value = 'Data akun bank tidak ditemukan'
    console.error("Error on add check beneficiary account:", error)
  }
}

const checkAccount = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      loading.value = true
      errMessage.value = ''
      accountName.value = ''
      checkBankAccount(bankId.value, accountNo.value)
    }
  })
}

const validBankAccount = computed(() => !isEmpty(accountName.value))

const clearAccountNo = () => {
  errMessage.value = ''
  accountNo.value = ''
  accountName.value = ''
}

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // save bankAccount
      emit('formSubmitted', props.itemId, bankId.value, accountName.value, accountNo.value)
      onReset()
    }
  })
}

watch(() => props.itemId, (value) => {
	bankId.value = props.bankId
	accountNo.value = props.accountNo
	accountName.value = props.accountName
});
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
        ref="refForm"
        @submit.prevent="onSubmit"
      >
        <!-- 👉 Title -->
        <VCardItem class="pb-2">
          <VCardTitle>
            <h4 class="text-h4 mb-2">
              {{ props.itemId > 0 ? 'Edit Akun Bank' : 'Tambah Akun Bank' }}
            </h4>
          </VCardTitle>
          <p
            v-if="props.itemId == 0"
            class="text-body-1 mb-0"
          >
            Silahkan masukkan data akun bank baru anda
          </p>
          <p
            v-else
            class="text-body-1 mb-0"
          >
            Ubah data akun bank anda
          </p>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppSelect
                v-model="bankId"
                :items="banks"
                :disabled="loading"
                :readonly="validBankAccount"
                item-value="id"
                item-title="name"
                label="Bank"
                placeholder="Pilih Bank"
                :rules="[requiredValidator]"
                />
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="accountNo"
                clearable
                hide-spin-buttons
                :disabled="loading"
                :readonly="validBankAccount"
                label="No.Rekening"
                placeholder="Masukan No Rekening"
                type="number"
                :rules="[requiredValidator]"
                @click:clear="clearAccountNo"
              >
                <!-- AppendInner -->
                <template #append-inner>
                  <VFadeTransition leave-absolute>
                    <VProgressCircular
                      v-if="loading"
                      color="primary"
                      width="3"
                      size="24"
                      indeterminate
                    />
                  </VFadeTransition>
                </template>

                <!-- Append -->
                <template #append>
                  <VBtn
                    :loading="loading"
                    :icon="$vuetify.display.smAndDown"
                    :color="validBankAccount ? 'success' : 'secondary'"
                    variant="tonal"
                    @click="checkAccount"
                  >
                    <VIcon
                      :icon="validBankAccount ? 'tabler-circle-check' : 'tabler-circle-dashed-check'"
                      :color="validBankAccount ? 'success' : 'warning'"
                      size="22"
                    />
                    <VTooltip
                      activator="parent"
                      location="top"
                      :text="validBankAccount ? 'Valid akun bank' : 'Periksa rekening anda terlebih dahulu'"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12">
              <template v-if="!isEmpty(errMessage)">
                <span class="tex-body-1 font-weight-regular text-error">{{ errMessage }}</span>
              </template>
              <template v-if="validBankAccount">
                <v-card
                  class="banks-background"
                  :style="{ backgroundImage: 'url(' + bgBanks + ')' }"
                >
                  <div class="d-flex flex-column align-start justify-start w-100 py-2 px-4">
                    <div class="d-flex justify-space-between mb-2">
                      <VImg
                        :src="resolveBankLogo(bankId)"
                        width="100"
                        height="50"
                        />
                    </div>
                    <h6 class="text-h6 pt-2 mb-1">
                      {{ accountNo }}
                    </h6>
                    <h6 class="text-h6 font-weight-bold mb-0">
                      {{ accountName }}
                    </h6>
                  </div>
                </v-card>
              </template>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VBtn
            type="submit"
            :disabled="!validBankAccount"
            class="w-100"
          >
            Simpan Akun Bank
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
