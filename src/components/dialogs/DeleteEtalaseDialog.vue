<script setup>
import iconAsk from '@/assets/images/icons/ic-status.png'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  etalaseId: {
    type: Number,
    required: true,
    default: 0,
  },
  etalaseName: {
    type: String,
    required: false,
  },
  etalaseJmlProduk: {
    type: Number,
    required: false,
    default: 0,
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
	emit('formSubmitted', props.etalaseId)
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
								<h3>Hapus Etalase</h3>
								<p class="text-body-2">
									Apakah anda yakin ingin menghapus etalase <strong>{{ props.etalaseName }}</strong>?
									Terdapat <strong>{{ props.etalaseJmlProduk }} produk</strong> dalam etalase ini.
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
