<script setup>
import notFoundImg from '@images/icons/ic-search.png'

const props = defineProps({
  orientation: {
    type: Number,
    required: false,
		default: 0,
  },
  imgSrc: {
    type: String,
    required: false,
		default: '',
  },
  btnText: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  border: {
    type: Boolean,
    required: false,
		default: true,
  },
  wrapperClass: {
    type: String,
    required: false,
		default: 'pa-10 ma-10',
  },
})

const emit = defineEmits([
  'clickButton',
])

const onClick = () => {
  emit('clickButton')
}
</script>

<template>
	<div
		v-if="props.orientation == 1"
		class="d-flex justify-center align-center"
		:class="[{ border: props.border, 'border-radius-8': props.border }, props.wrapperClass]"
		>
		<div class="d-flex flex-column align-center text-center">
			<VAvatar size="200">
				<VImg
					:src="props.imgSrc == '' ? notFoundImg : props.imgSrc"
					class="mb-5"
					/>
			</VAvatar>
			<div>
				<h3
					v-if="props.title"
					class="fw-500 mb-2"
					>
					{{ props.title }}
				</h3>
				<p v-html="props.description" class="text-body-2" />
				<VBtn
					v-if="props.btnText"
					color="primary"
					@click="onClick"
				>
					{{ props.btnText }}
				</VBtn>
			</div>
		</div>
	</div>
	<div v-else
		class="d-flex justify-center align-center"
		:class="[{ border: props.border, 'border-radius-8': props.border }, props.wrapperClass]"
		>
		<div class="d-flex align-center">
			<VAvatar
				size="100"
				class="d-none d-md-block me-6"
			>
				<VImg
					:src="props.imgSrc == '' ? notFoundImg : props.imgSrc"
					class="mb-2"
				/>
			</VAvatar>
			<div class="d-flex flex-column text-center text-md-start">
				<VAvatar
					size="100"
					class="d-block d-md-none mx-auto mb-4"
				>
					<VImg :src="props.imgSrc == '' ? notFoundImg : props.imgSrc" />
				</VAvatar>
				<p v-html="props.description" class="text-body-2" />
				<VBtn
					v-if="props.btnText"
					color="primary"
					style="width:fit-content"
					@click.stop="onClick"
				>
					{{ props.btnText }}
				</VBtn>
			</div>
		</div>
	</div>
</template>
