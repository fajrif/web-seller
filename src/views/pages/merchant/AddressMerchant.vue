<script setup>
import imgMap1 from '@images/misc/img-map.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const	merchantAddress = ref('')
const	merchantProvinsi = ref()
const	merchantKelurahan = ref()
const	merchantKecamatan = ref()
const	merchantKota = ref()
const	merchantZipCode = ref()

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
  let merchant = merchantDetails.value.data.merchant
  merchantAddress.value = merchant.address
  merchantProvinsi.value = merchant.province_id
  merchantKota.value = merchant.city_id
  merchantKecamatan.value = merchant.district_id
  merchantKelurahan.value = merchant.subdistrict_id
  merchantZipCode.value = merchant.postal_code
}

const saveAddress = async addressData => {
  try {
    console.log(addressData)

    const res = await $apiCore("/seller/command/merchant/atur-lokasi", {
      method: 'POST',
      body: addressData,
      onResponseError({ response }) {
        console.log(response)
      },
    })

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan alamat toko')
    console.error("Error on update address merchant data:", error)
  }
}

/* eslint-disable camelcase */
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      saveAddress({
        address: merchantAddress.value,
        province_id: merchantProvinsi.value,
        city_id: merchantKota.value,
        district_id: merchantKecamatan.value,
        subdistrict_id: merchantKelurahan.value,
        postal_code: merchantZipCode.value,
      })
    }
  })
}
/* eslint-enable */
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
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="merchantProvinsi"
                :rules="[requiredValidator]"
                placeholder="Pilih provinsi"
                label="Provinsi"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="merchantKota"
                :rules="[requiredValidator]"
                placeholder="Pilih kota"
                label="Kota"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="merchantKecamatan"
                :rules="[requiredValidator]"
                placeholder="Pilih kecamatan"
                label="Kecamatan"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="merchantKelurahan"
                :rules="[requiredValidator]"
                placeholder="Pilih kelurahan"
                label="Kelurahan"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
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
              <VBtn type="submit">
                Simpan Alamat
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
