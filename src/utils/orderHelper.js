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
    id: '01',
    name: "Pesanan Baru",
  },
  {
    id: '02',
    name: "Siap Dikirim",
  },
  {
    id: '03',
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
      color: 'error',
    }
  } else if (statusId === '02') {
    return {
      text: 'Siap dikirim',
      color: 'warning',
    }
  } else if (statusId === '03') {
    return {
      text: 'Dalam Pengiriman',
      color: 'info',
    }
  } else if (statusId === '88') {
    return {
      text: 'Berhasil',
      color: 'success',
    }
  } else if (statusId === '09') {
    return {
      text: 'Dibatalkan',
      color: 'secondary',
    }
  } else {
    return {
      text: statusId,
      color: 'error',
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

export const timeOptionsJemput = [
  { value: '08:00', label: '08:00 - 12:00' },
  { value: '12:00', label: '12:00 - 16:00' },
]

export const toLocaleDateTime = (date,format='DD MMM YYYY HH:mm') => {
	if(isEmpty(date))
		return ''

	var _date = new Date(date)

	return useDateFormat(_date, format)
}

export const getRespondTime = date => {
	if(isEmpty(date))
		return ''

	var _date = new Date(date)
	_date.setDate(_date.getDate() + 3);

	return useDateFormat(_date, 'DD MMM YYYY HH:mm')
}
