<script setup>
import { useMessageStore } from '@core/stores/config'

const snackbar = useMessageStore()
</script>

<template>
	<VSnackbar
		v-model="snackbar.visible"
		auto-height
		variant="tonal"
		:color="snackbar.color"
		:multi-line="snackbar.mode === 'multi-line'"
		:timeout="snackbar.timeout"
		:location="snackbar.position"
	>
		<VLayout
			align-center
			me-4
		>
			<div class="d-flex align-start">
				<VIcon
					size="30"
					:icon="snackbar.icon"
					class="me-2 mt-1"
				/>
				<div class="d-flex flex-column text-black">
					<h2 class="text-black" style="font-size:1.3em;">{{ snackbar.title }}</h2>
					<p class="text-body-1 fw-500 mb-0">
						{{ snackbar.text }}
					</p>
				</div>
			</div>
		</VLayout>
		<template #actions>
			<VBtn
				icon="tabler-x"
				variant="text"
				color="secondary"
				@click="snackbar.visible = false"
			/>
		</template>
	</VSnackbar>
</template>
