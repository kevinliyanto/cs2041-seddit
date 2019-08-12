self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function (cache) {
            // console.log("install");
            // return cache.addAll([
            //     '/styles/post.css',
            //     '/styles/provided.css'
            // ]);
            return cache;
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            return resp || fetch(event.request).then((response) => {
                return caches.open('v1').then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});