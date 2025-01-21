<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  images: {
    type: Array,
    required: true,
		default: []
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const onReset = () => {
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 800"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard>
			<VCardText class="pa-2">
				<!-- 👉 Swiper	-->
				<swiper-container
					class="mySwiper swiperMain"
					style="border:0;padding-bottom:0;"
					thumbs-swiper=".mySwiper2"
					loop="true"
					space-between="10"
					navigation="true"
					centered-slides="true"
					events-prefix="swiper-"
				>
					<swiper-slide
						v-for="swiperImg in props.images"
						:key="swiperImg.id"
					>
						<VImg
							:src="swiperImg.url"
							cover
						/>
					</swiper-slide>
				</swiper-container>

				<swiper-container
					class="mySwiper2"
					style="margin-left:10px;margin-right:10px;"
					loop="true"
					free-mode="true"
					events-prefix="swiper-"
					slides-per-view="4"
				>
					<swiper-slide
						v-for="swiperImg in props.images"
						:key="swiperImg.id"
					>
						<VImg
							:src="swiperImg.url"
							cover
						/>
					</swiper-slide>
				</swiper-container>
				<!-- End Swiper	-->
			</VCardText>
    </VCard>
  </VDialog>
</template>
