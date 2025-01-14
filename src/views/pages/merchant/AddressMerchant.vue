<script setup>
import imgMap1 from '@images/misc/img-map.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const	merchantAddress = ref('')
const	merchantProvinsi = ref(0)
const	merchantKota = ref(0)
const	merchantKecamatan = ref(0)
const	merchantKelurahan = ref(0)
const	merchantZipCode = ref()

// location attr
const isLocationDialogVisible = ref(false)
const locationAttr = {
	title: 'Pilih Lokasi Alamat',
	coordinates: {
		lat: 0,
		lng: 0
	}
}

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

const urlCities = ref(`/location/province/${merchantProvinsi.value}/city`)
const urlDistricts = ref(`/location/city/${merchantKota.value}/district`)
const urlSubDistricts = ref(`/location/district/${merchantKecamatan.value}/subdistrict`)

const { data: provincesData } = await useApiCore(createUrl('/location/province'))
const { data: citiesData } = await useApiCore(createUrl(urlCities, { refetch: true }))
const { data: districtsData } = await useApiCore(createUrl(urlDistricts, { refetch: true }))
const { data: subDistrictsData } = await useApiCore(createUrl(urlSubDistricts, { refetch: true }))

const provinces = computed(() => provincesData.value.data)
const cities = computed(() => citiesData.value.data)
const districts = computed(() => districtsData.value.data)
const subDistricts = computed(() => subDistrictsData.value.data)

const onProvinceChange = () => {
  urlCities.value = `/location/province/${merchantProvinsi.value}/city`
  merchantKota.value = null
  merchantKecamatan.value = null
  merchantKelurahan.value = null
}

const onCityChange = () => {
  urlDistricts.value = `/location/city/${merchantKota.value}/district`
  merchantKecamatan.value = null
  merchantKelurahan.value = null
}

const onDistrictChange = () => {
  urlSubDistricts.value = `/location/district/${merchantKecamatan.value}/subdistrict`
  merchantKelurahan.value = null
}

const saveAddress = async addressData => {
  try {
    const res = await $apiCore("/seller/command/merchant/atur-lokasi", {
      method: 'POST',
      body: addressData,
      onResponseError({ response }) {
        console.log(response)
        messageStore.setMessage('error', response.message)
      },
    })

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan alamat toko')
    console.error("Error on update address merchant data:", error)
  }
}

const openLocationSelector = () => {
  isLocationDialogVisible.value = true
}

const saveMerchantLocation = () => {
	// save latitude and longitude here
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
              <AppSelect
                v-model="merchantProvinsi"
                :rules="[requiredValidator]"
                placeholder="Pilih provinsi"
                label="Provinsi"
                :items="provinces"
                item-title="name"
                item-value="id"
                @update:model-value="onProvinceChange"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="merchantKota"
                :rules="[requiredValidator]"
                placeholder="Pilih kota"
                label="Kota"
                :items="cities"
                item-title="name"
                item-value="id"
                @update:model-value="onCityChange"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="merchantKecamatan"
                :rules="[requiredValidator]"
                placeholder="Pilih kecamatan"
                label="Kecamatan"
                :items="districts"
                item-title="name"
                item-value="id"
                @update:model-value="onDistrictChange"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="merchantKelurahan"
                :rules="[requiredValidator]"
                placeholder="Pilih kelurahan"
                label="Kelurahan"
                :items="subDistricts"
                item-title="name"
                item-value="id"
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
    <MapLocationPicker
      v-model:is-dialog-visible="isLocationDialogVisible"
      v-model:title="locationAttr.title"
      v-model:coordinates="locationAttr.coordinates"
      @form-submitted="saveMerchantLocation"
    />
  </div>
</template>
