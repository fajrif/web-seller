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

export const createHash = async (text) => {
  const utf8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

export const checkNumber = (evt) => {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    evt.preventDefault();;
  } else {
    return true;
  }
}

export const translateErrorMessage = (requestType, response) => {
  var message = response.message;

  if(parseInt(response.status_code) === 401){
    message = "Gagal koneksi ICON Cash. token tidak valid"
  }

  switch(requestType) {
    case 'change-pin':
      if(parseInt(response.status_code) === 5003){
        message = "Maaf, akun anda telah terblokir. Silahkan hubungi Customer Support WhatsApp (0811-8942-589)"
      } else if(parseInt(response.status_code) === 5001){
        message = "PIN Lama tidak sesuai, silahkan coba lagi"
      } else if(parseInt(response.status_code) === 5002){
        message = "PIN Lama tidak sesuai, anda masih memiliki satu kesempatan"
      }
      break;
    case 'forgot-pin':
      message = "Reset PIN tidak berhasil. Silahkan hubungi Customer Support WhatsApp (0811-8942-589)"
      break;
  }
  return message;
}


