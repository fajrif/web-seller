<script setup>
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const arrayTime = ["06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00"]

const	monday = ref(false)
const tuesday = ref(false)
const wednesday = ref(false)
const thursday = ref(false)
const friday = ref(false)
const saturday = ref(false)
const sunday = ref(false)
const	startTime = ref('')
const	endTime = ref('')

const { data: scheduleDetails } = await useApiCore("/merchant/operational_hour")
if (scheduleDetails.value) {
  monday.value = scheduleDetails.value.monday == 1
  tuesday.value = scheduleDetails.value.tuesday == 1
  wednesday.value = scheduleDetails.value.wednesday == 1
  thursday.value = scheduleDetails.value.thursday == 1
  friday.value = scheduleDetails.value.friday == 1
  saturday.value = scheduleDetails.value.saturday == 1
  sunday.value = scheduleDetails.value.sunday == 1
  startTime.value = scheduleDetails.value.start_time
  endTime.value = scheduleDetails.value.end_time
}

const saveSchedule = async dataSchedule => {
  try {
    /* eslint-disable camelcase */
    await $apiCore("/merchant/operational_hour", {
      method: 'PUT',
      body: { operational_hour: dataSchedule },
    })
    /* eslint-enable */

    messageStore.setMessage('success', 'Data jadwal toko berhasil disimpan')
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan jadwal toko')
    console.error("Error on update operational hour merchant data:", error)
  }
}

/* eslint-disable camelcase */
const onSubmit = () => {
  saveSchedule({
    monday: monday.value == 1,
    tuesday: tuesday.value == 1,
    wednesday: wednesday.value == 1,
    thursday: thursday.value == 1,
    friday: friday.value == 1,
    saturday: saturday.value == 1,
    sunday: sunday.value == 1,
    start_time: startTime.value,
    end_time: endTime.value,
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
                  v-model="startTime"
                  placeholder="Select an option"
                  :items="arrayTime"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="endTime"
                  placeholder="Select an option"
                  :items="arrayTime"
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
