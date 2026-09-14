const CACHE_NAME = 'lori-go-demo-v2'
const baseUrl = self.registration.scope
const CORE = ['', 'manifest.webmanifest', 'app-icon.svg', 'assets/family-cafe.png', 'assets/mountain-kitchen.png']
  .map((path) => new URL(path, baseUrl).toString())

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
      return response
    }).catch(() => event.request.mode === 'navigate' ? caches.match(baseUrl) : undefined)),
  )
})
