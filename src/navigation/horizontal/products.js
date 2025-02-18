export default [
  {
    title: 'Produk',
    icon: { icon: 'tabler-package' },
    children: [
      { title: 'Tambah Produk', to: { name: 'produk-tambah-tab', params: { tab: 'tambah-produk' } } },
      { title: 'Kelola Produk', to: { name: 'produk-tab', params: { tab: 'semua' } } },
    ],
  },
]
