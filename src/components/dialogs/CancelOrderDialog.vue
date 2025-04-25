<script setup>
import iconAsk from '@images/icons/ic-status.png'
import { isEmpty, isEmptyArray, isNullOrUndefined } from '@core/utils/helpers'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
    default: 0,
  },
  invoiceNo: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const notes = [
	'Stock Habis',
	'Toko Tutup',
	'Lainnya',
]
const refForm = ref()
const selectedNotes = ref('Stock Habis')
const textNotes = ref()
const textNotesVisible = ref(false)

const onSelectedChange = () => {
	if(selectedNotes.value == 'Lainnya'){
		textNotesVisible.value = true
	} else {
		textNotesVisible.value = false
	}
}

const onReset = () => {
  emit('update:isDialogVisible', false)
	selectedNotes.value = 'Stock Habis'
	textNotes.value = ''
	textNotesVisible.value = false
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
			let _notes = selectedNotes.value
			if(_notes == 'Lainnya'){
				_notes = textNotes.value
			}
			emit('formSubmitted', props.orderId, _notes)
			onReset()
    }
  })
}

// 👉 Required Validator for notes
const requiredValidatorNotes = (value, selected) => {
	if(selected !== 'Lainnya')
		return true

  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Harap diisi alasan penolakan'

  return !!String(value).trim().length || 'Harap diisi alasan penolakan'
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
        ref="refForm"
				@submit.prevent="onSubmit"
				>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="iconAsk"
                  class="mx-auto w-40"
                />
                <h3>Tolak Pesanan?</h3>
                <p class="text-body-2">
                  Apakah anda yakin ingin menolak pesanan <strong>{{ props.invoiceNo }}</strong> ini?
									Jika anda menolak pesanan ini maka transaksi akan dihentikan.
									Penolakan pesanan tidak dapat dibatalkan.
                </p>
								<AppSelect
									v-model="selectedNotes"
									:items="notes"
									:rules="[requiredValidator]"
									class="mb-2"
									@update:model-value="onSelectedChange"
									/>
								<AppTextField
									v-show="textNotesVisible"
									v-model="textNotes"
									:rules="[maxLengthValidator(textNotes,50),requiredValidatorNotes(textNotes, selectedNotes)]"
                  counter
									placeholder="Masukan alasan penolakan"
								/>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-center gap-3 flex-wrap">
          <VBtn
            color="primary"
            variant="outlined"
            @click="onReset"
          >
            Batal
          </VBtn>
          <VBtn type="submit">
            Ya, Tolak
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
