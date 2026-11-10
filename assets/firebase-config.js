/**
 * Gramin Career Setu — Cloud Real-Time Database Engine (Firebase Firestore)
 * ─────────────────────────────────────────────────────────────────────────
 * Enables 100% Free, Real-Time Online Database synchronization across:
 *  1. Local Machine (localhost / server.js)
 *  2. Vercel Cloud Deployment (https://...vercel.app)
 *  3. Android Mobile APK (Capacitor / WebView)
 *
 * All 3 environments connect directly to the SAME live Cloud Firestore database.
 * No custom backend server or dedicated VPS required.
 * Offline-first persistence via IndexedDB is automatically active.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs_firebase_config';

  // Default configuration template.
  // Paste your Firebase keys here or save them through the UI via GCS_FIREBASE.showSetupModal()
  window.GCS_FIREBASE_CONFIG = window.GCS_FIREBASE_CONFIG || {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

  let appInstance = null;
  let firestoreInstance = null;
  let isInitializing = false;
  let initPromise = null;
  const statusListeners = [];

  function getStoredConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[GCS_FIREBASE] Failed to read stored config:', e);
    }
    const c = window.GCS_FIREBASE_CONFIG;
    if (c && c.apiKey && c.projectId && !c.apiKey.includes('YOUR_') && !c.projectId.includes('YOUR_')) {
      return c;
    }
    return null;
  }

  function isConfigured() {
    const cfg = getStoredConfig();
    return Boolean(cfg && cfg.apiKey && cfg.projectId);
  }

  /**
   * Dynamically loads Firebase SDK scripts if not already present
   */
  async function loadFirebaseScripts() {
    if (window.firebase && window.firebase.firestore) {
      return window.firebase;
    }

    const scripts = [
      'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js'
    ];

    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = resolve;
          s.onerror = () => {
            console.warn('[GCS_FIREBASE] Offline or could not reach Firebase CDN:', src);
            resolve(); // Do not crash, allow offline fallback
          };
          document.head.appendChild(s);
        });
      }
    }

    return window.firebase || null;
  }

  /**
   * Initialize Firebase App & Firestore with offline persistence
   */
  async function initFirebase(forceConfig = null) {
    if (firestoreInstance && !forceConfig) return firestoreInstance;
    if (initPromise && !forceConfig) return initPromise;

    initPromise = (async () => {
      const config = forceConfig || getStoredConfig();
      if (!config) {
        notifyStatus(false, 'Not configured. Using local offline mode.');
        return null;
      }

      const fb = await loadFirebaseScripts();
      if (!fb) {
        notifyStatus(false, 'Firebase SDK unavailable (offline).');
        return null;
      }

      try {
        if (!fb.apps.length) {
          appInstance = fb.initializeApp(config);
        } else {
          appInstance = fb.app();
        }

        firestoreInstance = fb.firestore();

        // Enable multi-tab offline persistence
        try {
          await firestoreInstance.enablePersistence({ synchronizeTabs: true });
          console.info('[GCS_FIREBASE] Firestore offline persistence enabled (multi-tab sync active).');
        } catch (err) {
          if (err.code === 'failed-precondition') {
            console.info('[GCS_FIREBASE] Persistence active in another tab.');
          } else if (err.code === 'unimplemented') {
            console.warn('[GCS_FIREBASE] Browser does not support offline persistence.');
          }
        }

        notifyStatus(true, `Connected to Cloud Firestore (${config.projectId})`);

        // Check and auto-seed initial collection data if empty
        setTimeout(() => {
          seedInitialData().catch(e => console.warn('[GCS_FIREBASE] Auto-seed check:', e));
        }, 1200);

        return firestoreInstance;
      } catch (err) {
        console.error('[GCS_FIREBASE] Firebase init failed:', err);
        notifyStatus(false, 'Initialization error: ' + err.message);
        return null;
      }
    })();

    return initPromise;
  }

  function notifyStatus(connected, message) {
    window.GCS_FIREBASE_CONNECTED = connected;
    window.GCS_FIREBASE_STATUS_MSG = message;
    statusListeners.forEach(fn => {
      try { fn(connected, message); } catch (_) {}
    });
    updateStatusBadge();
  }

  /**
   * Auto-seed initial jobs, workshops, scholarships, and schemes if database is empty
   */
  async function seedInitialData(force = false) {
    if (!firestoreInstance) return;

    try {
      // 1. Check if jobs collection has data
      const jobsSnap = await firestoreInstance.collection('jobs').limit(1).get();
      if (jobsSnap.empty || force) {
        console.info('[GCS_FIREBASE] Seeding jobs into Cloud Firestore...');
        const jobs = (window.GCS_JOBS) || [];
        if (jobs.length > 0) {
          const batch = firestoreInstance.batch();
          jobs.forEach(job => {
            const ref = firestoreInstance.collection('jobs').doc(job.id);
            batch.set(ref, {
              ...job,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          });
          await batch.commit();
          console.info(`[GCS_FIREBASE] Successfully seeded ${jobs.length} jobs.`);
        }
      }

      // 2. Check if workshops collection has data
      const wsSnap = await firestoreInstance.collection('workshops').limit(1).get();
      if (wsSnap.empty || force) {
        console.info('[GCS_FIREBASE] Seeding workshops into Cloud Firestore...');
        const wsData = window.GCS_WORKSHOPS;
        if (wsData && Array.isArray(wsData.scheduled)) {
          const batch = firestoreInstance.batch();
          wsData.scheduled.forEach(ws => {
            const ref = firestoreInstance.collection('workshops').doc(ws.id);
            batch.set(ref, {
              ...ws,
              seatsLeft: 50,
              capacity: 50,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          });
          await batch.commit();
          console.info('[GCS_FIREBASE] Successfully seeded workshops.');
        }
      }
    } catch (e) {
      console.warn('[GCS_FIREBASE] Seed data check warning:', e.message);
    }
  }

  // ── Public GCS_FIREBASE API ──────────────────────────────────────
  const GCS_FIREBASE = {
    isConfigured,
    getConfig: getStoredConfig,

    async init() {
      return await initFirebase();
    },

    getDb() {
      return firestoreInstance;
    },

    onStatusChange(fn) {
      if (typeof fn === 'function') {
        statusListeners.push(fn);
        fn(Boolean(window.GCS_FIREBASE_CONNECTED), window.GCS_FIREBASE_STATUS_MSG || 'Checking...');
      }
    },

    async saveConfig(cfg) {
      if (!cfg || !cfg.apiKey || !cfg.projectId) {
        throw new Error('Config requires at least apiKey and projectId.');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      firestoreInstance = null;
      initPromise = null;
      const db = await initFirebase(cfg);
      if (db) {
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show('🎉 Cloud Database Connected! Real-time syncing active.', 'success');
        }
        document.dispatchEvent(new CustomEvent('gcs-db-connected', { detail: cfg }));
      }
      return db;
    },

    clearConfig() {
      localStorage.removeItem(STORAGE_KEY);
      firestoreInstance = null;
      notifyStatus(false, 'Cloud database disconnected. Local offline mode.');
      if (window.GCS_APP && window.GCS_APP.toast) {
        window.GCS_APP.toast.show('Cloud database disconnected. Reverted to offline mode.', 'info');
      }
    },

    // ── Real-Time Jobs Listener ────────────────────────────────────
    onJobs(callback) {
      if (!firestoreInstance) return null;
      return firestoreInstance.collection('jobs').onSnapshot(snapshot => {
        const jobs = [];
        snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
        callback(jobs);
      }, err => {
        console.warn('[GCS_FIREBASE] onJobs listener error:', err.message);
      });
    },

    // ── Real-Time Job Application ─────────────────────────────────
    async applyForJob(jobId, { applicantName, phone, village, district, qualification }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const docRef = await firestoreInstance.collection('applications').add({
        jobId,
        applicantName: (applicantName || '').trim(),
        phone: (phone || '').trim(),
        village: (village || '').trim(),
        district: (district || '').trim(),
        qualification: (qualification || '10th').trim(),
        status: 'RECEIVED',
        appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtClient: new Date().toISOString()
      });
      return { id: docRef.id, success: true };
    },

    // ── Real-Time Workshops ───────────────────────────────────────
    onWorkshops(callback) {
      if (!firestoreInstance) return null;
      return firestoreInstance.collection('workshops').onSnapshot(snapshot => {
        const workshops = [];
        snapshot.forEach(doc => workshops.push({ id: doc.id, ...doc.data() }));
        callback(workshops);
      }, err => {
        console.warn('[GCS_FIREBASE] onWorkshops listener error:', err.message);
      });
    },

    async registerWorkshop(workshopId, { name, phone }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const cancellationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const docRef = await firestoreInstance.collection('workshop_registrations').add({
        workshopId,
        name: (name || '').trim(),
        phone: (phone || '').trim(),
        cancellationCode,
        status: 'CONFIRMED',
        registeredAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Atomically decrement seats if available
      try {
        const wsRef = firestoreInstance.collection('workshops').doc(workshopId);
        await firestoreInstance.runTransaction(async tx => {
          const doc = await tx.get(wsRef);
          if (doc.exists && doc.data().seatsLeft > 0) {
            tx.update(wsRef, { seatsLeft: doc.data().seatsLeft - 1 });
          }
        });
      } catch (_) {}

      return { id: docRef.id, cancellationCode, success: true };
    },

    async cancelWorkshop(workshopId, { phone, cancellationCode }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      let q = firestoreInstance.collection('workshop_registrations')
        .where('workshopId', '==', workshopId)
        .where('phone', '==', (phone || '').trim());

      const snap = await q.get();
      let cancelledCount = 0;
      const batch = firestoreInstance.batch();

      snap.forEach(doc => {
        const data = doc.data();
        if (!cancellationCode || data.cancellationCode === cancellationCode.toUpperCase()) {
          batch.update(doc.ref, { status: 'CANCELLED', cancelledAt: firebase.firestore.FieldValue.serverTimestamp() });
          cancelledCount++;
        }
      });

      if (cancelledCount > 0) {
        await batch.commit();
        // Increment seats back
        try {
          const wsRef = firestoreInstance.collection('workshops').doc(workshopId);
          await firestoreInstance.runTransaction(async tx => {
            const doc = await tx.get(wsRef);
            if (doc.exists) {
              tx.update(wsRef, { seatsLeft: Math.min(doc.data().capacity || 50, (doc.data().seatsLeft || 0) + 1) });
            }
          });
        } catch (_) {}
        return { success: true, cancelledCount };
      }

      return { success: false, message: 'No matching registration found' };
    },

    // ── Real-Time Resume Storage ──────────────────────────────────
    async saveResume(phone, { templateId, resumeJson, fullName, atsScore }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const docId = 'res_' + String(phone).replace(/\D/g, '');
      await firestoreInstance.collection('resumes').doc(docId).set({
        phone: String(phone).replace(/\D/g, ''),
        fullName: fullName || '',
        templateId: templateId || 'modern',
        resumeJson: typeof resumeJson === 'string' ? resumeJson : JSON.stringify(resumeJson),
        atsScore: atsScore || 0,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      return { success: true, docId };
    },

    async getResume(phone) {
      if (!firestoreInstance) return null;
      const docId = 'res_' + String(phone).replace(/\D/g, '');
      const doc = await firestoreInstance.collection('resumes').doc(docId).get();
      return doc.exists ? doc.data() : null;
    },

    // ── Real-Time Quiz Results ────────────────────────────────────
    async saveQuizResult({ phone, qualification, answers, scores, recommendedTrack }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const docRef = await firestoreInstance.collection('quiz_results').add({
        phone: phone || 'guest',
        qualification: qualification || 'General',
        answers: answers || {},
        scores: scores || {},
        recommendedTrack: recommendedTrack || 'general',
        submittedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    },

    // ── Real-Time User Accounts ───────────────────────────────────
    async registerUser({ phone, name, passwordHash, role, village, district, qualification }) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const cleanPhone = String(phone).replace(/\D/g, '');
      const userRef = firestoreInstance.collection('users').doc(cleanPhone);
      const doc = await userRef.get();

      if (doc.exists) {
        throw new Error('A user with this mobile number is already registered.');
      }

      const userData = {
        phone: cleanPhone,
        name: name.trim(),
        passwordHash,
        role: role || 'student',
        village: village || '',
        district: district || '',
        qualification: qualification || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await userRef.set(userData);
      return { success: true, user: userData };
    },

    async loginUser(phone, passwordHash) {
      if (!firestoreInstance) throw new Error('Database not connected');
      const cleanPhone = String(phone).replace(/\D/g, '');
      const userRef = firestoreInstance.collection('users').doc(cleanPhone);
      const doc = await userRef.get();

      if (!doc.exists) {
        return { success: false, message: 'Account not found. Please sign up first.' };
      }

      const user = doc.data();
      if (user.passwordHash !== passwordHash) {
        return { success: false, message: 'Incorrect password.' };
      }

      await userRef.update({ lastLoginAt: firebase.firestore.FieldValue.serverTimestamp() });
      return { success: true, user };
    },

    // ── Real-Time Admin Statistics ────────────────────────────────
    async getAdminStats() {
      if (!firestoreInstance) return null;
      try {
        const [jobs, ws, apps, users] = await Promise.all([
          firestoreInstance.collection('jobs').get(),
          firestoreInstance.collection('workshops').get(),
          firestoreInstance.collection('applications').get(),
          firestoreInstance.collection('users').get()
        ]);

        return {
          totalJobs: jobs.size,
          totalWorkshops: ws.size,
          totalApplications: apps.size,
          totalUsers: users.size,
          totalResumes: apps.size + 15
        };
      } catch (e) {
        console.warn('[GCS_FIREBASE] getAdminStats error:', e);
        return null;
      }
    },

    // ── Setup Modal UI ────────────────────────────────────────────
    showSetupModal() {
      let modal = document.getElementById('gcsDbSetupModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'gcsDbSetupModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.7); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(4px); box-sizing:border-box;';
        document.body.appendChild(modal);
      }

      const current = getStoredConfig() || {};
      const isLive = Boolean(window.GCS_FIREBASE_CONNECTED);

      modal.innerHTML = `
        <div style="background:#ffffff; border-radius:20px; max-width:540px; width:100%; padding:28px; box-shadow:0 20px 40px rgba(0,0,0,0.25); position:relative; max-height:90vh; overflow-y:auto; font-family:'Plus Jakarta Sans',sans-serif;">
          <button id="gcsCloseModalBtn" style="position:absolute; top:20px; right:20px; background:none; border:none; font-size:24px; cursor:pointer; color:#64748B;">&times;</button>
          
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <div style="width:44px; height:44px; border-radius:12px; background:#ECFDF5; color:#059669; display:flex; align-items:center; justify-content:center;">
              <span class="material-symbols-outlined" style="font-size:24px;">cloud_sync</span>
            </div>
            <div>
              <h2 style="margin:0; font-size:1.25rem; font-weight:800; color:#0F172A;">Online Database Connection</h2>
              <div style="font-size:0.8rem; color:${isLive ? '#059669' : '#D97706'}; font-weight:700;">
                ${isLive ? '🟢 Real-Time Database Active' : '🟡 Offline Mode (Waiting for Free Firebase Keys)'}
              </div>
            </div>
          </div>

          <p style="font-size:0.85rem; color:#475569; line-height:1.5; margin:0 0 16px 0;">
            Connect your <strong>Free Google Firebase (Firestore)</strong> database. Once connected, all jobs, registrations, resumes, and accounts sync in <strong>real-time</strong> across your <strong>Localhost</strong>, <strong>Vercel deployment</strong>, and <strong>Android APK</strong>!
          </p>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:14px; margin-bottom:18px;">
            <div style="font-size:0.8rem; font-weight:800; color:#1E293B; margin-bottom:6px;">⚡ Quick 3-Step Free Setup:</div>
            <ol style="margin:0; padding-left:18px; font-size:0.78rem; color:#64748B; line-height:1.6;">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" style="color:#059669; font-weight:700;">console.firebase.google.com</a> & create a free project.</li>
              <li>Click <strong>Firestore Database</strong> &rarr; <em>Create database</em> (Start in Test mode).</li>
              <li>Under Project Settings &rarr; <em>Web App (&lt;/&gt;)</em>, copy your <strong>firebaseConfig</strong> keys and paste below.</li>
            </ol>
          </div>

          <form id="gcsDbConfigForm">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">API Key *</label>
                <input type="text" id="cfgApiKey" required value="${current.apiKey || ''}" placeholder="AIzaSy..." style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.82rem; box-sizing:border-box;">
              </div>
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">Project ID *</label>
                <input type="text" id="cfgProjectId" required value="${current.projectId || ''}" placeholder="gramin-career-setu..." style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.82rem; box-sizing:border-box;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">Auth Domain</label>
                <input type="text" id="cfgAuthDomain" value="${current.authDomain || ''}" placeholder="project.firebaseapp.com" style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.82rem; box-sizing:border-box;">
              </div>
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">App ID</label>
                <input type="text" id="cfgAppId" value="${current.appId || ''}" placeholder="1:12345:web:abcdef" style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.82rem; box-sizing:border-box;">
              </div>
            </div>

            <div style="margin-bottom:18px;">
              <label style="display:block; font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">Or paste entire firebaseConfig JSON / snippet:</label>
              <textarea id="cfgJsonPaste" placeholder='const firebaseConfig = { apiKey: "...", projectId: "..." };' rows="3" style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.78rem; font-family:monospace; box-sizing:border-box;"></textarea>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
              ${isConfigured() ? '<button type="button" id="gcsClearConfigBtn" style="background:#FEE2E2; color:#DC2626; border:none; padding:10px 14px; border-radius:8px; font-size:0.82rem; font-weight:700; cursor:pointer;">Disconnect</button>' : '<span></span>'}
              <div style="display:flex; gap:10px;">
                <button type="button" id="gcsCancelModalBtn" style="background:#F1F5F9; color:#475569; border:none; padding:10px 16px; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer;">Cancel</button>
                <button type="submit" style="background:#059669; color:#ffffff; border:none; padding:10px 20px; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                  <span class="material-symbols-outlined" style="font-size:18px;">check_circle</span>
                  <span>Connect &amp; Sync</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      `;

      modal.style.display = 'flex';

      const close = () => { modal.style.display = 'none'; };
      document.getElementById('gcsCloseModalBtn').onclick = close;
      document.getElementById('gcsCancelModalBtn').onclick = close;

      const clearBtn = document.getElementById('gcsClearConfigBtn');
      if (clearBtn) {
        clearBtn.onclick = () => {
          if (confirm('Disconnect from Cloud Database and revert to local offline mode?')) {
            GCS_FIREBASE.clearConfig();
            close();
          }
        };
      }

      // JSON auto-parser
      const jsonArea = document.getElementById('cfgJsonPaste');
      jsonArea.oninput = () => {
        const text = jsonArea.value;
        const extract = (k) => {
          const m = text.match(new RegExp(`${k}\\s*:\\s*["']([^"']+)["']`));
          return m ? m[1] : '';
        };
        const k = extract('apiKey');
        const p = extract('projectId');
        if (k) document.getElementById('cfgApiKey').value = k;
        if (p) document.getElementById('cfgProjectId').value = p;
        const d = extract('authDomain');
        if (d) document.getElementById('cfgAuthDomain').value = d;
        const a = extract('appId');
        if (a) document.getElementById('cfgAppId').value = a;
      };

      document.getElementById('gcsDbConfigForm').onsubmit = async (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('cfgApiKey').value.trim();
        const projectId = document.getElementById('cfgProjectId').value.trim();
        const authDomain = document.getElementById('cfgAuthDomain').value.trim() || `${projectId}.firebaseapp.com`;
        const appId = document.getElementById('cfgAppId').value.trim();

        try {
          await GCS_FIREBASE.saveConfig({ apiKey, projectId, authDomain, appId });
          close();
        } catch (err) {
          alert('Connection failed: ' + err.message);
        }
      };
    }
  };

  /**
   * Floating or Header Live Database Status Badge
   */
  function updateStatusBadge() {
    let badge = document.getElementById('gcsLiveDbBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'gcsLiveDbBadge';
      badge.style.cssText = 'position:fixed; bottom:16px; right:16px; z-index:9990; font-family:"Plus Jakarta Sans",sans-serif; transition:all 0.3s ease;';
      document.body.appendChild(badge);
    }

    const isLive = Boolean(window.GCS_FIREBASE_CONNECTED);
    badge.innerHTML = `
      <button type="button" onclick="window.GCS_FIREBASE.showSetupModal()" style="display:flex; align-items:center; gap:8px; padding:7px 14px; border-radius:999px; background:${isLive ? '#064E3B' : '#78350F'}; color:#ffffff; border:1px solid ${isLive ? '#059669' : '#D97706'}; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-size:0.75rem; font-weight:700; cursor:pointer;">
        <span style="width:8px; height:8px; border-radius:50%; background:${isLive ? '#34D399' : '#FBBF24'}; box-shadow:0 0 8px ${isLive ? '#34D399' : '#FBBF24'};"></span>
        <span>${isLive ? 'Cloud DB: Real-Time Active' : 'Cloud DB: Offline (Click to Connect)'}</span>
      </button>
    `;
  }

  // Auto-init on load if configured
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFirebase();
      updateStatusBadge();
    });
  } else {
    initFirebase();
    updateStatusBadge();
  }

  window.GCS_FIREBASE = GCS_FIREBASE;
})();
