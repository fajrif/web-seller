export const orderHeaders = [
  {
    id: 1,
    title: '',
    key: 'data-table-expand',
    sortable: false,
  },
  {
    id: 2,
    title: 'Invoice',
    key: 'invoice_no',
    sortable: false,
  },
  {
    id: 3,
    title: 'Tanggal Order',
    key: 'order_date',
    sortable: false,
  },
  {
    id: 4,
    title: 'Nama Pelanggan',
    key: 'nama_pelanggan',
    sortable: false,
  },
  {
    id: 5,
    title: 'Respond Date',
    key: 'respond_date',
		align: 'end',
    sortable: false,
  },
]

export const statusOrder = [
  {
    id: '01,02,03,08,09,88',
    name: "Semua",
  },
  {
    id: '01',
    name: "Pesanan Baru",
  },
  {
    id: '02',
    name: "Siap Dikirim",
  },
  {
    id: '03,08',
    name: "Dalam Pengiriman",
  },
  {
    id: '88',
    name: "Berhasil",
  },
  {
    id: '09',
    name: "Dibatalkan",
  },
]

export const resolveStatusOrder = statusId => {
  if (statusId === '01') {
    return {
      text: 'Pesanan Baru',
      color: 'warning',
    }
  } else if (statusId === '02') {
    return {
      text: 'Siap dikirim',
      color: 'warning',
    }
  } else if (statusId === '03' || statusId === '08') {
    return {
      text: 'Dalam Pengiriman',
      color: 'warning',
    }
  } else if (statusId === '88') {
    return {
      text: 'Berhasil',
      color: 'success',
    }
  } else if (statusId === '09') {
    return {
      text: 'Dibatalkan',
      color: 'error',
    }
  } else {
    return {
      text: statusId,
      color: 'secondary',
    }
  }
}

export const resolveStateShipment = status => {
  var state = 0;
  switch (status) {
    case "1":
      state = 1
      break;
    case "2":
      state = 2
      break;
    case "3":
      state = 2
      break;
    case "4":
      state = 3
      break;
    case "5":
      state = 4
      break;
    case "6":
      state = 2
      break;
  }
  return state;
}

export const resolveCustomShipment = statusCode => {
  if (statusCode === '02') {
    return {
      title: 'Siap dikirim',
      description: 'Pesanan dikonfirmasi seller',
      state: 1,
    }
  } else if (statusCode === '03') {
    return {
      title: 'Dalam Pengiriman',
      description: 'Paket dalam pengiriman oleh seller',
      state: 3,
    }
  } else if (statusCode === '08') {
    return {
      title: 'Telah Sampai',
      description: 'Paket Telah sampai, mohon konfirmasi pesanan anda',
      state: 4,
    }
  } else if (statusCode === '88') {
    return {
      title: 'Selesai',
      description: 'Pesanan Telah dikonfirmasi Pembeli',
      state: 4,
    }
  } else {
    return {
      title: 'Dalam Pengiriman',
      description: 'Paket dalam pengiriman oleh Seller',
      state: 2,
    }
  }
}

export const resolveCompleteAddress = (delivery, isHtml=true) => {
  var _completeAddress = ''
	if(isEmpty(delivery))
    return _completeAddress

  if(isHtml) {
    _completeAddress = delivery.address + ' <br/>' +
                       delivery.district?.name + ' ' +
                       delivery.subdistrict?.name + ' <br/>' +
                       delivery.city?.name + ' ' +
                       delivery.province?.name + ' <br/>' +
                       delivery.postal_code
  } else {
    _completeAddress = delivery.address + ' ' +
                       delivery.district?.name + ' ' +
                       delivery.subdistrict?.name + ' ' +
                       delivery.city?.name + ' ' +
                       delivery.province?.name + ' ' +
                       delivery.postal_code
  }
  return _completeAddress
}

export const orderIsShipped = statusId => {
  return (statusId === '03' || statusId === '08')
}

export const isDateToday = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}

export const isMoreThanHour = (val) => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= val) {
    return true
  } else {
    return false
  }
}

export const timeOptionsJemput = [
  { value: '08:00', label: '08:00 - 12:00', limit: 12 },
  { value: '12:00', label: '12:00 - 16:00', limit: 16 },
]

export const resolveShippingTypeText = type => {
  if(type === 'custom') {
    return 'Pengiriman oleh Seller'
  } else {
    return type
  }
}

export const toLocaleDateTime = (date,format='DD MMM YYYY HH:mm') => {
	if(isEmpty(date))
		return ''

  if(date.indexOf('T') === 10 && date.lastIndexOf('Z') === 19) {
    date = date.replace('T',' ')
    date = date.replace('Z','')
  }

	var _date = new Date(date)

	return useDateFormat(_date, format, { locales: 'id-ID' })
}

export const getRespondTime = (date, num=3) => {
	if(isEmpty(date))
		return ''

	var _date = new Date(date)
	_date.setDate(_date.getDate() + num);

	return useDateFormat(_date, 'DD MMM YYYY')
}
