<script setup>
import amazonEchoDot from '@images/eCommerce/amazon-echo-dot.png'
import appleWatch from '@images/eCommerce/apple-watch.png'
import sonyDualsense from '@images/eCommerce/sony-dualsense.png'

const popularProducts = [
  {
    avatarImg: appleWatch,
    title: 'Apple Watch Series 7',
    subtitle: 'SKU: #FXZ-2345',
    stock: 'Sisa 3',
    color: 'warning',
    price: 'Rp.4.500.000',
  },
  {
    avatarImg: amazonEchoDot,
    title: 'Amazon Echo Dot',
    subtitle: 'SKU: #FXZ-8959',
    stock: 'Sisa 2',
    color: 'warning',
    price: 'Rp.3.000.000',
  },
  {
    avatarImg: sonyDualsense,
    title: 'Play Station Console',
    subtitle: 'SKU: #FXZ-7892',
    stock: 'Habis',
    color: 'error',
    price: 'Rp.1.000.000',
  },
]
</script>

<template>
  <VCard>
    <VCardItem class="py-3">
      <VCardTitle>Stock Menipis</VCardTitle>
      <template #append>
        <div>
          <a href="#">Lihat Semua</a>
        </div>
      </template>
    </VCardItem>
    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="product in popularProducts"
          :key="product.title"
        >
          <template #prepend>
            <VAvatar
              size="46"
              rounded
              class="me-1"
              :image="product.avatarImg"
            />
          </template>

          <VListItemTitle class="font-weight-medium me-4">
            {{ product.title }}
          </VListItemTitle>
          <VListItemSubtitle class="me-4">
            {{ product.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <VChip :color="product.color">
                {{ product.stock }}
              </VChip>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
