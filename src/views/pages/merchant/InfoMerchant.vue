<script setup>
import avatar from '@images/misc/img-default.png'
import { useMessageStore } from '@core/stores/config'

const messageStore = useMessageStore()

const loading = ref(false)
const isUploadPhotoDialogVisible = ref(false)
const isUploadBannerDialogVisible = ref(false)
const refForm = ref()
const	merchantPhoto = ref('')
const	merchantName = ref('')
const	merchantDescription = ref('')
const	merchantSlogan = ref('')
const	merchantRequestNPWP = ref(false)

const	photoAttr = {
	title: "Upload Foto Toko",
	description: "Ukuran optimal 300 x 300 piksel dengan Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG",
	params: {
		type: 'merchant'
	},
}

const	bannerAttr = {
	title: "Upload Banner",
	description: "Besar file: Maksimum 10 Mb. Ektensi file yang diperbolehkan: JPG, JPEG, PNG",
	params: {
		type: 'merchant'
	},
	stencil: {
		aspectRatio: 16/8,
	},
}

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
				loading.value = false
				messageStore.setMessage('error', response._data.message)
      },
    })

    await nextTick(() => {
			loading.value = false
			updateCookieUserData(() => {
				let msg = res.message
				messageStore.setMessage('success', msg)
			})
		})

  } catch (error) {
		loading.value = false
    messageStore.setMessage('error', 'Gagal simpan informasi toko')
    console.error("Error on update merchant data:", error)
  }
}

const savingMerchant = () => {
	/* eslint-disable camelcase */
	saveMerchant({
		name: merchantName.value,
		description: merchantDescription.value,
		slogan: merchantSlogan.value,
		is_npwp_required: merchantRequestNPWP.value,
		photo_url: merchantPhoto.value,
		...operationalAttrs
	})
	/* eslint-enable */
}

const onSubmit = () => {
	loading.value = true
	refForm.value?.validate().then(({ valid }) => {
		if (valid) {
			setTimeout(() => {
				savingMerchant()
			}, 1000)
		} else {
			loading.value = false
			messageStore.setMessage('error', 'Gagal simpan informasi toko')
		}
	})
}

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

const openPhotoDialog = () => {
  isUploadPhotoDialogVisible.value = true
}

const openBannerDialog = () => {
  isUploadBannerDialogVisible.value = true
}

const uploadMerchantPhoto = async (path) => {
	if (path !== '') {
		merchantPhoto.value = path

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
    messageStore.setMessage('error', 'Gagal update photo')
	}
}

// crop banner
const uploadMerchantBanner = async (path) => {
	if (path !== '') {
    await $apiCore("/seller/command/merchant/banner", {
      method: 'POST',
			body: {
				url: path
			},
      onResponseError({ response }) {
        console.log(response)
      },
    })

    await nextTick(() => {
			fetchBanners()
    })
	} else {
    messageStore.setMessage('error', 'Gagal update banner')
	}
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
									@click="openPhotoDialog"
									>
									<VIcon
										icon="tabler-cloud-upload"
										class="d-sm-none"
										/>
									<span class="d-none d-sm-block">{{ photoAttr.title }}</span>
								</VBtn>
							</div>

							<p class="text-body-1 mb-0">
								{{ photoAttr.description }}
							</p>
						</div>
					</VCardText>

					<VCardText class="pt-2">
						<!-- 👉 Form -->
						<VForm
							ref="refForm"
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
														:rules="[requiredValidator]"
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
												:rules="[requiredValidator]"
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
									<VBtn
										:disabled="loading"
										:loading="loading"
										type="submit"
										>
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
										md="3"
									>
										<VCard :ripple="false">
											<VCardText class="d-flex flex-column position-relative pa-2">
												<VImg
													rounded
													:src="item.url"
													class="w-100 mx-auto"
												/>
											</VCardText>
											<VCardActions class="card-img-action">
												<VBtn
													size="small"
													variant="flat"
													color="secondary"
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
											<VCardText class="d-flex flex-column px-2 pt-4 pb-2">
												<div class="d-flex flex-column justify-center align-center border-dashed-primary border-radius-8">
													<IconBtn
														color="primary"
														variant="tonal"
														class="rounded-sm my-4"
														@click="openBannerDialog"
														>
														<VIcon icon="tabler-photo-up" />
													</IconBtn>
												</div>
											</VCardText>
											<VCardActions>
												<VBtn
													size="small"
													variant="flat"
													color="primary"
													block
													@click="openBannerDialog"
												>
													Tambah Banner
												</VBtn>
											</VCardActions>
										</VCard>
									</VCol>
							</VRow>
						</div>

						<!-- 👉 Empty banners -->
						<template v-else>
							<EmptyData
								description="Anda belum menambahkan banner toko untuk toko anda.<br/>Silahkan menambahkan banner toko untuk mempercantik tampilan toko anda"
								btn-text="Tambah Banner"
								wrapper-class="px-10 py-15"
								@click-button="openBannerDialog"
								/>
						</template>
					</VCardText>
				</VCard>
			</VCol>

		</VRow>
    <UploadCropStencilImageDialog
      v-model:is-dialog-visible="isUploadPhotoDialogVisible"
      v-model:title="photoAttr.title"
      v-model:description="photoAttr.description"
      v-model:params="photoAttr.params"
      @form-submitted="uploadMerchantPhoto"
    />
    <UploadCropStencilImageDialog
      v-model:is-dialog-visible="isUploadBannerDialogVisible"
      v-model:title="bannerAttr.title"
      v-model:description="bannerAttr.description"
      v-model:params="photoAttr.params"
      v-model:stencil-props="bannerAttr.stencil"
      @form-submitted="uploadMerchantBanner"
    />
	</div>
</template>
