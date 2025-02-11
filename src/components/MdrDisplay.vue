<script setup>

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
  },
  backgroundColor: {
    type: String,
    required: false,
    default: 'bg-light-blue',
  },
})

var mdrData = reactive({})
const mdrCost = ref(2000)
const taxCost = ref(0)
const MIN_CALCULATE = 2000

await $apiCore('/seller/query/mdr/value', {
  method: 'GET',
  onResponse({ request, response, options }) {
    if(response._data?.success) {
			mdrData = response._data?.data
    }
  },
  onResponseError({ response }) {
    console.error(response)
  },
})

const getMdrType = () => {
	let _mdrTypeText = "Fixed";
	if(mdrData.mdr_type !== null) {
		_mdrTypeText = mdrData.mdr_value.toString() + '%';
	}
	return _mdrTypeText;
}

const getMdrCost = computed(() => {
	mdrCost.value = 2000;
	if(mdrData.mdr_type !== null && props.modelValue > MIN_CALCULATE) {
		mdrCost.value = (mdrData.mdr_value * props.modelValue) / 100;
	}
	return mdrCost.value;
})

const getTaxPercentage = () => {
	return mdrData.ppn_value.toString() + '%';
}

const getTaxCost = computed(() => {
	taxCost.value = 0;
	if(mdrData.ppn_type !== null && props.modelValue > MIN_CALCULATE) {
		taxCost.value = (mdrData.ppn_value * props.modelValue) / 100;
	}
	return taxCost.value;
})

// Total dana yg diterima =  Harga Satuan - (Hitung Nilai MDR + Hitung PPN)
const getAmount = computed(() => {
	let _amount = 0;
	if(props.modelValue > MIN_CALCULATE) {
		_amount = props.modelValue - (mdrCost.value + taxCost.value);
	}
	return _amount;
})

</script>

<template>
	<div
		v-if="props.modelValue"
		class="d-flex justify-center rounded py-6 px-4 mb-2"
		:class="props.backgroundColor"
		>
		<div class="me-auto">
			<p class="mb-4">
				Merchant Discount Rate (MDR)
			</p>
			<p class="mb-4">
				Nominal Merchant Discount Rate (MDR)
			</p>
			<p v-if="mdrData.ppn_value > 0" class="mb-4">
				PPN
			</p>
			<p v-if="mdrData.ppn_value > 0" class="mb-4">
				Nominal PPN
			</p>
			<p class="text-primary fw-700 mb-0">
				Dana yang akan diterima
			</p>
		</div>

		<div class="ms-auto text-end">
			<p class="mb-4">
				{{ getMdrType() }}
			</p>
			<p class="mb-4">
				{{ toCurrency(getMdrCost) }}
			</p>
			<p v-if="mdrData.ppn_value > 0" class="mb-4">
				{{ getTaxPercentage() }}
			</p>
			<p v-if="mdrData.ppn_value > 0" class="mb-4">
				{{ toCurrency(getTaxCost) }}
			</p>
			<p class="text-primary fw-700 mb-0">
				{{ toCurrency(getAmount) }}
			</p>
		</div>
	</div>
</template>
