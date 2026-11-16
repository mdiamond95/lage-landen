// Service worker for Lage Landen, generated at build time by vite.config.ts, which
// fills in the version and the list of files. On install it saves the whole app,
// pictures included, so every lesson works offline; an update downloads only the
// files that changed. Pages load from the network when there is one (to pick up new
// versions) and from the saved copy when not; everything else comes from the saved
// copy first.
const VERSION = '__VERSION__'
const FILES = __FILES__
const CACHE = `lage-landen-${VERSION}`

// Built files carry a hash of their contents in their name (garden-delights-DgJdszj2.jpg),
// so a file of that name never changes. A new version copies those it shares with the
// version already saved, and downloads only what is new: an update to the lessons does
// not fetch every picture again.
const HASHED = /^\.\/assets\/.+-[\w-]{8}\.\w+$/

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      const missing = []
      for (const file of FILES) {
        const url = new URL(file, self.location.href).href
        const saved = HASHED.test(file) ? await caches.match(url) : undefined
        if (saved) await cache.put(url, saved)
        else missing.push(file)
      }
      await cache.addAll(missing)
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('lage-landen-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('./', copy))
          return response
        })
        .catch(() => caches.match('./', { ignoreSearch: true })),
    )
    return
  }
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (hit) =>
        hit ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
