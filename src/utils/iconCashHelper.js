import bca from '@images/logos/banks/bca.png'
import mandiri from '@images/logos/banks/mandiri.png'
import bni from '@images/logos/banks/bni.png'
import bri from '@images/logos/banks/bri.png'
import mandiri_syariah from '@images/logos/banks/mandiri_syariah.png'
import btn from '@images/logos/banks/btn.png'
import bank_jateng from '@images/logos/banks/bank_jateng.png'
import bank_sumut from '@images/logos/banks/bank_sumut.png'

export const resolveBankLogo = (bankId) => {
  var logoUrl = ""

  switch(bankId) {
    case 1:
      logoUrl = bca;
      break;
    case 2:
      logoUrl = mandiri;
      break;
    case 3:
      logoUrl = bni;
      break;
    case 5:
      logoUrl = bri;
      break;
    case 6:
      logoUrl = mandiri_syariah;
      break;
    case 13:
      logoUrl = btn;
      break;
    case 30:
      logoUrl = bank_jateng;
      break;
    case 34:
      logoUrl = bank_sumut;
      break;
    default:
      logoUrl = ""
  }
  return logoUrl
}

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

export const createHash = async (text) => {
  const utf8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

