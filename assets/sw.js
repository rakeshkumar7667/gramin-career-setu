/**
 * Gramin Career Setu — Service Worker
 * Offline caching for PWA support
 */

const CACHE_NAME = 'gcs-cache-v15';
const ASSETS_TO_CACHE = [
  // ── App shell ───────────────────────────────────────────────────────────
  // Only what a student needs on a first offline visit. Everything else —
  // careers, schemes, scholarships, stories, the admin pages and their
  // images — is cached by the fetch handler below the first time it is
  // opened, so it costs nothing until it is actually wanted.
  //
  // This list used to hold all 81 files, about 3.7 MB, fetched before the
  // student had read a single page. On a village 2G connection that is the
  // opposite of offline-friendly.
  './',
  './index.html',
  './404.html',

  // Styles and scripts every page loads
  './assets/fonts/text.css',
  './assets/tokens.css',
  './assets/style.css',
  './assets/saas.css',
  './assets/landing.css',
  './assets/ui.css',
  './assets/i18n-dict.js',
  './assets/i18n.js',
  './assets/api.js',
  './assets/app.js',
  './assets/actions.js',
  './assets/auth.js',
  './assets/landing.js',
  './assets/pdf-loader.js',

  // Content data
  './data/jobs-data.js',
  './data/roadmaps.js',
  './data/survey-data.js',
  './data/workshops.js',

  // Fonts: Latin and Telugu subsets only. The Cyrillic, Greek and
  // Vietnamese subsets can never match a character on this site, so they
  // were 81 KB of guaranteed waste.
  './assets/fonts/files/567244088c9c.woff2',
  './assets/fonts/files/8e11d0a3a21c.woff2',
  './assets/fonts/files/2f8d8ec7d7a4.woff2',
  './assets/fonts/files/plus-jakarta-sans-var.woff2',

  // The pages a student is most likely to want without a connection
  './jobs.html',
  './quiz.html',
  './quiz-results.html',
  './roadmap.html',
  './resume.html',
  './resume-preview.html',
  './apply-online.html',

  // Light illustrations used by those pages (SVGs are 2-5 KB each)
  './assets/hero-crossroads.webp',
  './assets/jobs-hero-student.webp',
  './assets/quiz-hero-student.webp',
  './assets/resume-hero-clipboard.webp',
  './assets/roadmap-hero-explorer.svg',
  './assets/resources-hero-folder.svg',
  './manifest.json'
];

// ── Install Event: Pre-cache static assets and external CDNs ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching core assets and CDNs...');
        // Cache each asset independently: one optional/missing file must not
        // make the entire offline install fail.
        return Promise.allSettled(ASSETS_TO_CACHE.map(asset => cache.add(asset)));
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[Service Worker] Caching failed during install:', err))
  );
});

// ── Activate Event: Clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch Event: Intercept network requests ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Google Sheets CSV bypass (Network-Only)
  // Let the script's own fetchSheetWithCache handle localStorage-based offline fallback.
  if (url.hostname === 'docs.google.com' || url.pathname.includes('spreadsheets')) {
    return; // Direct network request, do not intercept
  }

  // 2. Cache-First Strategy for all static assets and CDN libraries
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache
          return cachedResponse;
        }

        // Fallback to network
        return fetch(event.request)
          .then(networkResponse => {
            // Only cache valid standard responses (status 200 or 0 for CORS)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(err => {
            console.warn('[Service Worker] Fetch failed for:', event.request.url, err);
            // Offline fallback could be added here if needed
          });
      })
  );
});
