self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  /** @type {Request} */
  const request = event.request;
  if (request.method === "GET" && request.url.includes("/api/generate")) {
    const originalUrl = request.url;
    const url = new URL(request.url);

    const formData = new FormData();
    formData.append("input", url.searchParams.get("input"));
    formData.append("prompt", url.searchParams.get("prompt"));
    formData.append("voice", url.searchParams.get("voice"));
    formData.append("vibe", url.searchParams.get("vibe"));

    url.search = "";

    event.respondWith(
      fetch(url.toString(), {
        method: "POST",
        body: formData,
      }).then((networkResponse) => {
        if (
          !networkResponse ||
          !networkResponse.ok ||
          request.headers.get("range") === "bytes=0-1"
        ) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();

        self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
          responseClone.blob().then((blob) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "ADD_TO_CACHE",
                url: originalUrl,
                blob: blob,
              });
            });
          });
        });

        return networkResponse;
      })
    );
  }
});
