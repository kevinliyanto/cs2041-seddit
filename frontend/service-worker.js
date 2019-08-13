self.addEventListener('install', function (event) {
    console.log("Installing service worker");
    event.waitUntil(
        caches.open('v1').then(function (cache) {
            return cache.addAll([
                '/src/',
                '/src/main.js',
                '/styles/post.css',
                '/styles/provided.css'
            ]);
        })
        .catch((e) => {
            console.log(e);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating service worker');
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== "GET") return;
    event.respondWith(
        caches.open('mysite-dynamic').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});