import { useUserDataStore } from '@core/stores/config'

export const timeOptions = [
  { id: 1, text: "06:00 AM", value: "06:00:00" },
  { id: 2, text: "07:00 AM", value: "07:00:00" },
  { id: 3, text: "08:00 AM", value: "08:00:00" },
  { id: 4, text: "09:00 AM", value: "09:00:00" },
  { id: 5, text: "10:00 AM", value: "10:00:00" },
  { id: 6, text: "11:00 AM", value: "11:00:00" },
  { id: 7, text: "12:00 PM", value: "12:00:00" },
  { id: 8, text: "13:00 PM", value: "13:00:00" },
  { id: 9, text: "14:00 PM", value: "14:00:00" },
  { id: 10, text: "15:00 PM", value: "15:00:00" },
  { id: 11, text: "16:00 PM", value: "16:00:00" },
  { id: 12, text: "17:00 PM", value: "17:00:00" },
  { id: 13, text: "18:00 PM", value: "18:00:00" },
  { id: 14, text: "19:00 PM", value: "19:00:00" },
  { id: 15, text: "20:00 PM", value: "20:00:00" },
  { id: 16, text: "21:00 PM", value: "21:00:00" },
  { id: 17, text: "22:00 PM", value: "22:00:00" },
  { id: 18, text: "23:00 PM", value: "23:00:00" },
  { id: 19, text: "00:00 AM", value: "00:00:00" },
  { id: 20, text: "01:00 AM", value: "01:00:00" },
  { id: 21, text: "02:00 AM", value: "02:00:00" },
  { id: 22, text: "03:00 AM", value: "03:00:00" },
  { id: 23, text: "04:00 AM", value: "04:00:00" },
  { id: 24, text: "05:00 AM", value: "05:00:00" },
]

export const titleize = str => {
  return str.replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
}

export const getOperationalAttrs = operationals => {
	var openTime = ""
	var closedTime = ""
	var operational = []

  if(Array.isArray(operationals)) {
		operational = operationals.map(item => {
			return {
				day_id: item.master_data_id,
				timezone: "Asia/Bangkok",
			}
		})

    let firstData = operationals[0]
    if(firstData){
      openTime = firstData.open_time.slice(0, -3)
      closedTime = firstData.closed_time.slice(0, -3)
    }
  }

	return {
    open_time: openTime,
    closed_time: closedTime,
    operational: operational,
	}
}

export const getInfoAttrs = merchant => {
	return {
    name: merchant.name,
    slogan: merchant.slogan,
    description: merchant.description,
		is_npwp_required: merchant.is_npwp_required,
		photo_url: merchant.photo_url,
	}
}

export const updateUserDataStore = async (callback) => {
  try {
		const userDataStore = useUserDataStore()
    // GET Data Merchant
    const resCore = await $apiCore('/seller/query/merchant/profile-toko', {
      method: 'GET',
      onResponseError({ response }) {
        console.log("Unable to get seller data")
      },
    })

    const merchant = resCore.data.merchant

    userDataStore.setUserData(merchant)

    await nextTick(() => {
			callback()
    })

  } catch (err) {
		useCookie('accessToken').value = null
		// remove user-data storage here
		userDataStore.clear()
    console.error(err)
  }
}
