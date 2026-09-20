// Recovery worker: retire the previous cache-first service worker, clear its
// caches and reload open clients from the network. The demo no longer needs
// offline caching, and network-first loading avoids stale hashed bundles.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('lori-go-demo-')).map((key) => caches.delete(key)))
    await self.clients.claim()
    await self.registration.unregister()
    const windows = await self.clients.matchAll({ type: 'window' })
    await Promise.all(windows.map((client) => client.navigate(client.url)))
  })())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') event.respondWith(fetch(event.request, { cache: 'no-store' }))
})
