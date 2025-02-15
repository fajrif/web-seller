import { isEmpty, isEmptyArray, isNullOrUndefined } from '@core/utils/helpers'

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

export const headersFileUpload = [
  {
    key: 'status',
		sortable: false,
  },
  {
    title: 'Gambar',
    key: 'image_url',
		sortable: false,
  },
  {
    title: 'Nama Produk',
    key: 'nama_produk',
		sortable: false,
  },
  {
    title: 'Kategori ID',
    key: 'id_kategori',
		sortable: false,
  },
  {
    title: 'Etalase ID',
    key: 'kode_etalase',
		sortable: false,
  },
  {
    title: 'Kondisi',
    key: 'kondisi',
		sortable: false,
  },
  {
    title: 'Harga',
    key: 'harga',
		sortable: false,
  },
  {
    title: 'Harga Coret',
    key: 'harga_coret',
		sortable: false,
  },
  {
    title: 'Berat',
    key: 'berat',
		sortable: false,
  },
  {
    title: 'Panjang',
    key: 'panjang',
		sortable: false,
  },
  {
    title: 'Lebar',
    key: 'lebar',
		sortable: false,
  },
  {
    title: 'Tinggi',
    key: 'tinggi',
		sortable: false,
  },
  {
    title: 'Min. Pembelian',
    key: 'minimum_pembelian',
		sortable: false,
  },
  {
    title: 'Stok',
    key: 'stok',
		sortable: false,
  },
  {
    title: 'Deskripsi Produk',
    key: 'deskripsi',
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
    id: 3,
    name: "Non-Aktif",
  },
  {
    id: 0,
    name: "Diverifikasi",
  },
  {
    id: 5,
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
  if (statusId === 3)
    return {
      text: 'Non-Aktif',
      color: 'secondary',
    }
  if (statusId === 0)
    return {
      text: 'Diverifikasi',
      color: 'info',
    }
  if (statusId === 5)
    return {
      text: 'Ditolak',
      color: 'error',
    }
}

export const sortOptions = [
  {
    title: 'Urutkan',
    value: '',
  },
  {
    title: 'Paling Laris',
    value: 'sold',
  },
  {
    title: 'Paling Baru',
    value: 'newest',
  },
  {
    title: 'Rating',
    value: 'rating',
  },
  {
    title: 'Harga Terendah',
    value: 'lower_price',
  },
  {
    title: 'Harga Tertingi',
    value: 'higher_price',
  },
]

export const toCurrency = price => {
	if(isEmpty(price))
		return ''

  var formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  return formatter.format(parseInt(price))
}

export const calculateDiscount = (price, strikePrice) => {
  if (strikePrice !== null && strikePrice > 0) {
    var discount = ((strikePrice  - price) / strikePrice) *100

    return discount.toFixed(0) + "%"
  } else {
    return 0
  }
}

export const sanitizeNullChilds = (array) => {
	var result = array.filter((obj) => {
		if(obj.child) {
			return sanitizeNullChilds(obj.child);
		} else {
			return delete obj.child;
		}
	});
	return result;
}

export const normalizerCategories = (node) => {
	return {
		id: node.id,
		label: node.value,
		children: node.child,
	}
}

export const truncateText = (txt, length=100) => {
	if(isEmpty(txt))
		return txt
	if(txt.length <= length)
		return txt

	return txt.substring(0,length) + '...'
}
