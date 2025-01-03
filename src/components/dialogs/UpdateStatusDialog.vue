<script setup>
import iconAsk from '@/assets/images/icons/ic-status.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
    default: 0,
  },
  productName: {
    type: String,
    required: false,
  },
  productStatus: {
    type: Number,
    required: true,
    default: 0,
  },
})

const resolveStatus = statusId => {
  if (statusId === 0)
    return {
      title: 'Arsipkan Produk',
      subtitle: 'mengarsipkan produk',
    }
  if (statusId === 1)
    return {
      title: 'Jual Produk',
      subtitle: 'menjual produk',
    }
  if (statusId === 2)
    return {
      title: 'Non-Aktifkan Produk',
      subtitle: 'menon-aktifkan produk',
    }
  if (statusId === 3)
    return {
      title: 'Tolak',
      subtitle: 'menolak produk',
    }
}

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
	emit('formSubmitted', props.productId, props.productStatus)
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
			<VForm
				@submit.prevent="onSubmit"
				>
				<VCardText>
					<VRow>
						<VCol cols="12">
							<div class="d-flex flex-column justify-center text-center">
								<VImg :src="iconAsk" class="mx-auto w-40" />
								<h3>{{ resolveStatus(props.productStatus).title }}</h3>
								<p class="text-body-2">
									Apakah anda yakin ingin {{ resolveStatus(props.productStatus).subtitle }} <strong>{{ props.productName }}</strong> ?
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
						Ya, Lanjutkan
					</VBtn>
				</VCardText>
			</VForm>
    </VCard>
  </VDialog>
</template>
