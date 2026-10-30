// Penyimpanan lokal IndexedDB (jauh lebih besar dari localStorage, aman untuk banyak foto).
let dbp
const open = () => dbp || (dbp = new Promise((res, rej) => {
  if (typeof indexedDB === 'undefined') return rej(new Error('no idb'))
  const r = indexedDB.open('citra-productions', 1)
  r.onupgradeneeded = () => r.result.createObjectStore('kv')
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
}))
export async function kvGet(key) {
  const db = await open()
  return new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(key); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
}
export async function kvSet(key, value) {
  const db = await open()
  return new Promise((res, rej) => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(value, key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}
