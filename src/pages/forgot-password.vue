<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const router = useRouter()

const errors = ref({
  email: undefined,
})

const refVForm = ref()
const email = ref('')

const sendResetPassword = async () => {
  try {
    errors.value = { email: undefined }

    const res = await $apiAuth('/password/email', {
      method: 'POST',
      body: {
        email: email.value,
      },
      onResponseError({ response }) {
        let msg = response._data.message
        errors.value.email = msg
      },
    })

    await nextTick(() => {
      router.push(`/verification?email=${email.value}`)
    })
  } catch (err) {
    errors.value.email = "Error: kirim email verifikasi tidak dapat diproses"
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      sendResetPassword()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Auth card -->
      <VCard
        class="auth-card rounded-lg"
        max-width="500"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Lupa Kata Sandi? 🔒
          </h4>
          <p class="mb-0">
            Kami akan mengirimkan kode verifikasi untuk memperbarui kata sandi yang baru, mohon cek kembali Pesan Masuk di email Anda.
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  placeholder="Alamat Email"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Selanjutnya
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Kembali ke Halaman Login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
