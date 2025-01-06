<script setup>
import avatar1 from '@images/misc/img-default.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const refInputEl = ref()
const	merchantLogo = ref('')
const	merchantLogoTmp = ref('')
const	merchantName = ref('')
const	merchantDescription = ref('')
const	merchantCaption = ref('')
const	merchantRequestNPWP = ref(false)

const { data: merchantDetails } = await useApiRails("/merchant")
if (merchantDetails.value) {
  merchantLogo.value = merchantDetails.value.logo == "" ? avatar1 : merchantDetails.value.logo
  merchantLogoTmp.value = merchantLogo.value
  merchantName.value = merchantDetails.value.name
  merchantDescription.value = merchantDetails.value.description
  merchantCaption.value = merchantDetails.value.caption
  merchantRequestNPWP.value = merchantDetails.value.request_npwp == 1
}

const saveMerchant = async merchantdata => {
	try {
		await $apiRails("/merchant", {
			method: 'PUT',
			body: { merchant: merchantdata },
		});

		messageStore.setMessage('success', 'Data merchant berhasil disimpan')
	} catch (error) {
			messageStore.setMessage('error', 'Gagal simpan data merhant')
			console.error("Error on update merchant data:", error);
	}
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      saveMerchant({
				name: merchantName.value,
				description: merchantDescription.value,
				caption: merchantCaption.value,
				request_npwp: merchantRequestNPWP.value == true ? 1 : 0,
      });
    }
  })
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        merchantLogo.value = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
	merchantLogo.value = merchantLogoTmp.value
}

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="merchantLogo"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                color="primary"
                size="small"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                size="small"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
							Ukuran optimal 300 x 300 piksel dengan Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG
            </p>
          </form>
        </VCardText>

        <VCardText class="pt-2">
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
										<VRow>
											<VCol cols="12">
												<AppTextField
													v-model="merchantName"
													:rules="[requiredValidator]"
													placeholder="Nama toko anda"
													label="Nama Toko"
													/>
											</VCol>
											<VCol cols="12">
												<AppTextField
													v-model="merchantCaption"
													placeholder="Slogan toko anda"
													label="Slogan Toko"
													/>
											</VCol>
										</VRow>
									</VCol>

									<VCol
										md="6"
										cols="12"
										>
										<AppTextarea
											v-model="merchantDescription"
											placeholder="Deskripsi dan Informasi toko"
											label="Deskripsi Toko"
											/>
									</VCol>
								</VRow>
							</VCol>

              <!-- 👉 Status Toko -->
              <VCol cols="12" class="d-flex flex-wrap justify-start align-center">
								<h4 class="fw-700">Request NPWP</h4>
								<VTooltip location="top">
									<template #activator="{ props }">
										<VIcon
											v-bind="props"
											size="20"
											icon="tabler-info-circle"
										/>
									</template>
									<span>
										Request NPWP merupakan pengaturan permintaan nomor NPWP kepada Pembeli.<br/>
										Jika Anda mengaktifkan Request NPWP, maka akan muncul form input NPWP ketika Pembeli<br/>
										melakukan checkout
									</span>
								</VTooltip>
								<VSwitch
									v-model="merchantRequestNPWP"
									:label="merchantRequestNPWP == true ? 'Aktif' : 'Non-Aktif'"
									class="ms-2"
								/>
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap justify-end gap-4"
              >
                <VBtn type="submit">Simpan Informasi</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Banner Toko -->
      <VCard title="Banner Toko">
				<VCardText>
					<DropZone />
				</VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
