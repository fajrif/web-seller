<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useMessageStore } from '@core/stores/config'
import { useUserDataStore } from '@core/stores/config'

const messageStore = useMessageStore()

const router = useRouter()
const ability = useAbility()

const loading = ref(false)
const isNonAktifMerchantDialogVisible = ref(false)

// TODO: Get type from backend
const userData = useUserDataStore()

const statusUser = ref(false)
if(userData.status == 1){
  statusUser.value = true
}

const clearCookies = async () => {

  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from sessionStorage
	userData.clear()

  // Redirect to login page
  await router.push('/login')

  // ℹ️  We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page

  // Remove "userAbilities" from cookie
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])

	// reset loading
	loading.value = false
}

const logout = async () => {
  try {
		loading.value = true
    const res = await $apiAuth('/logout', {
      method: 'POST',
      onResponseError({ response }) {
        throw new Error("Unable to logout seller data")
      },
    })

    await nextTick(() => {
      clearCookies()
    })
  } catch (err) {
		loading.value = false
    console.error(err)
  }
}

const nonAktifToko = async (status) => {
	if(status === false) {
		statusUser.value = !statusUser.value
	} else {
		const res = await $apiCore('/seller/command/merchant/nonaktif-toko', {
			method: 'POST',
			onResponseError({ response }) {
				loading.value = false
				let msg = response._data.message
				messageStore.setMessage('error', msg)
				statusUser.value = !statusUser.value
			},
		})

		let msg = res.message
		messageStore.setMessage('success', msg)

		await nextTick(() => {
			updateUserDataStore(() => {})
		})
	}
}

const onChange = async () => {
	isNonAktifMerchantDialogVisible.value = true
}

onMounted(() => {
	console.log('load user data')
	updateUserDataStore(() => {})
})
</script>

<template>
  <div class="cursor-pointer">
    <div class="d-flex gap-2 align-center">
      <VAvatar
        size="38"
        class="cursor-pointer"
        color="primary"
        variant="tonal"
      >
        <VImg
					v-if="userData.photo_url !== null && userData.photo_url !== ''"
					:src="userData.photo_url"
        />
        <VIcon
          v-else
          icon="tabler-user"
        />
      </VAvatar>
      <h6 v-if="userData.name !== null && userData.name !== ''" class="text-h6 font-weight-medium">
        {{ userData.name }}
      </h6>
    </div>
    <!-- menu section -->
    <VMenu
      activator="parent"
			:closeOnContentClick="false"
      width="240"
      location="bottom end"
      offset="12px"
    >
			<VCard>
				<VCardText class="pa-5 pb-2">
					<div class="d-flex justify-space-between">
						<div class="d-flex">
							<VAvatar
								class="me-2"
								color="primary"
								variant="tonal"
								>
								<VImg
									v-if="userData.photo_url !== null && userData.photo_url !== ''"
									:src="userData.photo_url"
									/>
								<VIcon
									v-else
									icon="tabler-user"
									/>
							</VAvatar>
							<div v-if="userData.id !== null && userData.id !== ''">
								<h6 class="text-h6 font-weight-medium">
									{{ userData.name }}
								</h6>
								<span class="text-sm text-disabled">
									{{ statusUser ? 'Aktif' : 'Non-Aktif' }}
								</span>
							</div>
						</div>
						<VSwitch
							v-model="statusUser"
							:loading="isNonAktifMerchantDialogVisible"
							@update:model-value="onChange"
							/>
					</div>
				</VCardText>
				<VList>
					<VListItemAction>
						<div class="w-100 px-4 py-0">
							<VBtn
								:disabled="loading"
								:loading="loading"
								block
								size="small"
								color="error"
								append-icon="tabler-logout"
								@click="logout"
							>
								Logout
							</VBtn>
						</div>
					</VListItemAction>
				</VList>
			</VCard>
    </VMenu>
    <!-- end menu section -->
    <NonAktifMerchantDialog
      v-model:is-dialog-visible="isNonAktifMerchantDialogVisible"
			:status-user="!statusUser"
      @form-submitted="nonAktifToko"
    />
  </div>
</template>
