/**
 * Gramin Career Setu — Bilingual Translation Engine (Telugu ↔ English)
 * ────────────────────────────────────────────────────────────────────
 * Dictionary data lives in assets/i18n-dict.js and MUST load first.
 *
 * Markup contract
 * ───────────────
 *   data-lang-key="key"          → replaces the element's text
 *   data-lang-placeholder="key"  → replaces an input's placeholder
 *   data-lang-attr='{"aria-label":"key","title":"key2"}'
 *                                → replaces arbitrary attributes
 *   <meta name="gcs-title-key" content="key">
 *                                → translates document.title
 *   <meta name="gcs-desc-key" content="key">
 *                                → translates the meta description
 *
 * Language modes: 'te' | 'en' | 'both'
 *   'both' renders Telugu underneath English for mixed-literacy readers.
 *
 * Dynamic content: after injecting markup, call
 *   GCS_I18N.apply()   — re-sweeps the DOM in the current language
 * or listen for the 'gcs-language-changed' event.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs-lang';
  const DEFAULT_LANG = 'te';
  const VALID = ['te', 'en', 'both'];

  const dictionary = window.GCS_DICTIONARY || {};

  // Warn once per missing key so typos surface during development
  // instead of silently rendering the English fallback forever.
  const warned = new Set();
  const isLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function lookup(key, lang) {
    const entry = dictionary[key];
    if (!entry) {
      if (isLocalhost && !warned.has(key)) {
        warned.add(key);
        console.warn('[i18n] missing dictionary key:', key);
      }
      return null;
    }
    // 'both' falls back to the English record; the Telugu line is added
    // separately by applyBothMode() so it can be styled independently.
    const l = lang === 'both' ? 'en' : lang;
    return entry[l] !== undefined ? entry[l] : null;
  }

  function getCurrentLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (VALID.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  /**
   * Replace an element's text without destroying child elements
   * (icons, badges). Prefers an inner [data-lang-text] node; refuses
   * to clobber an element that has element children.
   */
  function setText(el, value) {
    const inner = el.querySelector('[data-lang-text]');
    if (inner) {
      inner.textContent = value;
      return;
    }
    if (el.children.length) {
      if (isLocalhost) {
        console.warn(
          '[i18n] element has child elements; add data-lang-text to the text node:',
          el.getAttribute('data-lang-key'), el
        );
      }
      return;
    }
    el.textContent = value;
  }

  /**
   * Telugu companion line used by 'both' mode.
   *
   * Only block-level body copy inside <main> is echoed. Echoing nav links,
   * the logo or breadcrumbs injects block elements into inline layout
   * contexts and destroys the header, so chrome is deliberately excluded —
   * the switcher itself already shows both languages there.
   */
  const ECHOABLE = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'FIGCAPTION'];

  function canEcho(el) {
    if (ECHOABLE.indexOf(el.tagName) === -1) return false;
    if (el.children.length) return false;
    if (el.closest('nav, header, footer, .gcs-header, .gcs-footer, .gcs-breadcrumb')) return false;
    return !!el.closest('main, .gcs-main, [role="main"]');
  }

  function applyBothMode(root, on) {
    // Always clear stale echoes first so switching modes can't leave orphans.
    root.querySelectorAll('[data-lang-echo]').forEach(e => e.remove());
    if (!on) return;

    root.querySelectorAll('[data-lang-key]').forEach(el => {
      if (!canEcho(el)) return;
      const te = lookup(el.getAttribute('data-lang-key'), 'te');
      if (te === null) return;
      // Skip when the English and Telugu strings are identical
      // (acronyms like ITI/BPO) — a duplicated line reads as a bug.
      if (te === el.textContent.trim()) return;

      const echo = document.createElement('div');
      echo.setAttribute('data-lang-echo', '');
      echo.className = 'gcs-lang-echo';
      echo.lang = 'te';
      echo.textContent = te;
      el.insertAdjacentElement('afterend', echo);
    });
  }

  function apply(lang, root) {
    lang = VALID.indexOf(lang) !== -1 ? lang : getCurrentLanguage();
    root = root || document;

    // 1. Text nodes
    root.querySelectorAll('[data-lang-key]').forEach(el => {
      const v = lookup(el.getAttribute('data-lang-key'), lang);
      if (v !== null) setText(el, v);
    });

    // 2. Placeholders
    root.querySelectorAll('[data-lang-placeholder]').forEach(el => {
      const v = lookup(el.getAttribute('data-lang-placeholder'), lang);
      if (v !== null) el.placeholder = v;
    });

    // 3. Arbitrary attributes (aria-label, title, alt, …)
    root.querySelectorAll('[data-lang-attr]').forEach(el => {
      let map;
      try {
        map = JSON.parse(el.getAttribute('data-lang-attr'));
      } catch (e) {
        if (isLocalhost) console.warn('[i18n] bad data-lang-attr JSON on', el);
        return;
      }
      for (const attr in map) {
        const v = lookup(map[attr], lang);
        if (v !== null) el.setAttribute(attr, v);
      }
    });

    // 4. Telugu companion lines for 'both' mode
    applyBothMode(root, lang === 'both');
  }

  function applyDocumentMeta(lang) {
    const titleMeta = document.querySelector('meta[name="gcs-title-key"]');
    if (titleMeta) {
      const v = lookup(titleMeta.getAttribute('content'), lang);
      if (v !== null) document.title = v;
    }
    const descMeta = document.querySelector('meta[name="gcs-desc-key"]');
    const descTag = document.querySelector('meta[name="description"]');
    if (descMeta && descTag) {
      const v = lookup(descMeta.getAttribute('content'), lang);
      if (v !== null) descTag.setAttribute('content', v);
    }
  }

  /**
   * Sync every language switcher on the page.
   * Matches on [data-lang-switch] and falls back to the legacy
   * onclick="switchGcsLanguage('xx')" markup so older pages stay correct.
   */
  function syncSwitchers(lang) {
    const buttons = document.querySelectorAll(
      '[data-lang-switch], .gcs-lang-pill, .pill-te, .pill-en'
    );
    buttons.forEach(btn => {
      let target = btn.getAttribute('data-lang-switch');
      if (!target) {
        const oc = btn.getAttribute('onclick') || '';
        const m = /switchGcsLanguage\(\s*['"](\w+)['"]\s*\)/.exec(oc);
        if (m) target = m[1];
        else if (btn.classList.contains('pill-te') || btn.id === 'gcsPillTe') target = 'te';
        else if (btn.classList.contains('pill-en') || btn.id === 'gcsPillEn') target = 'en';
      }
      if (!target) return;

      const isActive = target === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
      // Clear the inline colours some pages hardcoded, so the CSS
      // .active rule is the single source of truth for pill styling.
      btn.style.removeProperty('background');
      btn.style.removeProperty('color');
      btn.style.removeProperty('font-weight');
    });
  }

  function setLanguage(lang) {
    if (VALID.indexOf(lang) === -1) lang = DEFAULT_LANG;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    const root = document.documentElement;
    root.lang = lang === 'both' ? 'en' : lang;
    root.setAttribute('data-lang', lang);

    apply(lang);
    applyDocumentMeta(lang);
    syncSwitchers(lang);

    window.dispatchEvent(new CustomEvent('gcs-language-changed', { detail: { lang } }));
  }

  // ── Text-to-speech ──────────────────────────────────────────────
  // getVoices() is empty on first call in Chrome, so cache on the
  // voiceschanged event. Never read Telugu text with an English voice —
  // it produces gibberish, which is worse than staying silent.

  let voiceCache = [];
  function loadVoices() {
    if ('speechSynthesis' in window) voiceCache = window.speechSynthesis.getVoices() || [];
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  function findVoice(lang) {
    if (lang === 'te') {
      return voiceCache.find(v => v.lang && v.lang.toLowerCase().startsWith('te')) ||
             voiceCache.find(v => (v.name || '').toLowerCase().includes('telugu')) || null;
    }
    return voiceCache.find(v => v.lang === 'en-IN') ||
           voiceCache.find(v => (v.name || '').toLowerCase().includes('india')) ||
           voiceCache.find(v => v.lang && v.lang.startsWith('en')) || null;
  }

  function isSpeechAvailable(lang) {
    if (!('speechSynthesis' in window)) return false;
    const l = lang || getCurrentLanguage();
    return findVoice(l === 'both' ? 'te' : l) !== null;
  }

  function speakText(text, explicitLang) {
    if (!('speechSynthesis' in window) || !text) return false;
    let lang = explicitLang || getCurrentLanguage();
    if (lang === 'both') lang = 'te';

    const voice = findVoice(lang);
    if (lang === 'te' && !voice) {
      window.dispatchEvent(new CustomEvent('gcs-speech-unavailable', { detail: { lang } }));
      return false;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'te' ? 'te-IN' : 'en-IN';
    u.rate = lang === 'te' ? 0.9 : 1.0;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
    return true;
  }

  /**
   * Disable Listen buttons when the device has no voice for the
   * current language, rather than letting them fail silently.
   */
  function syncSpeechButtons() {
    const ok = isSpeechAvailable();
    document.querySelectorAll('[data-speak], .gcs-speak-search-btn').forEach(btn => {
      btn.disabled = !ok;
      btn.setAttribute('aria-disabled', String(!ok));
      btn.title = ok ? '' : 'Voice narration is not available for this language on your device.';
      btn.style.opacity = ok ? '' : '0.5';
      btn.style.cursor = ok ? '' : 'not-allowed';
    });
  }

  // ── Public API ──────────────────────────────────────────────────
  const API = {
    setLanguage,
    getCurrentLanguage,
    apply: (root) => apply(getCurrentLanguage(), root),
    t: (key) => {
      const v = lookup(key, getCurrentLanguage());
      return v === null ? key : v;
    },
    speakText,
    isSpeechAvailable,
    syncSpeechButtons,
    dictionary
  };

  window.GCS_I18N = API;
  window.switchGcsLanguage = setLanguage;

  // Backwards-compatible alias used by older pages
  window.I18n = {
    init: () => Promise.resolve(),
    toggle: () => setLanguage(getCurrentLanguage() === 'te' ? 'en' : 'te'),
    applyLanguage: setLanguage,
    getSavedLang: getCurrentLanguage,
    getCurrentLang: getCurrentLanguage,
    t: API.t
  };

  function boot() {
    setLanguage(getCurrentLanguage());
    syncSpeechButtons();
    // Re-sync once voices arrive asynchronously
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        loadVoices();
        syncSpeechButtons();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
