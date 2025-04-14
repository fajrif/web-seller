<script setup>
import iconDone from '@images/icons/ic-done.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    required: false,
    default: iconDone
  },
  imgWidth: {
    type: Number,
    required: false,
    default: 100
  },
  btnText: {
    type: String,
    required: false,
    default: 'Tutup'
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const onClose = () => {
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    persistent
    max-width="350"
    :model-value="props.isDialogVisible"
    @update:model-value="onClose"
  >
    <!-- Dialog Content -->
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <div class="d-flex flex-column justify-center text-center">
              <VImg
                :src="props.imgSrc"
                :width="props.imgWidth"
                class="mx-auto mb-2"
              />
              <h3>{{ props.title }}</h3>
              <p class="text-body-2 mb-0">
                {{ props.message }}
              </p>
            </div>
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap justify-center text-center">
              <VBtn
                color="primary"
                @click="onClose"
                size="small"
                >
                {{ props.btnText }}
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
