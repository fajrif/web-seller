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
