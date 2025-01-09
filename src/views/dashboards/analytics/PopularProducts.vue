<script setup>
import headphone from '@images/eCommerce/headphone.png'
import iphone from '@images/eCommerce/iphone.png'
import nike from '@images/eCommerce/nike.png'

const popularProducts = [
  {
    avatarImg: iphone,
    title: 'Apple iPhone 13',
    subtitle: '540 kali terjual',
    stock: 'Sisa 3',
    color: 'warning',
    price: 'Rp.12.000.000',
  },
  {
    avatarImg: nike,
    title: 'Nike Air Jordan',
    subtitle: '310 kali terjual',
    stock: 'Sisa 2',
    color: 'warning',
    price: 'Rp.1.500.000',
  },
  {
    avatarImg: headphone,
    title: 'Beats Studio 2',
    subtitle: '200 kali terjual',
    stock: 'Habis',
    color: 'error',
    price: 'Rp.2.500.000',
  },
]
</script>

<template>
  <VCard>
    <VCardItem class="py-3">
      <VCardTitle>Produk Terlaris</VCardTitle>
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
              <span class="text-body-1">{{ product.price }}</span>
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
