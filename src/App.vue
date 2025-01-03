<script setup>
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore, useMessageStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'

const { global } = useTheme()

// ℹ️  Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
const snackbar = useMessageStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️  This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />

			<v-snackbar
				v-model="snackbar.visible"
				auto-height
				variant="tonal"
				:color="snackbar.color"
				:multi-line="snackbar.mode === 'multi-line'"
				:timeout="snackbar.timeout"
				:location="snackbar.position"
				>
				<v-layout align-center me-4>
					<div class="d-flex align-start">
						<VIcon
							:icon="snackbar.icon"
							class="me-2 mt-1"
						/>
						<div class="d-flex flex-column text-black">
							<strong class="text-black">{{ snackbar.title }}</strong>
							<p class="text-body-2 fw-500 mb-0">
								{{ snackbar.text }}
							</p>
						</div>
					</div>
				</v-layout>
				<template #actions>
					<VBtn
						icon="tabler-x"
						variant="text"
						color="secondary"
						@click="snackbar.visible = false"
					/>
				</template>
			</v-snackbar>

    </VApp>
  </VLocaleProvider>
</template>
