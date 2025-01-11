<script setup>
import avatar1 from '@images/misc/img-default.png'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const refInputEl = ref()
const	merchantPhoto = ref('')
const	merchantPhotoTmp = ref('')
const	merchantName = ref('')
const	merchantDescription = ref('')
const	merchantSlogan = ref('')
const	merchantRequestNPWP = ref(false)

// temporary to save data
var operationalAttrs = {}

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
  let merchant = merchantDetails.value.data.merchant
	// need to save this
	let operationals = merchantDetails.value.data.merchant.operationals
	operationalAttrs = getOperationalAttrs(operationals)

  if(merchant.photo_url == "" || merchant.photo_url == null) {
    merchantPhoto.value = avatar1
  } else {
    merchantPhoto.value = merchant.photo_url
  }
  merchantPhotoTmp.value = merchantPhoto.value
  merchantName.value = merchant.name
  merchantDescription.value = merchant.description
  merchantSlogan.value = merchant.slogan
  merchantRequestNPWP.value = merchant.is_npwp_required
}

const saveMerchant = async merchantData => {
  try {
    const res = await $apiCore("/seller/command/merchant/atur-toko", {
      method: 'POST',
      body: merchantData,
      onResponseError({ response }) {
        console.log(response)
      },
    })

		updateCookieUserData(() => {})

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan informasi toko')
    console.error("Error on update merchant data:", error)
  }
}

/* eslint-disable camelcase */
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      saveMerchant({
        name: merchantName.value,
        description: merchantDescription.value,
        slogan: merchantSlogan.value,
        is_npwp_required: merchantRequestNPWP.value,
				...operationalAttrs
      })
    }
  })
}
/* eslint-enable */

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        merchantPhoto.value = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  merchantPhoto.value = merchantPhotoTmp.value
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
            :image="merchantPhoto"
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
            class="mt-3"
            @submit.prevent="onSubmit"
          >
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
                          v-model="merchantSlogan"
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
              <VCol
                cols="12"
                class="d-flex flex-wrap justify-start align-center"
              >
                <h4 class="fw-700">
                  Request NPWP
                </h4>
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      size="20"
                      icon="tabler-info-circle"
                    />
                  </template>
                  <span>
                    Request NPWP merupakan pengaturan permintaan nomor NPWP kepada Pembeli.<br>
                    Jika Anda mengaktifkan Request NPWP, maka akan muncul form input NPWP ketika Pembeli<br>
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
                <VBtn type="submit">
                  Simpan Informasi
                </VBtn>
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
