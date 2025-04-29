<script setup>
import iconAsk from '@images/icons/ic-status.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  orderId: {
    type: Number,
    required: false,
    default: 0,
  },
  arrayOrderId: {
    type: Array,
    required: false,
    default: [],
  },
  arrayInvoiceNo: {
    type: Array,
    required: false,
    default: [],
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

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  if(props.arrayOrderId.length > 0) {
    emit('formSubmitted', props.arrayOrderId)
  } else {
    emit('formSubmitted', props.orderId)
  }
  emit('update:isDialogVisible', false)
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
      <VForm @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center text-center">
                <VImg
                  :src="iconAsk"
                  class="mx-auto w-40"
                />
                <h3>Terima Pesanan Tersebut?</h3>
                <div v-if="props.arrayInvoiceNo.length > 0" class="text-body-2">
                  <p class="mb-2">
                    Apakah anda ingin menerima beberapa pesanan dengan Invoice No:
                  </p>
                  <div class="d-flex justify-center">
                    <ul class="text-start">
                      <template v-for="invoiceNo in props.arrayInvoiceNo">
                        <li><strong>{{ invoiceNo }}</strong></li>
                      </template>
                    </ul>
                  </div>
                </div>
                <p v-else class="text-body-2">
                  Apakah anda ingin menerima pesanan dengan Invoice No: <strong>{{ props.invoiceNo }}</strong> ?
                </p>
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
            Ya, Terima Pesanan
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
