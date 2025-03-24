import bca from '@images/logos/banks/bca.png'
import mandiri from '@images/logos/banks/mandiri.png'
import bni from '@images/logos/banks/bni.png'

export const sampleBanks = [
  {
    id: 380,
    bank: {
      name: 'Bank BCA',
      logoUrl: bca,
    },
    account_name: 'floyd miles',
    account_number: '127 000 2323',
  }, {
    id: 381,
    bank: {
      name: 'Bank Mandiri',
      logoUrl: mandiri,
    },
    account_name: 'floyd miles',
    account_number: '127 2323 2323',
  }, {
    id: 382,
    bank: {
      name: 'Bank BNI',
      logoUrl: bni,
    },
    account_name: 'floyd miles',
    account_number: '127 111 7777',
  },
]

export const resolveBalanceStatus = {
  SUCCESS: 'success',
  REJECTED: 'error',
  PENDING: 'secondary',
}

export const resolveBalanceType = (type) => {
	if (type === 'TOPUP' || type === 'REMITTANCE') {
    return {
			icon: 'tabler-cash-banknote',
      text: 'Transaksi Masuk',
    }
  } else if (type === 'WITHDRAWAL') {
    return {
			icon: 'tabler-wallet',
      text: 'Penarikan Dana',
    }
	} else {
    return {
			icon: 'tabler-device-unknown',
      text: type,
    }
	}
}

export const resolveTransactionAmount = (type, amount) => {
	if (type === 'TOPUP' || type === 'REMITTANCE') {
    return {
			color: 'text-success',
      text: `+ ${toCurrency(amount)}`,
    }
  } else if (type === 'WITHDRAWAL') {
    return {
			color: 'text-error',
      text: `- ${toCurrency(amount)}`,
    }
	} else {
    return {
			color: 'text-base',
      text: toCurrency(amount),
    }
	}
}

export const toTitleCase = str => {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
