<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  isProgressLinear: {
    type: Boolean,
    required: false,
    default: false,
  },
  messageText: {
    type: String,
    required: false,
    default: 'Loading...',
  },
})
</script>

<template>
  <!-- Dialog -->
  <VDialog
    v-model="props.isDialogVisible"
    width="300"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3 pb-3">
        {{ props.messageText }}
        <VProgressLinear
          v-if="props.isProgressLinear"
          indeterminate
          bg-color="rgba(var(--v-theme-surface), 0.1)"
          :height="8"
          class="mb-0 mt-4"
        />
        <VProgressCircular
          v-else
          :size="50"
          color="warning"
          class="d-block text-center"
          indeterminate
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
