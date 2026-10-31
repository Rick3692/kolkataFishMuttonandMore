/* ============================================================
   KOLKATA FISH, MUTTON & MORE — service worker
   Caches the app shell so it opens instantly and still works
   (browsing/cart/prices) with no or poor internet. Placing a new
   WhatsApp order still needs a live connection, same as any
   WhatsApp chat.
   ============================================================ */

const CACHE_NAME = "kfm-cache-v3";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./fish.html",
  "./meat.html",
  "./grocery.html",
  "./vegetables.html",
  "./sweets.html",
  "./pooja.html",
  "./achar.html",
  "./cart.html",
  "./login.html",
  "./about.html",
  "./contact.html",
  "./privacy-policy.html",
  "./css/style.css",
  "./data/catalog.js",
  "./js/store.js",
  "./js/i18n.js",
  "./js/whatsapp.js",
  "./js/main.js",
  "./js/admin.js",
  "./js/billing.js",
  "./css/billing.css",
  "./billing.html",
  "./admin.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Same-origin files (pages, scripts, styles, prices): network-first so edits and
   catalog updates always show up when online, cache fallback when offline.
   Cross-origin (fonts, libraries): cache-first. */
self.addEventListener("fetch", (event)=>{
  const req = event.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  // Only handle our own files and the static font/library CDNs. Anything else
  // (e.g. the GitHub API used by Admin → Publish) must go straight to the network.
  const staticCdn = ["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"].includes(url.hostname);
  if(!sameOrigin && !staticCdn) return;

  if(sameOrigin){
    event.respondWith(
      fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(()=> caches.match(req).then(cached => cached || (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(()=> cached))
    );
  }
});
