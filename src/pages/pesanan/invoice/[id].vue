<script setup lang="ts">
import InvoiceOrder from '@/views/pages/pesanan/invoice/InvoiceOrder.vue';
import html2pdf from 'html2pdf.js';

const route = useRoute('pesanan-view-id');
const isLoading = ref(false);
const contentToPrint = ref<HTMLElement | null>(null);
const title = ref('Invoice-Order');

// The function that exports the content as a PDF
const downloadPdf = () => {
  try {
    isLoading.value = true;
    const element = contentToPrint.value;

    const options = {
      filename: `${title.value}-${route.params.id}.pdf`,
      image: { type: 'jpeg', quality: 100 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        logging: true,
        dpi: 192,
        allowTaint: true,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait', compress: true },
    };

    const elements = element?.querySelectorAll('.page');

    if (!elements || elements.length === 0) {
      isLoading.value = false;
      return;
    }

    let worker = html2pdf().set(options).from(elements[0]);

    if (elements.length > 1) {
      worker = worker.toPdf();

      for (let i = 1; i < elements.length; i++) {
        worker = worker
          .get('pdf')
          .then((pdf) => {
            pdf.addPage();
          })
          .from(elements[i])
          .toCanvas()
          .toPdf();
      }
    }

    worker.save().then(() => {
      isLoading.value = false;
    });
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
	<div>
		<div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
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
          variant="tonal"
					style="width:fit-content"
					prepend-icon="tabler-chevron-left"
          @click="() => { $router.go(-1) }"
					>
					Kembali
				</VBtn>
				<VBtn
          :loading="isLoading"
					color="primary"
					style="width:fit-content"
					prepend-icon="tabler-download"
          @click="downloadPdf"
					>
					Download Invoice
				</VBtn>
			</div>
		</div>
    <div ref="contentToPrint">
      <div class="page" style="width: 100%; height: 100%;">
        <InvoiceOrder />
      </div>
    </div>
	</div>
</template>
