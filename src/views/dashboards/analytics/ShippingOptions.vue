<script setup>
import img1 from '@images/logos/delivery/ninja.png'
import img2 from '@images/logos/delivery/posaja.png'
import img3 from '@images/logos/delivery/jne.png'
import img4 from '@images/logos/delivery/jnt.png'

const shippingOptions = [
  {
    id: 1,
    name: 'Ninja Express',
    image: img1,
    total: 350,
    color: 'pink',
  },
  {
    id: 2,
    name: 'POS Indonesia',
    image: img2,
    total: 200,
    color: 'lightgrey',
  },
  {
    id: 3,
    name: 'JNE',
    image: img3,
    total: 30,
    color: 'antiquewhite',
  },
  {
    id: 4,
    name: 'J&T Express',
    image: img4,
    total: 50,
    color: 'pink',
  },
]
</script>

<template>
	<VCard>
		<VCardItem class="py-3">
			<VCardTitle>Jasa Logistik</VCardTitle>
			<template #append>
				<div>
					<a href="#">Lihat Semua</a>
				</div>
			</template>
		</VCardItem>
		<VCardText>
			<VRow class="match-height">
				<VCol
					v-for="item in shippingOptions"
					:key="item.id"
					cols="12"
					sm="6"
					md="6"
					>
					<VCard>
						<VCardText
							:class="`pa-2 bg-${item.color}`"
							>
							<VAvatar rounded size="80">
								<img :src="item.image">
							</VAvatar>

							<p class="my-1">
								{{ item.name }}
							</p>
							<h5 class="text-h5 fw-700">
								{{ item.total }}
							</h5>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>
