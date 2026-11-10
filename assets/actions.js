/**
 * Gramin Career Setu — Real User Actions
 * ──────────────────────────────────────
 * Replaces the alert() placeholders with behaviour that actually persists,
 * so the dashboard counters reflect what the user really did.
 *
 * Every writer here goes through GCS_APP.storage, which prefixes keys with
 * 'gcs_' — the same namespace dashboard.html reads.
 *
 * Requires: assets/app.js (Storage, Toast), assets/i18n.js (translation).
 */
(function () {
  'use strict';

  function storage() {
    return (window.GCS_APP && window.GCS_APP.storage) || null;
  }

  function toast(msg, type) {
    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(msg, type || 'success');
    } else {
      console.log('[GCS]', msg);
    }
  }

  function t(key, fallback) {
    if (window.GCS_I18N) {
      const v = window.GCS_I18N.t(key);
      if (v !== key) return v;
    }
    return fallback;
  }

  // ── Workshop registration ───────────────────────────────────────
  const WORKSHOP_KEY = 'workshop_registrations';

  // Entries may be plain id strings (quick register) or richer objects
  // written by the workshops form in landing.js ({name, phone, workshop, id}).
  // Both shapes share this key, so always compare through the id.
  function entryId(e) {
    return (e && typeof e === 'object') ? e.id : e;
  }

  function indexOfRegistration(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (entryId(list[i]) === id) return i;
    }
    return -1;
  }

  function isRegistered(id) {
    const s = storage();
    return s ? indexOfRegistration(s.get(WORKSHOP_KEY, []), id) !== -1 : false;
  }

  function toggleWorkshop(id, title, btn) {
    const s = storage();
    if (!s) return false;

    const list = s.get(WORKSHOP_KEY, []);
    const i = indexOfRegistration(list, id);
    const registering = i === -1;

    // The registration is always kept locally. It is only sent to the backend
    // when we have the student's real name and phone from their session — the
    // previous version substituted 'Registered Scholar' / '9876543210' when
    // nobody was signed in, which wrote invented rows into the registrations
    // table and made the real count unusable as workshop evidence.
    const user = (window.GCS_AUTH && window.GCS_AUTH.getUser) ? window.GCS_AUTH.getUser() : null;
    const name = user && (user.name || user.fullName);
    const phone = user && user.phone;
    const canSync = Boolean(name && phone && window.GCS_API && window.GCS_API.workshops);

    if (registering) {
      list.push({ id, workshop: title || id, registeredAt: new Date().toISOString() });
      if (canSync) {
        window.GCS_API.workshops.register(id, { name, phone })
          .catch(e => console.warn('[GCS_ACTIONS] workshop api:', e));
      }
    } else {
      list.splice(i, 1);
      if (canSync && window.GCS_API.workshops.cancel) {
        window.GCS_API.workshops.cancel(id, { phone })
          .catch(e => console.warn('[GCS_ACTIONS] workshop cancel api:', e));
      }
    }
    s.set(WORKSHOP_KEY, list);

    syncWorkshopButton(btn, registering);
    toast(
      registering
        ? '✅ ' + t('workshop-registered', 'Registered for') + ' ' + (title || 'this workshop')
        : 'ℹ️ ' + t('workshop-cancelled', 'Registration cancelled for') + ' ' + (title || 'this workshop')
    );
    document.dispatchEvent(new CustomEvent('gcs-registrations-changed'));
    return registering;
  }

  function syncWorkshopButton(btn, registered) {
    if (!btn) return;
    const label = btn.querySelector('[data-action-label]') || btn;
    label.textContent = registered
      ? t('btn-registered', 'Registered ✓')
      : t('btn-register-now', 'Register Now');
    btn.setAttribute('aria-pressed', String(registered));
    btn.classList.toggle('is-registered', registered);
  }

  // ── Alert subscriptions (job alerts, newsletters) ───────────────
  const SUB_KEY = 'subscriptions';

  function toggleSubscription(topic, btn) {
    const s = storage();
    if (!s) return false;

    const list = s.get(SUB_KEY, []);
    const i = list.indexOf(topic);
    const subscribing = i === -1;

    if (subscribing) list.push(topic);
    else list.splice(i, 1);
    s.set(SUB_KEY, list);

    if (btn) {
      const label = btn.querySelector('[data-action-label]') || btn;
      label.textContent = subscribing
        ? t('btn-subscribed', 'Subscribed ✓')
        : t('btn-subscribe', 'Subscribe');
      btn.setAttribute('aria-pressed', String(subscribing));
    }
    toast(
      subscribing
        ? '🔔 ' + t('sub-on', 'You will be notified about new opportunities.')
        : 'ℹ️ ' + t('sub-off', 'Notifications turned off.')
    );
    return subscribing;
  }

  // ── Features that genuinely do not exist yet ────────────────────
  // Saying so plainly is better than a fake success message: a student
  // who is told a video is "playing" will wait for something that is
  // never going to appear.
  function notAvailable(what) {
    toast(
      '🚧 ' + (what || t('feature-soon', 'This feature')) + ' — ' +
      t('feature-soon-desc', 'coming soon. Ask your village volunteer for help in the meantime.'),
      'info'
    );
  }

  // ── Share ───────────────────────────────────────────────────────
  async function share(title, url) {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: title || document.title, url: shareUrl });
        return true;
      } catch (e) {
        if (e && e.name === 'AbortError') return false; // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast('🔗 ' + t('link-copied', 'Link copied to clipboard.'));
      return true;
    } catch (e) {
      toast('⚠️ ' + t('link-copy-failed', 'Could not copy the link.'), 'error');
      return false;
    }
  }

  // ── Restore persisted state on load ─────────────────────────────
  function init() {
    document.querySelectorAll('[data-workshop-id]').forEach(btn => {
      const id = btn.getAttribute('data-workshop-id');
      syncWorkshopButton(btn, isRegistered(id));
      btn.addEventListener('click', e => {
        e.preventDefault();
        toggleWorkshop(id, btn.getAttribute('data-workshop-title'), btn);
      });
    });

    const s = storage();
    const subs = s ? s.get(SUB_KEY, []) : [];
    document.querySelectorAll('[data-subscribe-topic]').forEach(btn => {
      const topic = btn.getAttribute('data-subscribe-topic');
      if (subs.indexOf(topic) !== -1) {
        const label = btn.querySelector('[data-action-label]') || btn;
        label.textContent = t('btn-subscribed', 'Subscribed ✓');
        btn.setAttribute('aria-pressed', 'true');
      }
      btn.addEventListener('click', e => {
        e.preventDefault();
        toggleSubscription(topic, btn);
      });
    });
  }

  window.GCS_ACTIONS = {
    toggleWorkshop,
    isRegistered,
    toggleSubscription,
    notAvailable,
    share,
    registrationCount: () => (storage() ? storage().get(WORKSHOP_KEY, []).length : 0)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Accessible info dialog — replaces alert() for real content.
 * alert() blocks the page, cannot be styled, is unreadable on small
 * screens, and cannot render Telugu alongside a heading. This keeps the
 * content but presents it properly.
 */
(function () {
  'use strict';

  function buildDialog() {
    let dlg = document.getElementById('gcsInfoDialog');
    if (dlg) return dlg;

    dlg = document.createElement('dialog');
    dlg.id = 'gcsInfoDialog';
    dlg.className = 'gcs-info-dialog';
    dlg.innerHTML =
      '<h3 id="gcsInfoDialogTitle"></h3>' +
      '<ol id="gcsInfoDialogList"></ol>' +
      '<button type="button" id="gcsInfoDialogClose" class="gcs-btn-cta-1">Close</button>';
    document.body.appendChild(dlg);
    dlg.querySelector('#gcsInfoDialogClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    return dlg;
  }

  /**
   * @param {string} title  heading text
   * @param {string[]} steps  list items (already in the reader's language)
   */
  window.GCS_ACTIONS.showSteps = function (title, steps) {
    const dlg = buildDialog();
    dlg.querySelector('#gcsInfoDialogTitle').textContent = title;
    const list = dlg.querySelector('#gcsInfoDialogList');
    list.innerHTML = '';
    steps.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      list.appendChild(li);
    });
    const close = dlg.querySelector('#gcsInfoDialogClose');
    close.textContent = window.GCS_I18N ? window.GCS_I18N.t('btn-close') : 'Close';
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    close.focus();
  };
})();
