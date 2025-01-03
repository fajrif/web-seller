<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie('userData')

const statusUser = ref(true)

const logout = async () => {

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
}
</script>

<template>
	<div class="cursor-pointer">
		<div class="d-flex gap-2 align-center">
			<VAvatar
				v-if="userData"
				size="38"
				class="cursor-pointer"
				:color="!(userData && userData.avatar) ? 'primary' : undefined"
				:variant="!(userData && userData.avatar) ? 'tonal' : undefined"
				>
				<VImg
					v-if="userData && userData.avatar"
					:src="userData.avatar"
					/>
				<VIcon
					v-else
					icon="tabler-user"
					/>
			</VAvatar>
			<h6 v-if="userData" class="text-h6 font-weight-medium">
				{{ userData.fullName || userData.username }}
			</h6>
		</div>
		<!-- SECTION Menu -->
		<VMenu
			activator="parent"
			width="240"
			location="bottom end"
			offset="12px"
		>
			<VList>
				<VListItem>
					<div class="d-flex justify-space-between gap-2 align-center">
						<div class="d-flex">
							<VListItemAction>
								<VAvatar class="me-2"
									:color="!(userData && userData.avatar) ? 'primary' : undefined"
									:variant="!(userData && userData.avatar) ? 'tonal' : undefined"
									>
									<VImg
										v-if="userData && userData.avatar"
										:src="userData.avatar"
										/>
									<VIcon
										v-else
										icon="tabler-user"
										/>
								</VAvatar>
							</VListItemAction>

							<div>
								<h6 v-if="userData" class="text-h6 font-weight-medium">
									{{ userData.fullName || userData.username }}
								</h6>
								<VListItemSubtitle class="d-flex justify-between text-capitalize text-disabled">
									{{ statusUser ? 'Aktif' : 'Non-Aktif' }}
								</VListItemSubtitle>
							</div>
						</div>
						<div>
							<VSwitch
								v-model="statusUser"
								/>
						</div>
					</div>
				</VListItem>
				<PerfectScrollbar :options="{ wheelPropagation: false }">
					<div class="px-4 py-2">
						<VBtn
							block
							size="small"
							color="error"
							append-icon="tabler-logout"
							@click="logout">
							Logout
						</VBtn>
					</div>
				</PerfectScrollbar>
			</VList>
		</VMenu>
		<!-- !SECTION -->
	</div>
</template>
