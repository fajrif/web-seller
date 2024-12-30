<script setup>

const orderActivities = [
  {
    id: 1,
    title: 'Pesanan Baru',
    icon: 'tabler-package-export',
    total: 200,
  },
  {
    id: 2,
    title: 'Siap Dikirim',
    icon: 'tabler-cube-send',
    total: 50,
  },
  {
    id: 3,
    title: 'Dalam Pengiriman',
    icon: 'tabler-truck-delivery',
    total: 23,
  },
  {
    id: 4,
    title: 'Pesanan Sampai',
    icon: 'tabler-shopping-cart-check',
    total: 690,
  },
  {
    id: 5,
    title: 'Pesanan Selesai',
    icon: 'tabler-rosette-discount-check',
    total: 723,
  },
  {
    id: 6,
    title: 'Dibatalkan',
    icon: 'tabler-shopping-cart-off',
    total: 19,
  },
  {
    id: 7,
    title: 'Ulasan Baru',
    icon: 'tabler-file-description',
    total: 350,
  },
  {
    id: 8,
    title: 'Diskusi Baru',
    icon: 'tabler-messages',
    total: 200,
  },
]
</script>

<template>
	<VRow>
		<VCol cols="12">
			<div class="pe-3">
				<h5 class="text-h5 mb-2">
					Aktifitas Pesanan
				</h5>
				<VRow class="match-height">
					<VCol
						v-for="item in orderActivities"
						:key="item.id"
						cols="12"
						md="4"
						>
						<VCard>
							<VCardText>
								<VAvatar
									rounded
									color="primary"
									:icon="item.icon"
									size="32"
									class="mb-4"
									/>
								<p class="my-1">
									{{ item.title }}
								</p>
								<h5 class="text-h5 fw-700 line-height-normal">
									{{ item.total }}
								</h5>
							</VCardText>
						</VCard>
					</VCol>
				</VRow>
			</div>
		</VCol>
	</VRow>
</template>
