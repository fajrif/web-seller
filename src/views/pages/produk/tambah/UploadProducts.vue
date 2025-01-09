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
      <VCardText class="d-flex justify-center align-center pa-15 mx-5 mt-5 mb-10 border border-radius-8">
        <div class="d-flex flex-column justify-center text-center">
          <VImg
            :src="iconFileBox"
            class="mx-auto w-40"
          />
          <p
            class="text-body-2"
            style="width:500px;"
          >
            Pilih atau letakkan file Excel (.csv) Anda untuk tambah produk sekaligus sesuai dengan template yang digunakan. Maks 100 produk dalam satu file.
          </p>
          <div class="d-flex flex-wrap gap-4 justify-center">
            <VBtn
              color="primary"
              variant="outlined"
              style="width:fit-content"
              prepend-icon="tabler-file"
            >
              Unduh File
            </VBtn>
            <VBtn
              color="primary"
              style="width:fit-content"
            >
              Upload File
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
