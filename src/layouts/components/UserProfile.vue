<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const router = useRouter()
const ability = useAbility()

const loading = ref(false)
const switchOnLoading = ref(false)

// TODO: Get type from backend
const userData = useCookie('userData')

const statusUser = ref(false)
if(userData.value?.status == 1){
  statusUser.value = true
}

const clearCookies = async () => {

  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from cookie
  userData.value = null

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

const onChange = async () => {
	loading.value = true
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
		updateCookieUserData(() => {
			loading.value = false
		})
	})
}
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
					v-if="userData && userData.photo_url"
					:src="userData.photo_url"
        />
        <VIcon
          v-else
          icon="tabler-user"
        />
      </VAvatar>
      <h6 v-if="userData && userData.name" class="text-h6 font-weight-medium">
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
									v-if="userData && userData.photo_url"
									:src="userData.photo_url"
									/>
								<VIcon
									v-else
									icon="tabler-user"
									/>
							</VAvatar>
							<div v-if="userData">
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
							:loading="loading"
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
  </div>
</template>
