import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'

// 👉 Required Validator
export const requiredValidator = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Tidak boleh kosong'

  return !!String(value).trim().length || 'Tidak boleh kosong'
}

// 👉 Email Validator
export const emailValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'Format Email tidak valid'

  return re.test(String(value)) || 'Format Email tidak valid'
}

// 👉 Password Validator
export const passwordValidator = password => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  const validPassword = regExp.test(password)

  return validPassword || 'Min. 8 Karakter, terdapat 1 huruf capital, huruf kecil, angka dan spesial karakter'
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || 'Password Konfirmasi tidak sama'

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Angka dari ${min} sampai ${max}`
}

// 👉 Integer Validator
export const integerValidator = value => {
  if (isEmpty(value))
    return true
  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || 'Harus menggunakan angka (tanpa titik koma)'

  return /^-?\d+$/.test(String(value)) || 'Harus menggunakan angka (tanpa titik koma)'
}

// 👉 Integer Min Validator
export const minIntegerValidator = (value, min) => {
  if (isEmpty(value))
    return true

	return Number(value) >= Number(min) || `Nilai minimum ${min}`
}

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'Regex tidak valid'
}

// 👉 Alpha Validator
export const alphaValidator = value => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'Harus menggunakan alphabetic karakter'
}

// 👉 URL Validator
export const urlValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^https?:\/\/[^\s$.?#].\S*$/

  return re.test(String(value)) || 'URL tidak valid'
}

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `"Panjang karakter harus ${length} karakter"`
}

// 👉 Minimum Length Validator
export const minLengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

	return String(value).length >= length || `"Panjang karakter minimum ${length} karakter"`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return /^[a-zA-Z0-9 ]+$/.test(valueAsString) || 'Terdapat karakter tidak valid'
}

// 👉 Line-breaks Validator
export const lineBreaksValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return (valueAsString.match(/\n/g)||[]).length === 0 || 'Tidak boleh menggunakan line break'
}
