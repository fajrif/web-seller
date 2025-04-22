export const resolveIconType = title => {
	if (title === 'Transaksi selesai') {
    return {
			icon: 'tabler-cash-banknote',
      color: 'success',
    }
	} else {
    return {
			icon: 'tabler-package-export',
      color: 'primary',
    }
	}
}

export const resolveNotifOrderId = urlPath => {
  var _id = null
  if(!isEmpty(urlPath)){
    _id = urlPath.substr(urlPath.lastIndexOf('/')+1)
  }
  return _id
}

export const formattedDate = str => {
	let formatted = ''
	let strDate = Date.parse(str);
	if(strDate !== null){
		formatted = useDateFormat(strDate, 'DD MMM YYYY HH:mm', { locales: 'id-ID' });
	}
	return formatted;
}
