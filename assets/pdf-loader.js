/**
 * Gramin Career Setu — Lazy jsPDF loader
 * ─────────────────────────────────────
 * jsPDF is 364 KB. Loading it up-front on every page cost rural users
 * a third of a megabyte before they could read anything — and the
 * landing page never generates a PDF at all.
 *
 * Usage:
 *   const { jsPDF } = await GCS_PDF.load();
 *
 * Resolves from the local copy first, then the CDN, so the offline
 * build still works. Caches the promise: concurrent callers share one fetch.
 */
(function () {
  'use strict';

  const LOCAL = 'assets/jspdf.umd.min.js';
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  let pending = null;

  function inject(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  function load() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf);
    if (pending) return pending;

    const prefix = location.pathname.includes('/admin/') ? '../' : '';
    pending = inject(prefix + LOCAL)
      .catch(() => inject(CDN))
      .then(() => {
        if (!window.jspdf || !window.jspdf.jsPDF) {
          throw new Error('jsPDF loaded but did not register');
        }
        return window.jspdf;
      })
      .catch(err => {
        pending = null; // allow a retry on the next click
        throw err;
      });

    return pending;
  }

  window.GCS_PDF = { load };
})();
