<script setup>
import imgMap1 from '@images/misc/img-map.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const	merchantAddress = ref('')
const	merchantProvinsi = ref('')
const	merchantKelurahan = ref('')
const	merchantKecamatan = ref('')
const	merchantKota = ref('')
const	merchantZipCode = ref('')

const { data: addressDetails } = await useApiRails("/merchant/address")
if (addressDetails.value) {
	merchantAddress.value = addressDetails.value.address
	merchantProvinsi.value = addressDetails.value.provinsi
	merchantKelurahan.value = addressDetails.value.kelurahan
	merchantKecamatan.value = addressDetails.value.kecamatan
	merchantKota.value = addressDetails.value.kota
	merchantZipCode.value = addressDetails.value.zipcode
}

const saveAddress = async addressdata => {
	try {
		await $apiRails("/merchant/address", {
			method: 'PUT',
			body: { address: addressdata },
		});

		messageStore.setMessage('success', 'Data alamat toko berhasil disimpan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal simpan alamat toko')
			console.error("Error on update address merchant data:", error);
	}
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      saveAddress({
				address: merchantAddress.value,
				provinsi: merchantProvinsi.value,
				kelurahan: merchantKelurahan.value,
				kecamatan: merchantKecamatan.value,
				kota: merchantKota.value,
				zipcode: merchantZipCode.value,
      });
    }
  })
}

</script>

<template>
  <div>
		<VCard>
			<VCardItem class="py-3">
				<VCardTitle>Alamat Toko</VCardTitle>
			</VCardItem>
			<VCardText>
				<!-- 👉 Form -->
				<VForm
					ref="refForm"
					v-model="isFormValid"
					@submit.prevent="onSubmit"
					class="mt-3">
					<VRow>
						<VCol cols="12">
							<VRow>
								<VCol
									md="6"
									cols="12"
									>
									<VImg :src="imgMap1" />
								</VCol>

								<VCol
									md="6"
									cols="12"
									>
									<AppTextarea
										v-model="merchantAddress"
										:rules="[requiredValidator]"
										rows="8"
										placeholder="Alamat toko anda (nama jalan)"
										label="Alamat lengkap"
										/>
								</VCol>
							</VRow>
						</VCol>

						<!-- 👉 Alamat Toko -->
						<VCol cols="12" md="6">
							<AppTextField
								v-model="merchantProvinsi"
								:rules="[requiredValidator]"
								placeholder="Pilih provinsi"
								label="Provinsi"
								/>
						</VCol>

						<VCol cols="12" md="6">
							<AppTextField
								v-model="merchantKota"
								:rules="[requiredValidator]"
								placeholder="Pilih kota"
								label="Kota"
								/>
						</VCol>

						<VCol cols="12" md="6">
							<AppTextField
								v-model="merchantKecamatan"
								:rules="[requiredValidator]"
								placeholder="Pilih kecamatan"
								label="Kecamatan"
								/>
						</VCol>

						<VCol cols="12" md="6">
							<AppTextField
								v-model="merchantKelurahan"
								:rules="[requiredValidator]"
								placeholder="Pilih kelurahan"
								label="Kelurahan"
								/>
						</VCol>

						<VCol cols="12" md="6">
							<AppTextField
								v-model="merchantZipCode"
								:rules="[requiredValidator]"
								type="number"
								placeholder="Kode Pos"
								label="Kode Pos"
								/>
						</VCol>

						<!-- 👉 Form Actions -->
						<VCol
							cols="12"
							class="d-flex flex-wrap justify-end gap-4"
						>
							<VBtn type="submit">Simpan Alamat</VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VCardText>
		</VCard>
  </div>
</template>
