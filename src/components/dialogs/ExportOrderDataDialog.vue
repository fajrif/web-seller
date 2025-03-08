<script setup>
import { useMessageStore } from '@core/stores/config'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const messageStore = useMessageStore()
const loading = ref(false)
const refForm = ref()
const selectedStatus = ref('')
const startDate = ref('')
const endDate = ref('')

const downloadExportData = async () => {
  await $apiCore(`/seller/query/transaction/export/excel?status_code=${selectedStatus.value}&start_date=${startDate.value}&end_date=${endDate.value}`, {
		method: 'GET',
		responseType: 'blob'
	})
  .then( res => {
    var file = window.URL.createObjectURL(res);
    window.location.assign(file);
		loading.value = false;
	})
	.catch(error => {
		loading.value = false;
		console.log(error);
	 	messageStore.setMessage('error', 'Tidak dapat export data pesanan')
	});
}

const onSubmit = () => {
  loading.value = true
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      downloadExportData()
    } else {
      loading.value = false
    }
  })
}

const onReset = () => {
  emit('update:isDialogVisible', false)
	selectedStatus.value = ''
	startDate.value = ''
	endDate.value = ''
}

watch(() => props.isDialogVisible, async (visible) => {
  if (visible) {
    window.scrollTo(0,0);
	}
})

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
        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="d-flex flex-column justify-center">
                <h3 class="mb-2">Export Data Pesanan</h3>
                <p class="text-body-2">
                  Pilih status pesanan dan range tanggal pesanan awal dan akhir
                  untuk mengenerate data Excel (.xls)
                </p>
								<AppSelect
									v-model="selectedStatus"
                  label="Status Pesanan"
									:items="statusOrder"
                  item-title="name"
                  item-value="id"
									:rules="[requiredValidator]"
									class="mb-2"
									/>
                <div class="d-flex flex-wrap gap-4 my-2">
                  <AppDateTimePicker
                    v-model="startDate"
                    label="Tanggal Awal"
                    width="210px"
                    prepend-inner-icon="tabler-calendar"
                    :rules="[requiredValidator]"
                    placeholder="Pilih tanggal awal"
                    :config="{ enableTime: false, dateFormat: 'Y-m-d' }"
                    />
                  <AppDateTimePicker
                    v-model="endDate"
                    label="Tanggal Akhir"
                    width="210px"
                    prepend-inner-icon="tabler-calendar"
                    :rules="[requiredValidator, dateMoreThanValidator(startDate, endDate)]"
                    placeholder="Pilih tanggal akhir"
                    :config="{ enableTime: false, dateFormat: 'Y-m-d' }"
                    />
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            :disabled="loading"
            color="primary"
            variant="outlined"
            @click="onReset"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            :loading="loading"
            >
            Export Data
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
