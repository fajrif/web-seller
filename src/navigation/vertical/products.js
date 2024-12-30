export default [
  {
    title: 'Produk',
    icon: { icon: 'tabler-package' },
    children: [
      { title: 'Tambah Produk', to: 'produk-tambah' },
      { title: 'Kelola Produk', to: { name: 'produk-tab', params: { tab: 'semua' } } },
    ],
  },
]
