<script setup>
import img1 from '@images/banner/support-banner.png'

const title = ref('')
const body = ref('')

await $apiCore('/pages/privacy-policy', {
  method: 'GET',
  onResponse({ request, response, options }) {
    if(response.status == 200) {
      title.value = response._data.data.title
      body.value = response._data.data.body
    }
  },
  onResponseError({ response }) {
    console.error(response)
  },
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pa-0">
          <VRow>
            <VCol cols="12">
              <VImg :src="img1" />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <h4 class="text-h4 mb-2">
                {{ title }}
              </h4>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="my-10 mx-7"
                v-html="body"
              />
              <!-- eslint-enable -->
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
