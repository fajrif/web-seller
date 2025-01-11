<script setup>
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const	monday = ref(false)
const tuesday = ref(false)
const wednesday = ref(false)
const thursday = ref(false)
const friday = ref(false)
const saturday = ref(false)
const sunday = ref(false)
const	openTime = ref('08:00:00')
const	closedTime = ref('17:00:00')

// temporary to save data
var merchantAttrs = {}

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
	// need to save this
  let merchant = merchantDetails.value.data.merchant
	merchantAttrs = getInfoAttrs(merchant)

  let operationals = merchantDetails.value.data.merchant.operationals
  if(Array.isArray(operationals)) {
    operationals.forEach(op => {
      switch (op.master_data_id) {
      case 7:
        monday.value = true
        break
      case 8:
        tuesday.value = true
        break
      case 9:
        wednesday.value = true
        break
      case 10:
        thursday.value = true
        break
      case 11:
        friday.value = true
        break
      case 12:
        saturday.value = true
        break
      case 13:
        sunday.value = true
        break
      };
    })
    let firstData = operationals[0]
    if(firstData){
      openTime.value = firstData.open_time
      closedTime.value = firstData.closed_time
    }
  }
}

const saveSchedule = async merchantData => {
  try {
    const res = await $apiCore("/seller/command/merchant/atur-toko", {
      method: 'POST',
      body: merchantData,
      onResponseError({ response }) {
        console.log(response)
      },
    })

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan jadwal toko')
    console.error("Error on update operational hour merchant data:", error)
  }
}

/* eslint-disable camelcase */
const onSubmit = () => {
  let selectedOperational = []

  if(monday.value == true) { selectedOperational.push(7) }
  if(tuesday.value == true) { selectedOperational.push(8) }
  if(wednesday.value == true) { selectedOperational.push(9) }
  if(thursday.value == true) { selectedOperational.push(10) }
  if(friday.value == true) { selectedOperational.push(11) }
  if(saturday.value == true) { selectedOperational.push(12) }
  if(sunday.value == true) { selectedOperational.push(13) }

  let operationalHours = selectedOperational.map(num => {
    return {
      day_id: num,
      timezone: "Asia/Bangkok",
    }
  })

  saveSchedule({
    open_time: openTime.value.slice(0, -3),
    closed_time: closedTime.value.slice(0, -3),
    operational: operationalHours,
		...merchantAttrs
  })
}
/* eslint-enable */
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Jadwal Operasional Toko</VCardTitle>
      <p class="text-body-1 mb-0">
        Atur jadwal operasional tokomu disini, agar Pembeli dapat mengetahui kapan Toko Anda aktif.
      </p>
    </VCardItem>

    <VForm @submit.prevent="onSubmit">
      <VCardText class="px-0">
        <VDivider />
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VTable class="text-no-wrap rounded">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="fw-700"
                  >
                    Hari
                  </th>
                  <th
                    scope="col"
                    class="fw-700"
                  >
                    Aktif
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Senin
                  </td>
                  <td>
                    <VCheckbox v-model="monday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Selasa
                  </td>
                  <td>
                    <VCheckbox v-model="tuesday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Rabu
                  </td>
                  <td>
                    <VCheckbox v-model="wednesday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Kamis
                  </td>
                  <td>
                    <VCheckbox v-model="thursday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Jumat
                  </td>
                  <td>
                    <VCheckbox v-model="friday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Sabtu
                  </td>
                  <td>
                    <VCheckbox v-model="saturday" />
                  </td>
                </tr>
                <tr>
                  <td class="text-body-1 text-high-emphasis">
                    Minggu
                  </td>
                  <td>
                    <VCheckbox v-model="sunday" />
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
          <VCol
            cols="12"
            md="6"
            class="pa-10"
          >
            <h6 class="text-body-1 font-weight-bold mb-6">
              Atur Waktu (Jam Operasional) Toko Anda
            </h6>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="openTime"
                  label="Jam Buka Toko"
                  placeholder="Pilih Jam Buka"
                  :items="timeOptions"
                  item-title="text"
                  item-value="value"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="closedTime"
                  label="Jam Tutup Toko"
                  placeholder="Pilih Jam Tutup"
                  :items="timeOptions"
                  item-title="text"
                  item-value="value"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
        <VDivider />
      </VCardText>
      <VCardActions class="justify-center">
        <VBtn
          type="submit"
          variant="flat"
        >
          Simpan Jadwal
        </VBtn>
      </VCardActions>
    </VForm>
  </VCard>
</template>
