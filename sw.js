const CACHE_NAME = 'mi-tienda-cache-v2'; // Versión de caché actualizada
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    'https://raw.githubusercontent.com/JohnBeta1977/tm/refs/heads/main/logo_01.png'
];

// Evento de Instalación: Guarda los archivos principales en el caché.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Activación: Limpia cachés antiguos.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento Fetch: Sirve archivos desde el caché primero (estrategia Cache-First).
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en el caché, la retornamos. Si no, la buscamos en la red.
                return response || fetch(event.request).then(fetchResponse => {
                    // Si la respuesta de la red es válida, la guardamos en el caché para futuras visitas.
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
    );
});