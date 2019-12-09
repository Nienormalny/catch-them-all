var staticAssets = [
    './',
    './style.css',
    './assets/js/main.min.js',
    './assets/js/main.js',
    './assets/js/vendor/jquery.min.js',
    './assets/images/faces/avatar-1.png'
];

self.addEventListener('install', async function (event) {
    console.log(`install`);
    var cache = await caches.open('game-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', function (event) {
    console.log(`fetch`);
    var request = event.request;
    var url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(req) {
    var cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    var cache = await caches.open('game-dynamic');

    try {
        var res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}