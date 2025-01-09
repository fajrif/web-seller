export const productHeaders = [
  {
    id: 1,
    title: 'Produk',
    key: 'image',
    sortable: false,
  },
  {
    id: 2,
    title: 'Nama',
    key: 'name',
    sortable: false,
  },
  {
    id: 3,
    title: 'Harga',
    key: 'price',
    sortable: false,
  },
  {
    id: 4,
    title: 'Stock',
    key: 'stock',
    sortable: false,
  },
  {
    id: 5,
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    id: 6,
    title: '',
    key: 'actions',
    sortable: false,
  },
]

export const statusProduct = [
  {
    id: 9,
    name: "Arsip",
  },
  {
    id: 1,
    name: "Dijual",
  },
  {
    id: 2,
    name: "Non-Aktif",
  },
  {
    id: 3,
    name: "Ditolak",
  },
]

export const conditionProduct = [
  {
    id: 1,
    name: "Baru",
  },
  {
    id: 0,
    name: "Bekas",
  },
]

export const resolveStatus = statusId => {
  if (statusId === 9)
    return {
      text: 'Arsip',
      color: 'warning',
    }
  if (statusId === 1)
    return {
      text: 'Dijual',
      color: 'success',
    }
  if (statusId === 2)
    return {
      text: 'Non-Aktif',
      color: 'secondary',
    }
  if (statusId === 3)
    return {
      text: 'Ditolak',
      color: 'error',
    }
}

export const toCurrency = price => {
  let _price = price
  if (typeof value !== "number") {
    _price
  }
  var formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
  
  return formatter.format(parseInt(price))
}
