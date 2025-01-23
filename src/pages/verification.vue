<script setup>
import { useMessageStore } from '@core/stores/config'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const router = useRouter()
const route = useRoute('verification')
const messageStore = useMessageStore()
const otp = ref('')
const isOtpInserted = ref(false)
const isOtpError = ref(false)

const email = ref()
if(route.query.email){
  email.value = route.query.email
}

const replaceEmailSent = () => {
  if(email.value != undefined && email.value != '') {
    return '*****' + email.value.substring(5)
  }
  else {
    return '*****'
  }
}

const sendResetPassword = async () => {
  try {
		isOtpInserted.value = true
    const res = await $apiAuth('/password/email', {
      method: 'POST',
      body: {
        email: email.value,
      },
      onResponseError({ response }) {
				isOtpInserted.value = false
        let msg = response._data.message
        messageStore.setMessage('error', msg)
      },
    })

		isOtpInserted.value = false
		messageStore.setMessage('success', res.message)
  } catch (err) {
		isOtpInserted.value = false
		messageStore.setMessage('error', "Gagal kirim email kode verifikasi")
    console.error(err)
  }
}

const sendVerificationCode = async () => {
  try {
    const res = await $apiAuth('/password/verify-token', {
      method: 'POST',
      body: {
        email: email.value,
        token: otp.value,
      },
      onResponseError({ response }) {
        let msg = response._data.message
        isOtpError.value = true
        messageStore.setMessage('error', msg)
      },
    })

    await nextTick(() => {
			if(res.success && res.status_code == 200) {
				isOtpError.value = false
        messageStore.setMessage('success', res.message)
				router.push({ name: 'reset-password', query: { email: email.value, token: otp.value } })
			} else {
				isOtpError.value = true
        messageStore.setMessage('error', res.message)
			}
    })

  } catch (err) {
		isOtpError.value = true
		messageStore.setMessage('error', "Gagal melakukan proses verifikasi")
    console.error(err)
  }
}

const onSubmit = () => {
	isOtpInserted.value = true
	setTimeout(() => {
		isOtpInserted.value = false
		sendVerificationCode()
	}, 2000)
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Auth card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardText>
          <div v-if="email">
            <h4 class="text-h4 mb-1">
              Verifikasi Email
            </h4>
            <p class="mb-1">
              Kami telah mengirimkan kode verifikasi untuk login anda, mohon cek kembali Pesan Masuk di email Anda. <strong>{{ replaceEmailSent() }}</strong>
            </p>
          </div>
          <div v-else>
            <h4 class="text-h4 line-height-normal mb-2">
              Verifikasi Email Tidak Ditemukan
            </h4>
            <p class="mb-4">
              Email atau kode verifikasi tidak ditemukan, silahkan kembali ke halaman Lupa Kata Sandi.
            </p>
            <RouterLink
              class="d-flex align-center justify-center"
              :to="{ name: 'forgot-password' }"
            >
              <VIcon
                icon="tabler-chevron-left"
                size="20"
                class="me-1 flip-in-rtl"
              />
              <span>Kembali ke Halaman Lupa Password</span>
            </RouterLink>
          </div>
        </VCardText>

        <VCardText v-if="email">
					<VForm
						@submit.prevent="onSubmit"
						>
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <h6 class="text-body-1">
                  Ketik 4 digit kode verifikasi
                </h6>
                <VOtpInput
                  v-model="otp"
                  :disabled="isOtpInserted"
                  :error="isOtpError"
                  type="number"
                  length="4"
                  class="pa-0"
                  @finish="onSubmit"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  :loading="isOtpInserted"
                  :disabled="isOtpInserted"
                  block
                  type="submit"
                >
                  Verifikasi Akun Saya
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <div class="d-flex justify-center align-center flex-wrap">
                  <span class="me-1">Tidak mendapatkan kode verifikasi?</span>
                  <VBtn
                    variant="plain"
                    @click="sendResetPassword"
                  >
                    Kirim Ulang
                  </VBtn>
                </div>
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

.v-otp-input {
  .v-otp-input__content {
    padding-inline: 0;
  }
}
</style>
