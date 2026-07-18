// Service worker Maison Sylla — utilisé par l'appli client ET l'appli admin.
// Stratégie : les pages HTML et les données Firebase passent toujours par le
// réseau (catalogue et commandes toujours à jour). Seuls les fichiers
// statiques (CSS, JS, icônes) sont mis en cache pour un chargement rapide et
// un minimum de confort hors-ligne (affichage de l'appli même sans réseau).

const CACHE_NAME = 'maison-sylla-v3';

const STATIC_ASSETS = [
  'css/style.css',
  'js/products.js',
  'js/cart.js',
  'js/firebase-config.js',
  'icons/client-icon-192.png',
  'icons/client-icon-512.png',
  'icons/admin-icon-192.png',
  'icons/admin-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // On ignore les échecs individuels pour ne jamais bloquer l'installation
      Promise.allSettled(STATIC_ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne jamais intercepter Firebase / Firestore / requêtes non-GET : toujours réseau direct
  if (
    request.method !== 'GET' ||
    url.origin.includes('firebase') ||
    url.origin.includes('googleapis') ||
    url.origin.includes('gstatic')
  ) {
    return;
  }

  // Pages HTML : réseau d'abord, cache en secours (contenu toujours à jour si en ligne)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Fichiers statiques : cache d'abord, réseau en secours
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
