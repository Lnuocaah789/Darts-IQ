const CACHE_NAME = 'darts-iq-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/darts-trainer-full.jsx',
  '/icon-192.png',
  '/icon-512.png',
  // External fonts and dependencies
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap',
  'https://esm.sh/react@18/umd/react.production.min.js',
  'https://esm.sh/react-dom@18/umd/react-dom.production.min.js',
];

// Install — cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can, don't fail if some requests don't work
      return Promise.allSettled(
        STATIC_FILES.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache first, fall back to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and Supabase API calls (always need network)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('supabase.co')) return;
  if (event.request.url.includes('anthropic.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Not in cache — fetch from network and cache it
      return fetch(event.request).then(response => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Offline and not cached — return the app shell
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
