<script setup>
import InvoiceOrder from '@/views/pages/pesanan/invoice/InvoiceOrder.vue'
</script>

<template>
	<div>
		<div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
			<div class="d-flex flex-column justify-center">
				<h4 class="text-h4 font-weight-medium">
					Invoice
				</h4>
			</div>
			<div
				class="d-flex gap-4"
				>
				<VBtn
					color="primary"
					style="width:fit-content"
					prepend-icon="tabler-download"
					>
					Download Invoice
				</VBtn>
			</div>
		</div>
		<InvoiceOrder />
	</div>
</template>
