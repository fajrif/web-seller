<script setup>
import iconFileBox from '@images/icons/ic-file-box.png'
import iconFile from '@images/icons/ic-file.png'
import Papa from 'papaparse';
import { useFileUploadProductStore } from '@core/stores/config'

const props = defineProps({
  triggerReset: {
    type: Boolean,
    required: true,
  },
})

const productStore = useFileUploadProductStore()

const inputFile = ref();
const file = ref();
const uploaded = ref(false);
const parsed = ref(false);
const interval = ref()
const progressValue = ref(0)

// if(productStore.filename !== ''){
// 	uploaded.value = true
// 	parsed.value = true
// }

const parseFile = () => {
	Papa.parse(file.value, {
		header: true,
		skipEmptyLines: true,
		complete: function(results){
			productStore.setDataParsed(results.data, file.value.name)
			parsed.value = true;
		}
	});
}

const handleFileUpload = (event) => {
	/// Reference to the DOM input element
	const { files } = event.target;
	// Ensure that you have a file before attempting to read it
	if (files && files[0]) {
		file.value = files[0];
		uploaded.value = true;
	}
}

const uploadingData = () => {
	interval.value = setInterval(() => {
		if (progressValue.value === 100){
			parseFile()
			clearInterval(interval.value)
			progressValue.value = 0
		} else {
			progressValue.value += 10
		}
  }, 500)
}

const downloadTemplate = () => {
	// create element <a> for download PDF
	const link = document.createElement('a');
	link.href = '/Template_Upload_Produk.xlsx';
	link.target = '_blank';
	link.download = 'Template_Upload_Produk.xlsx';

	// Simulate a click on the element <a>
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

const reset = () => {
	productStore.clear()
	file.value = null
	uploaded.value = false
	parsed.value = false
}

watch(() => props.triggerReset, (newVal, oldVal) => {
	if(newVal !== oldVal){
		reset()
	}
});
</script>

<template>
	<div>
		<div v-if="parsed" class="d-flex justify-start align-center py-4 mt-5 mb-10 border border-radius-8">
			<div class="d-flex align-start">
				<VAvatar
					size="60"
					class="mx-3"
					>
					<VImg
						:src="iconFile"
						class="mb-2"
						/>
				</VAvatar>
				<div class="d-flex flex-column text-start">
					<h4 class="mb-2">{{ file.name }}</h4>
					<p class="text-body-2">
						Pastikan file Excel (.csv) sudah sesuai dengan yang Anda inginkan.<br/> Produk yang sudah di-upload tidak bisa Anda batalkan.
					</p>
					<div class="d-flex flex-wrap justify-start gap-y-2 gap-x-4">
						<VBtn
							color="primary"
							variant="outlined"
							prepend-icon="tabler-arrow-back-up"
							@click="reset"
							>
							Ganti File
						</VBtn>
						<VBtn
							color="primary"
							prepend-icon="tabler-cloud-upload"
							>
							Upload All
						</VBtn>
					</div>
				</div>
			</div>
		</div>
		<template v-else>
			<div v-if="uploaded" class="d-flex justify-center align-center pa-15 mt-5 mb-10 px-2 border border-radius-8">
				<div class="d-flex flex-column justify-center text-center">
					<VAvatar
						v-if="progressValue == 0"
						size="80"
						class="mx-auto"
						>
						<VImg
							:src="iconFile"
							class="mb-2"
							/>
					</VAvatar>
					<VProgressCircular
						v-else
						:rotate="360"
						:size="70"
						:width="6"
						:model-value="progressValue"
						color="primary"
						class="mx-auto mb-2"
						>
						{{ progressValue }}
					</VProgressCircular>
					<h4 v-if="file !== null" class="mb-2">{{ file.name }}</h4>
					<p class="text-body-2">
						Pastikan file Excel (.csv) sudah sesuai dengan yang Anda inginkan.<br/> Produk yang sudah di-upload tidak bisa Anda batalkan.
					</p>
					<div class="d-flex flex-wrap justify-center gap-y-2 gap-x-4">
						<VBtn
							color="primary"
							variant="outlined"
							prepend-icon="tabler-arrow-back-up"
							@click="reset"
							>
							Kembali
						</VBtn>
						<VBtn
							color="primary"
							prepend-icon="tabler-cloud-upload"
							@click="uploadingData"
							>
							Upload Data
						</VBtn>
					</div>
				</div>
			</div>
			<div v-else class="d-flex justify-center align-center pa-15 mt-5 mb-10 px-2 border border-radius-8">
				<div class="d-flex flex-column justify-center text-center">
					<VAvatar
						size="150"
						class="mx-auto"
						>
						<VImg
							:src="iconFileBox"
							class="mb-2"
							/>
					</VAvatar>
					<p class="text-body-2">
						Pilih atau letakkan file Excel (.csv) Anda untuk tambah produk sekaligus <br/>sesuai dengan template yang digunakan. Maks 100 produk dalam satu file.
					</p>
					<div class="d-flex flex-wrap justify-center gap-y-2 gap-x-4">
						<input
						ref="inputFile"
						type="file"
						name="file"
						accept=".csv"
						hidden
						@change="handleFileUpload($event)"
						>
						<VBtn
							color="primary"
							variant="outlined"
							prepend-icon="tabler-file"
							@click="downloadTemplate"
							>
							Unduh File
						</VBtn>
						<VBtn
							color="primary"
							prepend-icon="tabler-cloud-upload"
							@click="inputFile.click()"
							>
							Upload File
						</VBtn>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
