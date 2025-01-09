<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const refVForm = ref()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const message = ref({
  text: '',
  color: 'text-success',
})

const router = useRouter()
const route = useRoute('reset-password')

const form = ref({
  email: '',
  token: '',
  password: '',
  passwordConfirmation: '',
})

if(route.query.email && route.query.token){
  form.value.email = route.query.email
  form.value.token = route.query.token
}

const resetPassword = async () => {
  try {
    /* eslint-disable camelcase */
    const res = await $apiAuth('/password/reset', {
      method: 'POST',
      body: {
        email: form.value.email,
        token: form.value.token,
        password: form.value.password,
        password_confirmation: form.value.passwordConfirmation,
      },
      onResponseError({ response }) {
        let msg = response._data.message
        message.value.text = msg
        message.value.color = 'text-error'
      },
    })
    /* eslint-enable */

    await nextTick(() => {
      message.value.text = res.message
      if(res.status_code == 400) {
        message.value.color = 'text-error'
      } else {
        message.value.color = 'text-success'
        router.push('/login')
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      resetPassword()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Ganti Kata Sandi 🔒
          </h4>
          <p class="mb-0">
            Silahkan masukkan kata sandi anda yang baru
          </p>
          <p
            v-if="message.text"
            class="mb-1"
            :class="message.color"
          >
            {{ message.text }}
          </p>
        </VCardText>

        <VCardText v-if="form.email && form.token">
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  autofocus
                  label="Password Baru"
                  placeholder="············"
                  :rules="[requiredValidator, alphaDashValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.passwordConfirmation"
                  label="Konfirmasi Password Baru"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :rules="[requiredValidator, confirmedValidator(form.passwordConfirmation, form.password)]"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Simpan Password Baru
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
                  <span>Kembali ke halaman login</span>
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
