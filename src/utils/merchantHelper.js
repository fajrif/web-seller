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
