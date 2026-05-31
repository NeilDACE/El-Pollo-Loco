const SW_VERSION = "v1";
const APP_CACHE = `el-pollo-loco-app-${SW_VERSION}`;
const RUNTIME_CACHE = `el-pollo-loco-runtime-${SW_VERSION}`;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./templates/templates.js",
  "./js/game.js",
  "./js/levels/level1.js",
  "./pages/legal-notice.html",
  "./styles/legal-notice.css",
  "./styles/fonts.css",
  "./favicon/site.webmanifest",
];

/**
 * Cache the core app shell files during service worker installation.
 * @returns {Promise<void>} Resolves when all core assets are stored.
 */
async function precacheCoreAssets() {
  const cache = await caches.open(APP_CACHE);
  await cache.addAll(CORE_ASSETS);
}

/**
 * Delete cache entries from older service worker versions.
 * @returns {Promise<void>} Resolves when outdated caches are removed.
 */
async function deleteOldCaches() {
  const expected = new Set([APP_CACHE, RUNTIME_CACHE]);
  const keys = await caches.keys();
  await Promise.all(
    keys.filter((key) => !expected.has(key)).map((key) => caches.delete(key)),
  );
}

/**
 * Check whether a request is cache-eligible by HTTP method.
 * @param {Request} request - Incoming fetch request.
 * @returns {boolean} True when the request uses GET.
 */
function isGetRequest(request) {
  return request.method === "GET";
}

/**
 * Restrict caching to requests from the same origin.
 * @param {Request} request - Incoming fetch request.
 * @returns {boolean} True when the request origin matches this app.
 */
function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

/**
 * Detect browser page navigations for HTML fallback handling.
 * @param {Request} request - Incoming fetch request.
 * @returns {boolean} True when the request is a navigation.
 */
function isNavigationRequest(request) {
  return request.mode === "navigate";
}

/**
 * Validate whether a response can be stored safely in cache.
 * @param {Response} response - Network response to validate.
 * @returns {boolean} True for successful same-origin responses.
 */
function isCacheableResponse(response) {
  return Boolean(response) && response.ok && response.type === "basic";
}

/**
 * Serve pages with a network-first strategy and cached HTML fallback.
 * @param {Request} request - Navigation request.
 * @returns {Promise<Response>} A fresh response or cached fallback page.
 */
async function networkFirstForPages(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const fresh = await fetch(request);
    if (isCacheableResponse(fresh)) {
      await cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    return (await cache.match(request)) || (await cache.match("./index.html"));
  }
}

/**
 * Serve static assets from cache and refresh them in the background.
 * @param {Request} request - Static file request.
 * @returns {Promise<Response|undefined>} Cached response or network result.
 */
async function staleWhileRevalidateForAssets(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);
  return cached || networkPromise;
}

/**
 * Handle the install lifecycle and precache app shell files.
 * @param {ExtendableEvent} event - Install event from the browser.
 */
function onInstall(event) {
  event.waitUntil(precacheCoreAssets());
  self.skipWaiting();
}

/**
 * Handle activation and remove old cache versions.
 * @param {ExtendableEvent} event - Activate event from the browser.
 */
function onActivate(event) {
  event.waitUntil(deleteOldCaches());
  self.clients.claim();
}

/**
 * Route fetch requests through navigation and asset cache strategies.
 * @param {FetchEvent} event - Fetch event containing the request.
 */
function onFetch(event) {
  const { request } = event;
  if (!isGetRequest(request)) return;
  if (!isSameOrigin(request)) return;
  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstForPages(request));
    return;
  }
  event.respondWith(staleWhileRevalidateForAssets(request));
}

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);
