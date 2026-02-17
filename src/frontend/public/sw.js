const CACHE_VERSION = 'v1';
const CACHE_NAME = `pulse-player-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/generated/app-logo.dim_512x512.png',
  '/assets/generated/hero-bg-dark.dim_1440x900.png',
  '/assets/generated/hero-bg-light.dim_1440x900.png',
  '/assets/generated/empty-library.dim_1200x800.png',
  '/assets/generated/empty-video.dim_1200x800.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error('Failed to cache assets:', error);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pulse-player-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Skip caching for API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response before caching
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return a basic offline page if available
        return caches.match('/index.html');
      });
    })
  );
});
