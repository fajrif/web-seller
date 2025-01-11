<script setup>
import { VForm } from 'vuetify/components/VForm'
import logoImg from '@images/logo.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  email: '',
  password: '',
})

const login = async () => {
  try {
    errors.value = { email: undefined, password: undefined }

    const res = await $apiAuth('/login?type=seller', {
      method: 'POST',
      body: {
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        let msg = response._data.message
        if(msg.toUpperCase().indexOf("EMAIL") === -1) {
          errors.value.password = msg
        } else {
          errors.value.email = msg
        }
      },
    })

    const accessToken = res.token
    const userAbilityRules = [{ action: 'manage', subject: 'all' }]

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)
    useCookie('accessToken').value = accessToken

    await nextTick(() => {
			updateCookieUserData(() => {
				router.replace(route.query.to ? String(route.query.to) : '/')
			})
    })
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card rounded-lg"
        max-width="500"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <img
                  :src="logoImg"
                  alt="PLN Web Seller"
                >
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <p class="mb-0 text-center">
            Selamat datang di Marketplace Seller, silakan masukkan email dan password yang sudah terdaftar untuk toko Anda
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
                  v-model="credentials.email"
                  label="Email"
                  placeholder="Alamat Email"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-end my-6">
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Lupa Kata Sandi?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Masuk
                </VBtn>
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
