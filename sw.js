const CACHE_NAME = 'score-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
  self.clients.claim();
  e.waitUntil(caches.keys().then(keys => 
    Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
  ));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
      return res;
    })).catch(() => caches.match('/index.html'))
  );
});
