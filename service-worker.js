const CACHE_NAME = "vocapp-cache-v1";
const FILES_TO_CACHE = [
  "/simpleVocApp/",
  "/simpleVocApp/index.html",
  "/simpleVocApp/style.css",
  "/simpleVocApp/script.js",
  "/simpleVocApp/assets/js/dicsHelper.js",
  "/simpleVocApp/manifest.json",
  "/simpleVocApp/icon-192.png",
  "/simpleVocApp/icon-512.png",
  "/simpleVocApp/favicon.png"
];


// Instalación: cachear archivos
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // activa inmediatamente después de instalar
  );
});

// Activación: limpiar caches viejos y tomar control
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // toma control inmediatamente
  );
});

// Fetch: responde con cache si existe, si no, hace fetch normal
self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Retorna cache si existe
          return response;
        }
        // Si no está en cache, hace fetch y opcionalmente lo cachea para la próxima
        return fetch(event.request)
          .then(fetchResponse => {
            // Opcional: cachear la nueva respuesta
            return caches.open(CACHE_NAME).then(cache => {
              // Clona la respuesta para no interferir con el stream
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
          .catch(() => {
            // Opcional: respuesta fallback offline si falla fetch (ej. imagen placeholder)
            // return caches.match('/offline.html');
          });
      })
  );
});
