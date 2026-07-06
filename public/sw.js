const CACHE_NAME = 'viralseller-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install — cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — estratégia Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições POST, PUT, DELETE, PATCH
  if (event.request.method !== 'GET') return;

  // Ignorar chamadas de API e Supabase
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('kalocdn.com')
  ) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
