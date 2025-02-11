<script setup>
import iconAsk from '@images/icons/ic-status.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  statusUser: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const onReset = () => {
  emit('formSubmitted', false)
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  emit('formSubmitted', true)
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
                <h3 v-if="props.statusUser === true">Non-Aktifkan Merchant</h3>
                <h3 v-else>Aktifkan Merchant</h3>
                <p v-if="props.statusUser === true" class="text-body-2">
                 Akun anda akan di <strong>non-aktif</strong> kan. Aktifkan kembali dengan cara menguhubungi admin marketplace PLN Mobile.
                </p>
                <p v-else class="text-body-2">
                 Akun anda telah <strong>non-aktif</strong>. Aktifkan kembali dengan cara menguhubungi admin marketplace PLN Mobile.
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
						:text="props.statusUser === true ? 'Batal' : 'Tutup'"
          />
					<VBtn
						v-if="props.statusUser === true"
						type="submit"
						>
            Non-Aktifkan
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
