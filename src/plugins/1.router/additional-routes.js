// 👉 Redirects
export const redirects = [
  {
    path: '/',
    name: 'index',
    redirect: () => ({ name: 'dashboards-analytics' }),
  },
  {
    path: '/merchant/info',
    name: 'merchant-info',
    redirect: () => ({ name: 'merchant-tab', params: { tab: 'info-toko' } }),
  },
  {
    path: '/produk/semua',
    name: 'produk-semua',
    redirect: () => ({ name: 'produk-tab', params: { tab: 'semua' } }),
  },
  {
    path: '/produk/tambah',
    name: 'produk-tambah',
    redirect: () => ({ name: 'produk-tambah-tab', params: { tab: 'tambah-produk' } }),
  },
  {
    path: '/pesanan/semua',
    name: 'pesanan-semua',
    redirect: () => ({ name: 'pesanan-tab', params: { tab: 'semua' } }),
  },
]
