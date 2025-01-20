<script setup>
import iconFileBox from '@images/icons/ic-file-box.png'
</script>

<template>
  <div>
    <VCard>
      <!-- 👉 Title -->
      <VCardItem class="pb-0">
        <VCardTitle>
          <h4 class="fw-500">
            Upload Produk
          </h4>
        </VCardTitle>
      </VCardItem>

      <!-- 👉 Upload products -->
      <VCardText>
				<div class="d-flex justify-center align-center pa-15 mt-5 mb-10 px-2 border border-radius-8">
					<div class="d-flex flex-column justify-center text-center">
						<VAvatar
							size="150"
							class="mx-auto"
							>
							<VImg
								:src="iconFileBox"
								class="mb-2"
								/>
						</VAvatar>
						<p class="text-body-2">
							Pilih atau letakkan file Excel (.csv) Anda untuk tambah produk sekaligus <br/>sesuai dengan template yang digunakan. Maks 100 produk dalam satu file.
						</p>
						<div class="d-flex flex-wrap justify-center gap-y-2 gap-x-4">
							<VBtn
								color="primary"
								variant="outlined"
								prepend-icon="tabler-file"
								>
								Unduh File
							</VBtn>
							<VBtn
								color="primary"
								prepend-icon="tabler-cloud-upload"
								>
								Upload File
							</VBtn>
						</div>
					</div>
				</div>
      </VCardText>
    </VCard>
  </div>
</template>
