<script setup>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import StencilBanner from "@/components/dialogs/vue-advanced-cropper/StencilBanner.vue";

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: 'Upload Gambar',
  },
  description: {
    type: String,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

const image = reactive({
	src: "",
	type: "",
});
const cropper = ref();
const file = ref();

// once cropped
const cropImage = () => {
	if (cropper.value) {
		const { canvas } = cropper.value.getResult();
		const newTab = window.open();
		if (newTab && canvas) {
			newTab.document.body.innerHTML = `<img src="${canvas.toDataURL(
				image.type
			)}"></img>`;
		}
	}
};

const uploadImage = (event) => {
	/// Reference to the DOM input element
	const { files } = event.target;
	// Ensure that you have a file before attempting to read it
	if (files && files[0]) {
		// 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
		if (image.src) {
			URL.revokeObjectURL(image.src);
		}
		// 2. Create the blob link to the file to optimize performance:
		const blob = URL.createObjectURL(files[0]);
		// 3. Update the image. The type will be derived from the extension and it can lead to an incorrect result:
		image.src = blob;
		image.type = files[0].type;
	}
};

const onReset = () => {
  emit('update:isDialogVisible', false)
	if (image.src) {
		URL.revokeObjectURL(image.src);
	}
	image.src = ''
	image.type = ''
}

const onSubmit = () => {
	emit('formSubmitted', file)
	emit('update:isDialogVisible', false)
}

onUnmounted(() => {
	if (image.src) {
		URL.revokeObjectURL(image.src);
	}
});
</script>

<template>
  <VDialog
    max-width="600"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <!-- Dialog Content -->
    <VCard>
			<!-- 👉 Title -->
			<VCardItem>
				<VCardTitle>
					<h4 class="text-h4 mb-2">
						{{ props.title }}
					</h4>
				</VCardTitle>
				<p v-if="props.description" class="text-body-1 mb-0">
						{{ props.description }}
				</p>
			</VCardItem>
			<VCardText>
        <div
          v-if="image.src === '' || image.src === null"
          class="d-flex flex-column justify-center align-center gap-y-2 pa-12 drop-zone rounded"
        >
          <IconBtn
						color="primary"
            variant="tonal"
            class="rounded-sm"
						@click="file.click()"
          >
            <VIcon icon="tabler-upload" />
          </IconBtn>
          <h5 class="text-h5">
            Browse file.
          </h5>
        </div>
				<div v-else>
					<Cropper
						ref="cropper"
						class="upload-example-cropper"
						:src="image.src"
						:stencil-component="StencilBanner"
					/>
				</div>
			</VCardText>

      <VCardActions class="justify-start">
				<div class="d-flex flex-row gap-2">
					<VBtn
						type="button"
						size="small"
						color="primary"
						variant="tonal"
						class="ms-3 w-100"
						@click="file.click()"
					>
						<VIcon
							icon="tabler-cloud-upload"
							class="d-sm-none"
						/>
						<span class="d-none d-sm-block">Upload</span>
					</VBtn>

					<input
						ref="file"
						type="file"
						name="file"
						accept=".jpeg,.png,.jpg"
						hidden
						@change="uploadImage($event)"
					>

					<VBtn
						type="button"
						size="small"
						color="primary"
						variant="flat"
						class="w-100"
						@click="cropImage()"
					>
						<span class="d-none d-sm-block">Crop</span>
						<VIcon
							icon="tabler-refresh"
							class="d-sm-none"
						/>
					</VBtn>
				</div>
			</VCardActions>
    </VCard>
  </VDialog>
</template>

<style>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), var(--v-border-opacity));
	background-color: #fafafa;
}

.upload-example-cropper {
  border: solid 1px #EEE;
  min-height: 300px;
  width: 100%;
}
</style>
