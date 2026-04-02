const CACHE_NAME = 'codegen-v1';

// જે ફાઈલોને ઓફલાઇન વાપરવા માટે સેવ કરવી છે તેની યાદી
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// ૧. Install Event: ફાઈલોને કેશમાં સેવ કરવી
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // નવા સર્વિસ વર્કરને તરત જ એક્ટિવ કરવા માટે
  self.skipWaiting();
});

// ૨. Activate Event: જૂની કેશ સાફ કરવી (Cleanup)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // કંટ્રોલ તરત જ મેળવવા માટે
  return self.clients.claim();
});

// ૩. Fetch Event: નેટવર્ક ન હોય ત્યારે કેશમાંથી ફાઈલ આપવી
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // જો નેટવર્ક પરથી રિસ્પોન્સ મળે, તો તેને રીટર્ન કરો
        return response;
      })
      .catch(() => {
        // જો નેટવર્ક ફેલ થાય (ઓફલાઇન હોય), તો કેશ ચેક કરો
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // જો કેશમાં પણ ન હોય, તો ખાલી Response મોકલો જેથી એરર ન આવે
          return new Response('Offline content not available', {
            status: 404,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});