export const publicLinks = [
  { label: 'Beranda', to: { name: 'home' } },
  { label: 'katalog', to: { name: 'home', hash: '#katalog' } },
  { label: 'portofolio bisnis', to: { name: 'home', hash: '#portofolio' } },
  { label: 'testimoni', to: { name: 'home', hash: '#testimoni' } },
  { label: 'FAQ', to: { name: 'home', hash: '#faq' } },
  { label: 'kontak', to: { name: 'home', hash: '#kontak' } },
]
export const adminLinks = [
  { label: 'Dashboard', id: 'dashboard' }, { label: 'Kelola Hero', id: 'hero' },
  { label: 'Kelola Product', id: 'produk' }, { label: 'Kelola Kategori', id: 'kategori' },
  { label: 'Kelola Packaging', id: 'packaging' }, { label: 'Kelola Portofolio', id: 'portofolio' },
  { label: 'Kelola FAQ', id: 'faq' }, { label: 'Kelola Testimoni', id: 'testimoni' },
  { label: 'Kelola Kontak', id: 'kontak' },
].map((l) => ({ ...l, to: { name: 'admin', hash: '#' + l.id } }))
