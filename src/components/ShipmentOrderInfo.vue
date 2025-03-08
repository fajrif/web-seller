<script setup>
const props = defineProps({
  isShowInfo: {
    type: Boolean,
    required: true,
    default: false,
  },
})
</script>

<template>
  <div style="font-size:small;">
    <VAlert
      v-show="props.isShowInfo"
      type="info"
      variant="tonal"
      >
      Pihak jasa pengiriman akan menghubungi Anda melalui
      nomor handphone Anda yang terdaftar di PLN Mobile
    </VAlert>
    <div
      class="pa-4"
      :class="{ border: !props.isShowInfo, rounded: !props.isShowInfo, 'bg-warning-info': !props.isShowInfo }"
      >
      <h6 class="text-h6 fw-700">Pastikan</h6>
      <ol class="ms-6">
        <li>Produk yang dikirim sudah sesuai pesanan</li>
        <li>Paket telah terbungkus rapi</li>
        <li>Jika Anda menggunakan Request Pick Up. Pastikan Anda telah menuliskan <strong>Kode Booking</strong>, <strong>Nama Penerima</strong>, <strong>Alamat</strong> dan <strong>No.Telepon</strong> pada label paket</li>
      </ol>
    </div>
  </div>
</template>
