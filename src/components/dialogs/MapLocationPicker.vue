<script setup>
import imgPin from '@images/misc/pin-location.png'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Pilih Lokasi',
  },
  latitude: {
    type: Number,
    default: 0,
  },
  longitude: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'formSubmitted',
])

// START FROM HERE
const { coords } = useCustomGeolocation()

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
const mapDiv = ref(null)

const initPos = {
	lat: 0,
	lng: 0
}

let currentPos = ref({
	lat: 0,
	lng: 0
})

const currPos = computed(() => ({
	lat: currentPos.value.lat,
	lng: currentPos.value.lng
}))

watch(() => props.isDialogVisible, async (visible) => {
  if (visible) {
		if(coords.value){
			initPos.lat = props.latitude == 0 ? coords.value.latitude : props.latitude
			initPos.lng = props.longitude == 0 ? coords.value.longitude : props.longitude
			currentPos.value.lat = initPos.lat
			currentPos.value.lng = initPos.lng
		}

		// Promise for a specific library
		loader
			.importLibrary('maps')
			.then(async ({ Map }) => {
				const map = new Map(mapDiv.value, {
					center: currPos.value,
					zoom: 17,
					treetViewControl: false,
					mapTypeControl: false,
					mapId: "ALAMAT_MAP_ID"
				});
				const { AdvancedMarkerElement } = await loader.importLibrary('marker');
				const draggableMarker = new AdvancedMarkerElement({ map, position: currPos.value, gmpDraggable: true });
				draggableMarker.addListener("dragend", (event) => {
					const position = draggableMarker.position
					currentPos.value.lat = position.lat
					currentPos.value.lng = position.lng
				});

				map.addListener("click", (event) => {
					currentPos.value.lat = event.latLng.lat()
					currentPos.value.lng = event.latLng.lng()
					draggableMarker.position = { lat: currentPos.value.lat, lng: currentPos.value.lng }
				});

				// Autocomplete API
				const Places = await loader.importLibrary('places')
				//this object will be our second arg for the new instance of the Places API
				const options = {
					componentRestrictions: { country: "id" },
					fields: ["address_component", "geometry", "formatted_address", "name"],
				};
				// per the Google docs create the new instance of the import above. I named it Places.
				const input = document.getElementById("app-text-field-search-input")
				const autocomplete = new Places.Autocomplete(input, options);

				//add the place_changed listener to display results when inputs change
				autocomplete.addListener('place_changed', () => {
					const place = autocomplete.getPlace(); //this callback is inherent you will see it if you logged autocomplete
					currentPos.value.lat = place.geometry.location.lat()
					currentPos.value.lng = place.geometry.location.lng()
					draggableMarker.position = { lat: currentPos.value.lat, lng: currentPos.value.lng }
				});

			})
			.catch((e) => {
				// do something
				console.log(e)
			});

	}
	else {
		// reset lat,lng
		initPos.lat = 0
		initPos.lng = 0
		currentPos.value.lat = 0
		currentPos.value.lng = 0
	}
})

const onReset = () => {
  emit('update:isDialogVisible', false)
}

const onSubmit = () => {
	emit('formSubmitted', currentPos.value.lat, currentPos.value.lng)
	emit('update:isDialogVisible', false)
}

</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="onReset()" />

    <VCard class="pa-2 pa-sm-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center pt-0">
        <VCardTitle>
          <h4 class="text-h4 mb-2">
            {{ props.title }}
          </h4>
        </VCardTitle>
        <p class="text-body-1 mb-0">
        </p>
      </VCardItem>

      <VCardText class="pt-6 pb-0">
				<VRow>
					<!-- 👉 Card Name -->
					<VCol cols="12">

						<div class="d-flex text-center mb-2">
							<div class="w-100">
								<AppTextField
									id="search-input"
									append-inner-icon="tabler-map-pin"
									placeholder="Cari alamat atau lokasi ..."
								/>
								<span v-if="currPos" class="text-sm">
									Latitude:  <strong>{{ currPos.lat }}</strong>
									Longitude: <strong>{{ currPos.lng }}</strong>
								</span>
								<span v-else>Click the map to select a position</span>
							</div>
						</div>
						<div ref="mapDiv" style="width:100%;height:60vh" />

					</VCol>
				</VRow>
      </VCardText>
      <VCardActions class="pt-5 pb-0">
				<div class="d-flex justify-center gap-4">
					<VBtn
						color="secondary"
						variant="tonal"
						@click.stop="onReset"
						>
						Batal
					</VBtn>
					<VBtn
						type="button"
						color="primary"
						variant="tonal"
						@click.stop="onSubmit"
						>
						Simpan
					</VBtn>
				</div>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<style>
.pac-container {
	z-index: 9999 !important;
}
</style>
