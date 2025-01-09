<script setup>
import img1 from '@images/icons/ic-rupiah.png'
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard color="primary">
        <VCardText>
          <VRow>
            <VCol cols="6">
              <div class="d-flex align-center">
                <VAvatar
                  rounded
                  size="54"
                  class="me-4"
                >
                  <VImg
                    :src="img1"
                    size="38"
                  />
                </VAvatar>
                <div>
                  <h6 class="text-h6 text-medium-emphasis text-white">
                    Saldo Pendapatan
                  </h6>
                  <h4 class="text-h4 text-white">
                    Rp.9.234.840.000
                  </h4>
                </div>
              </div>
            </VCol>
            <VCol
              cols="3"
              class="d-flex align-center"
            >
              <div class="d-flex align-center">
                <VAvatar
                  rounded
                  size="44"
                  class="bg-white text-primary me-4"
                >
                  <VIcon
                    icon="tabler-wallet"
                    size="28"
                  />
                </VAvatar>
                <div>
                  <a
                    href="#"
                    class="text-h6 text-medium-emphasis text-white"
                  >
                    Withdrawal
                  </a>
                </div>
              </div>
            </VCol>
            <VCol
              cols="3"
              class="d-flex align-center"
            >
              <div class="d-flex align-center mt2">
                <VAvatar
                  rounded
                  size="44"
                  class="bg-white text-primary me-4"
                >
                  <VIcon
                    icon="tabler-rotate-2"
                    size="28"
                  />
                </VAvatar>
                <div>
                  <a
                    href="#"
                    class="text-h6 text-medium-emphasis text-white"
                  >
                    History
                  </a>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
