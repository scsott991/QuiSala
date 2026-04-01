var CACHE_NAME = ‘sala-v3’;
var URLS_TO_CACHE = [
‘SALA_ANGELO.html’,
‘SALA_PINO.html’,
‘icon-192.png’,
‘icon-512.png’
];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(URLS_TO_CACHE);
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(names) {
return Promise.all(
names.filter(function(n) { return n !== CACHE_NAME; })
.map(function(n) { return caches.delete(n); })
);
})
);
self.clients.claim();
});

self.addEventListener(‘fetch’, function(e) {
// Network first for API calls
if (e.request.url.indexOf(‘supabase’) !== -1) {
e.respondWith(fetch(e.request));
return;
}
// Cache first for app files
e.respondWith(
caches.match(e.request).then(function(cached) {
return cached || fetch(e.request).then(function(response) {
return caches.open(CACHE_NAME).then(function(cache) {
cache.put(e.request, response.clone());
return response;
});
});
})
);
});