<script setup>
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
})

const emit = defineEmits([
  'update:isDialogVisible',
  'saveConfirm',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
  emit('saveConfirm', props.itemId)
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
                <h3 class="mb-2">Upload Data</h3>
                <p class="text-body-1 mb-0">
                  Apakah anda yakin ingin mengupload data ini ?
                </p>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-center gap-3 flex-wrap">
          <VBtn
            color="warning"
            variant="outlined"
            @click="onReset"
          >
            Batal
          </VBtn>
					<VBtn
						type="submit">
            Yakin
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
