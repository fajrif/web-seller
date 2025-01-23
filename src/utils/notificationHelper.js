export const resolveIconType = title => {
	if (title === 'Transaksi selesai') {
    return {
			icon: 'tabler-cash-banknote',
      color: 'success',
    }
	} else {
    return {
			icon: 'tabler-wallet',
      color: 'primary',
    }
	}
}

export const formattedDate = str => {
	let formatted = ''
	let strDate = Date.parse(str);
	if(strDate !== null){
		formatted = useDateFormat(strDate, 'DD MMM YYYY HH:mm', { locales: 'id-ID' });
	}
	return formatted;
}
