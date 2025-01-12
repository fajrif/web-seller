<script setup>
import addBannerImg from '@images/misc/add-banner.png'
import notFoundImg from '@images/icons/ic-search.png'
import avatar from '@images/misc/img-default.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const isFormValid = ref(false)
const refForm = ref()
const	merchantPhoto = ref('')
const	merchantName = ref('')
const	merchantDescription = ref('')
const	merchantSlogan = ref('')
const	merchantRequestNPWP = ref(false)

// image-upload
const show = ref(false)
const showBanner = ref(false)
const allowImgFormat = ['jpg','png']
const uploadUrl = import.meta.env.VITE_API_CDN_URL + '/upload'
const fileLoadUrl = import.meta.env.VITE_API_CDN_URL + '/file/load/'
const params = { type: 'merchant' }

// temporary to save data
var operationalAttrs = {}

const { data: merchantDetails } = await useApiCore("/seller/query/merchant/profile-toko")
if (merchantDetails.value.success) {
  let merchant = merchantDetails.value.data.merchant
	// need to save this
	let operationals = merchantDetails.value.data.merchant.operationals
	operationalAttrs = getOperationalAttrs(operationals)

	merchantPhoto.value = merchant.photo_url
  merchantName.value = merchant.name
  merchantDescription.value = merchant.description
  merchantSlogan.value = merchant.slogan
  merchantRequestNPWP.value = merchant.is_npwp_required
}

const { data: bannersData, execute: fetchBanners } = await useApiCore(createUrl('/seller/command/merchant/banner'))

const banners = computed(() => bannersData.value.data)

const saveMerchant = async merchantData => {
  try {
    const res = await $apiCore("/seller/command/merchant/atur-toko", {
      method: 'POST',
      body: merchantData,
      onResponseError({ response }) {
        console.log(response)
      },
    })

		updateCookieUserData(() => {})

    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal simpan informasi toko')
    console.error("Error on update merchant data:", error)
  }
}

/* eslint-disable camelcase */
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      saveMerchant({
        name: merchantName.value,
        description: merchantDescription.value,
        slogan: merchantSlogan.value,
        is_npwp_required: merchantRequestNPWP.value,
				photo_url: merchantPhoto.value,
				...operationalAttrs
      })
    }
  })
}
/* eslint-enable */

// hapus banner
const deleteBanner = async (id) => {
  try {
		const res = await $apiCore(`/seller/command/merchant/banner/${id}`, { method: 'DELETE' })

		fetchBanners()
		let msg = res.message
		messageStore.setMessage('success', msg)
  } catch (error) {
    messageStore.setMessage('error', 'Gagal hapus banner')
    console.error("Error on delete merchant banner:", error)
  }
}

// reset avatar image
const clearAvatar = () => {
	merchantPhoto.value = null
}

const toggleShow = () => {
	show.value = !show.value;
}

const toggleShowBanner = () => {
	showBanner.value = !showBanner.value;
}

const cropSuccess = (imgDataUrl, field) => {
	merchantPhoto.value = imgDataUrl
}

const cropUploadSuccess = async (data, field) => {
	if (data.success) {
		merchantPhoto.value = fileLoadUrl + data.path

		let merchantData = {
			name: merchantName.value,
			description: merchantDescription.value,
			slogan: merchantSlogan.value,
			is_npwp_required: merchantRequestNPWP.value,
			photo_url: merchantPhoto.value,
			...operationalAttrs
		}

    await $apiCore("/seller/command/merchant/atur-toko", {
      method: 'POST',
      body: merchantData,
      onResponseError({ response }) {
        console.log(response)
      },
    })

    await nextTick(() => {
			updateCookieUserData(() => {})
    })
	} else {
		console.log(jsonData)
	}
}

const cropUploadFail = (status, field) => {
	console.log('Upload CDN fail')
	console.log(status)
}

// crop banner
const cropBannerUploadSuccess = async (data, field) => {
	if (data.success) {
		let bannerPath = fileLoadUrl + data.path

    await $apiCore("/seller/command/merchant/banner", {
      method: 'POST',
			body: {
				url: bannerPath
			},
      onResponseError({ response }) {
        console.log(response)
      },
    })

    await nextTick(() => {
			fetchBanners()
    })
	} else {
		console.log(jsonData)
	}
}

const cropBannerUploadFail = (status, field) => {
	console.log('Upload CDN fail')
	console.log(status)
}
</script>

<template>
	<div>
		<VRow>
			<VCol cols="12">
				<VCard>
					<VCardText class="d-flex">
						<!-- 👉 Avatar -->
						<VAvatar
							v-if="merchantPhoto"
							rounded
							size="100"
							class="me-6"
							:image="merchantPhoto"
							/>
						<VAvatar v-else
							rounded
							size="100"
							class="me-6"
							:image="avatar"
							/>

						<!-- 👉 Upload Photo -->
						<div class="d-flex flex-column justify-center gap-4">
							<div class="d-flex flex-wrap gap-4">
								<VBtn
									color="primary"
									size="small"
									@click="toggleShow"
									>
									<VIcon
										icon="tabler-cloud-upload"
										class="d-sm-none"
										/>
									<span class="d-none d-sm-block">Upload photo</span>
								</VBtn>
							</div>

							<p class="text-body-1 mb-0">
								Ukuran optimal 300 x 300 piksel dengan Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG
							</p>
						</div>
					</VCardText>

					<VCardText class="pt-2">
						<!-- 👉 Form -->
						<VForm
							ref="refForm"
							v-model="isFormValid"
							class="mt-3"
							@submit.prevent="onSubmit"
							>
							<VRow>
								<VCol cols="12">
									<VRow>
										<VCol
											md="6"
											cols="12"
											>
											<VRow>
												<VCol cols="12">
													<AppTextField
														v-model="merchantName"
														:rules="[requiredValidator]"
														placeholder="Nama toko anda"
														label="Nama Toko"
														/>
												</VCol>
												<VCol cols="12">
													<AppTextField
														v-model="merchantSlogan"
														placeholder="Slogan toko anda"
														label="Slogan Toko"
														/>
												</VCol>
											</VRow>
										</VCol>

										<VCol
											md="6"
											cols="12"
											>
											<AppTextarea
												v-model="merchantDescription"
												placeholder="Deskripsi dan Informasi toko"
												label="Deskripsi Toko"
												/>
										</VCol>
									</VRow>
								</VCol>

								<!-- 👉 Status Toko -->
								<VCol
									cols="12"
									class="d-flex flex-wrap justify-start align-center"
									>
									<h4 class="fw-700">
										Request NPWP
									</h4>
									<VTooltip location="top">
										<template #activator="{ props }">
											<VIcon
												v-bind="props"
												size="20"
												icon="tabler-info-circle"
												/>
										</template>
										<span>
											Request NPWP merupakan pengaturan permintaan nomor NPWP kepada Pembeli.<br>
											Jika Anda mengaktifkan Request NPWP, maka akan muncul form input NPWP ketika Pembeli<br>
											melakukan checkout
										</span>
									</VTooltip>
									<VSwitch
										v-model="merchantRequestNPWP"
										:label="merchantRequestNPWP == true ? 'Aktif' : 'Non-Aktif'"
										class="ms-2"
										/>
								</VCol>

								<!-- 👉 Form Actions -->
								<VCol
									cols="12"
									class="d-flex flex-wrap justify-end gap-4"
									>
									<VBtn type="submit">
										Simpan Informasi
									</VBtn>
								</VCol>
							</VRow>
						</VForm>
					</VCardText>
				</VCard>
			</VCol>

			<VCol cols="12">
				<!-- 👉 Banner Toko -->
				<VCard title="Banner Toko">
					<VCardText>
						<div
							v-if="banners && banners.length > 0"
							class="d-flex justify-center align-center gap-3 flex-wrap"
						>
							<VRow class="match-height w-100">
								<template
									v-for="(item, index) in banners"
									:key="index"
								>
									<VCol
										cols="12"
										md="2"
									>
										<VCard :ripple="false">
											<VCardText class="d-flex flex-column pa-2">
												<VImg
													rounded
													:src="item.url"
													class="w-100 mx-auto"
												/>
											</VCardText>
											<VCardActions>
												<VBtn
													size="small"
													variant="tonal"
													color="error"
													block
													@click.stop="deleteBanner(item.id)"
												>
													Hapus
												</VBtn>
											</VCardActions>
										</VCard>
									</VCol>
								</template>
									<VCol
										cols="12"
										md="2"
									>
										<VCard :ripple="false">
											<VCardText class="d-flex flex-column pa-2">
												<VImg
													rounded
													:src="addBannerImg"
													class="w-100 mx-auto"
												/>
											</VCardText>
											<VCardActions>
												<VBtn
													size="small"
													variant="flat"
													color="primary"
													block
													@click.stop="toggleShowBanner"
												>
													Tambah Banner
												</VBtn>
											</VCardActions>
										</VCard>
									</VCol>
							</VRow>
						</div>

						<!-- 👉 Empty banners -->
						<div v-else class="d-flex justify-center align-center px-10 py-15 border border-radius-8">
							<div class="d-flex align-center">
								<VAvatar
									size="100"
									class="me-6"
								>
									<VImg
										:src="notFoundImg"
										class="mb-2"
									/>
								</VAvatar>
								<div class="d-flex flex-column">
									<p
										class="text-body-2"
										style="width:350px"
									>
										Anda belum menambahkan banner toko untuk toko anda. Silahkan menambahkan banner toko untuk mempercantik tampilan toko anda
									</p>
									<VBtn
										color="primary"
										style="width:fit-content"
										prepend-icon="tabler-plus"
										@click="toggleShowBanner"
									>
										Tambah Banner
									</VBtn>
								</div>
							</div>
						</div>
					</VCardText>
				</VCard>
			</VCol>

		</VRow>
		<UploadAvatarDialog
			v-model="show"
			:width="300"
			:height="300"
			:url="uploadUrl"
			lang-type="en"
			:no-circle="true"
			:params="params"
			:allow-img-format="allowImgFormat"
			field="file"
			@crop-success="cropSuccess"
			@crop-upload-success="cropUploadSuccess"
			@crop-upload-fail="cropUploadFail" />
		<UploadAvatarDialog
			v-model="showBanner"
			:width="600"
			:height="600"
			:url="uploadUrl"
			lang-type="en"
			:no-circle="true"
			:params="params"
			:allow-img-format="allowImgFormat"
			field="file"
			@crop-upload-success="cropBannerUploadSuccess"
			@crop-upload-fail="cropBannerUploadFail" />
	</div>
</template>
