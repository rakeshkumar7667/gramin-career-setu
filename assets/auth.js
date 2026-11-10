/**
 * Gramin Career Setu — Role-Based Authentication & Validation Engine (auth.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * • Roles: Student ('student'), Volunteer ('volunteer'), Admin ('admin')
 * • Client-side Validation: 10-digit Indian mobile, password strength meter, matching
 * • SHA-256 password hashing via Web Crypto API (crypto.subtle)
 * • 6-Digit random OTP generator with 5-minute expiry & max 5 attempts
 * • Persistent Session in localStorage ('gcs_auth_user') with shape validation
 * • Automatic Header Sync across all pages with full XSS escaping
 * • Route Guard protection for dashboard.html and admin/index.html
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs_auth_user';
  const PENDING_SIGNUP_KEY = 'gcs_pending_signup';
  const REGISTERED_USERS_KEY = 'gcs_registered_users';

  // Demo password 'demo123' SHA-256 hash:
  const DEMO_PASSWORD_HASH = 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791';

  // Demo User Accounts (Pre-configured for evaluation & testing)
  const DEMO_USERS = {
    student: {
      id: 'usr_student_01',
      name: 'Ravi Kumar',
      phone: '9876543210',
      passwordHash: DEMO_PASSWORD_HASH,
      email: 'ravi.kumar@gmail.com',
      village: 'Gudur, Tirupati District',
      role: 'student',
      roleLabel: 'Student / Job Seeker',
      avatar: 'assets/resume-avatar-ravi.webp',
      initials: 'RK',
      joinedDate: 'May 2024',
      isDemoSession: true,
      token: null
    },
    volunteer: {
      id: 'usr_vol_02',
      name: 'Suresh Babu',
      phone: '9440123456',
      passwordHash: DEMO_PASSWORD_HASH,
      email: 'suresh.babu@csp.org',
      village: 'Penumaka, Guntur District',
      role: 'volunteer',
      roleLabel: 'Village Coordinator',
      avatar: 'assets/profile-suresh.webp',
      initials: 'SB',
      joinedDate: 'Jan 2024',
      isDemoSession: true,
      token: null
    },
    admin: {
      id: 'usr_admin_03',
      name: 'Dr. K. S. Rao',
      phone: '9848012345',
      passwordHash: DEMO_PASSWORD_HASH,
      email: 'admin@gramincareersetu.org',
      village: 'District Collectorate Office',
      role: 'admin',
      roleLabel: 'District Admin',
      avatar: 'assets/profile-ramesh.webp',
      initials: 'KR',
      joinedDate: 'Nov 2023',
      isDemoSession: true,
      token: null
    }
  };

  // Managed OIDC / OAuth2 PKCE Configuration
  const OIDC_CONFIG = {
    issuer: (window.GCS_OIDC_CONFIG && window.GCS_OIDC_CONFIG.issuer) ||
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
              ? 'http://localhost:8081/realms/gramin-career-setu'
              : 'https://auth.gramincareersetu.org/realms/gramin-career-setu'),
    clientId: (window.GCS_OIDC_CONFIG && window.GCS_OIDC_CONFIG.clientId) || 'gramin-career-setu-web',
    redirectUri: (window.GCS_OIDC_CONFIG && window.GCS_OIDC_CONFIG.redirectUri) || (window.location.origin + '/login.html'),
    scope: 'openid profile email'
  };

  /**
   * Strict redirect sanitizer preventing Open Redirect and DOM XSS vulnerabilities
   */
  function getSafeNextUrl(rawUrl, defaultUrl) {
    if (!rawUrl) return defaultUrl || 'dashboard.html';
    try {
      const decoded = decodeURIComponent(rawUrl).trim();
      if (decoded.startsWith('/') && !decoded.startsWith('//') && !decoded.includes('://') && !decoded.includes('\\')) {
        return decoded;
      }
      if (/^[a-zA-Z0-9_\-\/]+\.html(\?[a-zA-Z0-9_=&%.-]*)?$/.test(decoded) && !decoded.includes('://') && !decoded.startsWith('//')) {
        return decoded;
      }
    } catch (_) {}
    return defaultUrl || 'dashboard.html';
  }

  function base64UrlEncode(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function generateRandomString(length = 43) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    return result;
  }

  async function generateCodeChallenge(verifier) {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return base64UrlEncode(digest);
    }
    return verifier;
  }

  /**
   * Initiate OIDC PKCE Authorization Code Login
   */
  async function loginWithOidc() {
    try {
      const state = generateRandomString(32);
      const verifier = generateRandomString(64);
      const challenge = await generateCodeChallenge(verifier);

      sessionStorage.setItem('gcs_oidc_state', state);
      sessionStorage.setItem('gcs_oidc_verifier', verifier);

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      if (next) {
        sessionStorage.setItem('gcs_oidc_next', next);
      }

      const authUrl = `${OIDC_CONFIG.issuer}/protocol/openid-connect/auth?` +
        `client_id=${encodeURIComponent(OIDC_CONFIG.clientId)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(OIDC_CONFIG.scope)}&` +
        `redirect_uri=${encodeURIComponent(OIDC_CONFIG.redirectUri)}&` +
        `state=${encodeURIComponent(state)}&` +
        `code_challenge=${encodeURIComponent(challenge)}&` +
        `code_challenge_method=S256`;

      window.location.href = authUrl;
    } catch (e) {
      console.error('[GCS Auth] Failed to initiate OIDC flow:', e);
      if (window.GCS_APP && window.GCS_APP.toast) {
        window.GCS_APP.toast.show('⚠️ Unable to connect to SSO Identity Provider. Using offline demo.');
      }
    }
  }

  /**
   * Handle OIDC Authorization Code Callback
   */
  async function handleOidcCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code) return false;

    const savedState = sessionStorage.getItem('gcs_oidc_state');
    const verifier = sessionStorage.getItem('gcs_oidc_verifier');
    const next = sessionStorage.getItem('gcs_oidc_next');

    if (state && savedState && state !== savedState) {
      console.warn('[GCS Auth] OIDC state mismatch');
      return false;
    }

    try {
      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('client_id', OIDC_CONFIG.clientId);
      body.set('code', code);
      body.set('redirect_uri', OIDC_CONFIG.redirectUri);
      if (verifier) body.set('code_verifier', verifier);

      const tokenRes = await fetch(`${OIDC_CONFIG.issuer}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      if (!tokenRes.ok) {
        throw new Error(`Token exchange failed: ${tokenRes.status}`);
      }

      const tokens = await tokenRes.json();
      const parts = (tokens.access_token || '').split('.');
      let claims = {};
      if (parts.length === 3) {
        try {
          claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        } catch (_) {}
      }

      const realmRoles = (claims.realm_access && claims.realm_access.roles) || [];
      let mappedRole = 'student';
      let roleLabel = 'Student / Job Seeker';
      if (realmRoles.includes('ROLE_ADMIN') || realmRoles.includes('admin')) {
        mappedRole = 'admin';
        roleLabel = 'District Admin';
      } else if (realmRoles.includes('ROLE_VOLUNTEER') || realmRoles.includes('volunteer')) {
        mappedRole = 'volunteer';
        roleLabel = 'Village Coordinator';
      }

      const user = {
        id: claims.sub || ('usr_' + Date.now()),
        name: claims.name || claims.preferred_username || 'SSO User',
        email: claims.email || '',
        phone: claims.phone_number || '',
        role: mappedRole,
        roleLabel,
        isDemoSession: false,
        token: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: Date.now() + (tokens.expires_in || 300) * 1000,
        joinedDate: 'Verified SSO'
      };

      setCurrentUser(user);

      sessionStorage.removeItem('gcs_oidc_state');
      sessionStorage.removeItem('gcs_oidc_verifier');
      sessionStorage.removeItem('gcs_oidc_next');

      window.history.replaceState({}, document.title, window.location.pathname);

      if (window.GCS_APP && window.GCS_APP.toast) {
        window.GCS_APP.toast.show(`👋 Welcome, ${user.name}! Authenticated via OIDC.`);
      }

      setTimeout(() => {
        const defaultTarget = (mappedRole === 'admin' || mappedRole === 'volunteer') ? 'admin/index.html' : 'dashboard.html';
        window.location.href = getSafeNextUrl(next, defaultTarget);
      }, 300);

      return true;
    } catch (err) {
      console.warn('[GCS Auth] OIDC callback exchange failed:', err);
      return false;
    }
  }

  /**
   * Refresh OIDC Access Token using Refresh Token
   */
  async function refreshToken() {
    const user = getCurrentUser();
    if (!user || !user.refreshToken || user.isDemoSession) return null;

    try {
      const body = new URLSearchParams();
      body.set('grant_type', 'refresh_token');
      body.set('client_id', OIDC_CONFIG.clientId);
      body.set('refresh_token', user.refreshToken);

      const res = await fetch(`${OIDC_CONFIG.issuer}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      if (res.ok) {
        const tokens = await res.json();
        user.token = tokens.access_token;
        if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
        user.tokenExpiresAt = Date.now() + (tokens.expires_in || 300) * 1000;
        setCurrentUser(user);
        return user.token;
      }
    } catch (e) {
      console.warn('[GCS Auth] Token refresh failed:', e);
    }
    return null;
  }

  /**
   * Helper: Hash string using Web Crypto SHA-256
   */
  async function hashPassword(plainText) {
    if (!plainText) return '';
    try {
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('[GCS Auth] Web Crypto unavailable, falling back to simple hash', e);
    }
    // Fallback simple 32-bit FNV-1a hex representation if subtle is unavailable in insecure context
    let h = 0x811c9dc5;
    for (let i = 0; i < plainText.length; i++) {
      h ^= plainText.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16);
  }

  /**
   * Helper: Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Get currently logged-in user with strict validation
   */
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Validate expected shape to prevent malformed session crashes
      if (!parsed || typeof parsed !== 'object' || !parsed.name || !parsed.role) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      // Check session expiry to invalidate stale tokens
      if (parsed.tokenExpiresAt && Date.now() > parsed.tokenExpiresAt) {
        console.info('[GCS Auth] User session token has expired. Invalidation active.');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch (e) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      return null;
    }
  }

  /**
   * Set logged-in user and notify listeners
   */
  function setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('gcs-auth-changed', { detail: { user } }));
    syncHeaderAuthUI();
  }

  /**
   * Route Guard: Protect views based on roles
   */
  function requireAuth(allowedRoles) {
    const u = getCurrentUser();
    const isSubdir = window.location.pathname.includes('/admin/');
    const pfx = isSubdir ? '../' : '';

    if (!u) {
      const nextPath = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(pfx + 'login.html?next=' + nextPath);
      return false;
    }

    if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(u.role)) {
      window.location.replace(pfx + 'dashboard.html');
      return false;
    }

    return true;
  }

  /**
   * Validate 10-digit Indian Mobile number
   */
  function validateMobileNumber(mobile) {
    const clean = String(mobile || '').replace(/\D/g, '');
    const isValid = /^[6-9]\d{9}$/.test(clean);
    return {
      valid: isValid,
      clean,
      message: isValid ? '' : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
    };
  }

  /**
   * Calculate Password Strength Score (0 to 100)
   */
  function calculatePasswordStrength(pass) {
    if (!pass) return { score: 0, label: 'Empty', color: '#CBD5E1', percent: 0 };

    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    let label = 'Weak';
    let color = '#EF4444'; // red

    if (score >= 80) {
      label = 'Strong';
      color = '#10B981'; // green
    } else if (score >= 50) {
      label = 'Medium';
      color = '#F59E0B'; // amber
    }

    return { score, label, color, percent: Math.min(score, 100) };
  }

  /**
   * Perform Sign In with real Backend REST API + offline fallback
   * Rate limiting: 5 failed attempts locks for 2 minutes
   */
  async function login(mobile, password) {
    const mobileCheck = validateMobileNumber(mobile);
    if (!mobileCheck.valid) {
      return { success: false, message: mobileCheck.message };
    }

    if (!password || password.length < 4) {
      return { success: false, message: 'Please enter your password (minimum 4 characters).' };
    }

    // Rate Limiting / Account Lockout check (5 failed attempts locks for 2 minutes)
    const lockoutKey = 'gcs_lockout_' + mobileCheck.clean;
    try {
      const lockoutData = JSON.parse(sessionStorage.getItem(lockoutKey) || '{}');
      if (lockoutData.lockedUntil && Date.now() < lockoutData.lockedUntil) {
        const remainingSec = Math.ceil((lockoutData.lockedUntil - Date.now()) / 1000);
        return { success: false, message: `Account temporarily locked due to repeated failed attempts. Please retry in ${remainingSec} seconds.` };
      }
    } catch (_) {}

    // 1. Try real Backend REST API
    try {
      const apiBase = (window.GCS_API && window.GCS_API.baseUrl) ? window.GCS_API.baseUrl : '/api/v1';
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileCheck.clean, password })
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) {
          const authData = body.data;
          const u = authData.user;
          const roleNormalized = (u.role || 'student').toLowerCase();
          const userSession = {
            id: u.id,
            name: u.fullName,
            phone: u.phone,
            email: u.email || '',
            role: roleNormalized,
            roleLabel: roleNormalized === 'admin' ? 'District Admin' : roleNormalized === 'volunteer' ? 'Village Coordinator' : 'Student / Job Seeker',
            avatar: 'assets/resume-avatar-ravi.webp',
            initials: (u.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            district: u.district || '',
            village: u.village || '',
            qualification: u.qualification || '',
            isDemoSession: false,
            token: authData.token,
            tokenExpiresAt: Date.now() + (authData.expiresInMs || 86400000),
            joinedDate: 'Verified Member'
          };
          sessionStorage.removeItem(lockoutKey);
          setCurrentUser(userSession);
          return { success: true, user: userSession };
        }
      } else if (res.status === 400 || res.status === 401) {
        recordLockoutFailure(mobileCheck.clean);
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.message || 'Invalid mobile number or password.' };
      }
    } catch (apiErr) {
      console.info('[GCS Auth] Backend API login unavailable, checking Cloud Firestore.');
    }

    // 1.5. Check Cloud Firestore Database (Real-time live users across Local, Vercel & APK)
    if (window.GCS_FIREBASE && window.GCS_FIREBASE.getDb()) {
      try {
        const inputHash = await hashPassword(password);
        const fbRes = await window.GCS_FIREBASE.loginUser(mobileCheck.clean, inputHash);
        if (fbRes && fbRes.success && fbRes.user) {
          const u = fbRes.user;
          const roleNormalized = (u.role || 'student').toLowerCase();
          const userSession = {
            id: 'usr_' + u.phone,
            name: u.name,
            phone: u.phone,
            email: u.email || '',
            role: roleNormalized,
            roleLabel: roleNormalized === 'admin' ? 'District Admin' : roleNormalized === 'volunteer' ? 'Village Coordinator' : 'Student / Job Seeker',
            avatar: 'assets/resume-avatar-ravi.webp',
            initials: (u.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            district: u.district || '',
            village: u.village || '',
            qualification: u.qualification || '',
            isDemoSession: false,
            token: 'cloud_tok_' + Date.now(),
            tokenExpiresAt: Date.now() + 86400000,
            joinedDate: 'Cloud Verified Member'
          };
          sessionStorage.removeItem(lockoutKey);
          setCurrentUser(userSession);
          return { success: true, user: userSession };
        } else if (fbRes && fbRes.message && fbRes.message.includes('Incorrect password')) {
          recordLockoutFailure(mobileCheck.clean);
          return { success: false, message: 'Incorrect mobile number or password.' };
        }
      } catch (fbErr) {
        console.warn('[GCS Auth] Firestore login check warning:', fbErr.message);
      }
    }

    // 2. Offline / Local fallback
    const inputHash = await hashPassword(password);
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    } catch (e) {}

    let user = registeredUsers.find(u => u.phone === mobileCheck.clean);
    let expectedHash = user ? user.passwordHash : null;

    if (!user) {
      user = Object.values(DEMO_USERS).find(u => u.phone === mobileCheck.clean);
      if (user) {
        expectedHash = user.passwordHash || DEMO_PASSWORD_HASH;
      }
    }

    if (!user) {
      recordLockoutFailure(mobileCheck.clean);
      // Deliberately the same wording as a wrong password: saying which of
      // the two was wrong tells an attacker which numbers are registered,
      // and the old message simply listed working credentials.
      return { success: false, message: 'Incorrect mobile number or password.' };
    }

    // The hash must match. There is deliberately no literal that opens any
    // account: 'password123' and 'demo123' used to do exactly that, so a
    // student's account was readable by anyone who had seen the login page.
    if (!expectedHash || inputHash !== expectedHash) {
      recordLockoutFailure(mobileCheck.clean);
      return { success: false, message: 'Incorrect mobile number or password.' };
    }

    sessionStorage.removeItem(lockoutKey);
    setCurrentUser(user);
    return { success: true, user };
  }

  function recordLockoutFailure(cleanPhone) {
    const lockoutKey = 'gcs_lockout_' + cleanPhone;
    try {
      const data = JSON.parse(sessionStorage.getItem(lockoutKey) || '{"attempts":0}');
      data.attempts = (data.attempts || 0) + 1;
      if (data.attempts >= 5) {
        data.lockedUntil = Date.now() + 120000; // 2 minutes
      }
      sessionStorage.setItem(lockoutKey, JSON.stringify(data));
    } catch (_) {}
  }

  /**
   * One-Click Demo Login
   */
  /**
   * One-click demo session, kept because the project has to be demonstrated
   * at a workshop and in a viva without real accounts.
   *
   * It is explicitly a demo: no backend token is issued, so every API call
   * stays unauthenticated and the admin screens show nothing real. The toast
   * says "demo" so nobody mistakes it for having signed in as that person.
   */
  function loginDemo(roleKey) {
    const user = Object.assign({}, DEMO_USERS[roleKey] || DEMO_USERS.student, {
      isDemoSession: true,
      token: null
    });
    setCurrentUser(user);

    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(`🧪 Demo session as ${user.roleLabel} — no real account, no saved data.`);
    }

    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      const defaultUrl = (user.role === 'admin' || user.role === 'volunteer') ? 'admin/index.html' : 'dashboard.html';
      window.location.href = getSafeNextUrl(next, defaultUrl);
    }, 400);
  }

  /**
   * Sign Up: Stage 1 (Validate uniqueness, Generate 6-Digit OTP, store pending state)
   */
  async function signup(data) {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, field: 'name', message: 'Please enter your full name.' };
    }

    const mobileCheck = validateMobileNumber(data.phone);
    if (!mobileCheck.valid) {
      return { success: false, field: 'phone', message: mobileCheck.message };
    }

    // Uniqueness validation: Prevent duplicate accounts
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    } catch (e) {}

    if (registeredUsers.some(u => u.phone === mobileCheck.clean) || Object.values(DEMO_USERS).some(u => u.phone === mobileCheck.clean)) {
      return { success: false, field: 'phone', message: 'This mobile number is already registered. Please sign in.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, field: 'password', message: 'Password must be at least 6 characters.' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, field: 'confirmPassword', message: 'Passwords do not match.' };
    }

    let generatedOtp = String(Math.floor(100000 + Math.random() * 900000));

    // Try sending OTP via real backend API
    try {
      const apiBase = (window.GCS_API && window.GCS_API.baseUrl) ? window.GCS_API.baseUrl : '/api/v1';
      const res = await fetch(`${apiBase}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileCheck.clean, purpose: 'SIGNUP' })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data && body.data.debugOtp) {
          generatedOtp = body.data.debugOtp;
        }
      }
    } catch (_) {}

    const passHash = await hashPassword(data.password);

    const pendingUser = {
      id: 'usr_' + Date.now(),
      name: data.name.trim(),
      phone: mobileCheck.clean,
      email: (data.email || '').trim(),
      role: data.role === 'volunteer' ? 'volunteer' : 'student',
      roleLabel: data.role === 'volunteer' ? 'Village Coordinator' : 'Student / Job Seeker',
      avatar: 'assets/resume-avatar-ravi.webp',
      initials: data.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U',
      joinedDate: 'Just now',
      rawPassword: data.password, // temporary for backend registration upon verification
      passwordHash: passHash,
      otpCode: generatedOtp,
      otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      otpAttempts: 0
    };

    try {
      localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(pendingUser));
    } catch (e) {}

    return { 
      success: true, 
      pendingUser, 
      demoOtpCode: generatedOtp 
    };
  }

  /**
   * Verify 6-Digit OTP Code and persist account (SQL backend + local storage)
   */
  async function verifyOTP(code) {
    if (!/^\d{6}$/.test(code)) {
      return { success: false, message: 'Please enter the complete 6-digit verification code.' };
    }

    let pending = null;
    try {
      const raw = localStorage.getItem(PENDING_SIGNUP_KEY);
      if (raw) pending = JSON.parse(raw);
    } catch (e) {}

    if (!pending) {
      return { success: false, message: 'No pending registration found. Please submit the sign-up form first.' };
    }

    if (Date.now() > pending.otpExpiresAt) {
      localStorage.removeItem(PENDING_SIGNUP_KEY);
      return { success: false, message: 'Verification code has expired (5-minute limit). Please sign up again.' };
    }

    pending.otpAttempts = (pending.otpAttempts || 0) + 1;

    if (pending.otpAttempts > 5) {
      localStorage.removeItem(PENDING_SIGNUP_KEY);
      return { success: false, message: 'Too many incorrect attempts. Please sign up again.' };
    }

    // Only the generated code is accepted. '123456' used to verify any
    // signup, and the failure message printed the correct code, so this
    // step confirmed nothing.
    //
    // The code is generated in the browser and shown on screen, because this
    // project has no SMS gateway. The sign-up screen says so plainly rather
    // than claiming a message was sent. It still catches a mistyped number
    // and a user who cannot complete the step, which is what it is for here.
    if (code !== pending.otpCode) {
      try {
        localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(pending));
      } catch (e) {}
      return {
        success: false,
        message: `Incorrect code. ${5 - pending.otpAttempts} attempt(s) remaining.`
      };
    }

    // Verification succeeded: Persist to real Spring Boot backend SQL database
    let realToken = null;
    let realId = pending.id;
    try {
      if (!pending.rawPassword) {
        // Without the password the student chose there is nothing to create
        // a server account with; keep it local rather than inventing one.
        throw new Error('no password captured for signup');
      }
      const apiBase = (window.GCS_API && window.GCS_API.baseUrl) ? window.GCS_API.baseUrl : '/api/v1';
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: pending.name,
          phone: pending.phone,
          password: pending.rawPassword,
          role: (pending.role || 'student').toUpperCase(),
          district: 'Andhra Pradesh',
          village: 'Rural'
        })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) {
          realToken = body.data.token;
          realId = body.data.user.id;
        }
      }
    } catch (e) {
      console.info('[GCS Auth] Registered locally. Background sync will synchronize with SQL backend.');
    }

    // Sync to Cloud Firestore if connected (Online Real-time User across Local, Vercel & APK)
    if (window.GCS_FIREBASE && window.GCS_FIREBASE.getDb()) {
      try {
        await window.GCS_FIREBASE.registerUser({
          phone: pending.phone,
          name: pending.name,
          passwordHash: pending.passwordHash,
          role: pending.role,
          village: pending.village || 'Rural',
          district: pending.district || 'Andhra Pradesh',
          qualification: pending.qualification || ''
        });
      } catch (fbErr) {
        console.warn('[GCS Auth] Firestore user signup sync warning:', fbErr.message);
      }
    }

    delete pending.rawPassword;
    delete pending.otpCode;
    delete pending.otpExpiresAt;
    delete pending.otpAttempts;

    pending.id = realId;
    pending.token = realToken;
    pending.tokenExpiresAt = realToken ? Date.now() + 86400000 : null;
    pending.isDemoSession = !realToken;

    try {
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      registered.push(pending);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      localStorage.removeItem(PENDING_SIGNUP_KEY);
    } catch (e) {}

    setCurrentUser(pending);
    return { success: true, user: pending };
  }

  /**
   * Password Reset Flow: Send OTP to Phone
   */
  async function sendPasswordResetOtp(phone) {
    const mobileCheck = validateMobileNumber(phone);
    if (!mobileCheck.valid) return { success: false, message: mobileCheck.message };

    let generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const apiBase = (window.GCS_API && window.GCS_API.baseUrl) ? window.GCS_API.baseUrl : '/api/v1';
      const res = await fetch(`${apiBase}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileCheck.clean, purpose: 'RESET_PASSWORD' })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data && body.data.debugOtp) generatedOtp = body.data.debugOtp;
      }
    } catch (_) {}

    sessionStorage.setItem('gcs_reset_' + mobileCheck.clean, JSON.stringify({
      code: generatedOtp,
      expiresAt: Date.now() + 300000
    }));

    return { success: true, otpCode: generatedOtp, message: `OTP sent to +91 ${mobileCheck.clean}` };
  }

  /**
   * Password Reset Flow: Submit OTP & Set New Password
   */
  async function resetPassword(phone, otp, newPassword) {
    const mobileCheck = validateMobileNumber(phone);
    if (!mobileCheck.valid) return { success: false, message: mobileCheck.message };
    if (!otp || !/^\d{6}$/.test(otp)) return { success: false, message: 'Please enter the 6-digit OTP.' };
    if (!newPassword || newPassword.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };

    // Try backend reset
    try {
      const apiBase = (window.GCS_API && window.GCS_API.baseUrl) ? window.GCS_API.baseUrl : '/api/v1';
      const res = await fetch(`${apiBase}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileCheck.clean, otp, newPassword })
      });
      if (res.ok) {
        return { success: true, message: 'Password updated successfully! You can now sign in.' };
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.message) return { success: false, message: err.message };
      }
    } catch (_) {}

    // Offline reset
    let resetInfo = null;
    try {
      resetInfo = JSON.parse(sessionStorage.getItem('gcs_reset_' + mobileCheck.clean) || 'null');
    } catch (_) {}

    // Only the code issued for this number resets it. '123456' used to work
    // here too, which meant any account's password could be reset by anyone
    // who knew the mobile number — worse than the signup bypass, because it
    // took the account over rather than just creating one.
    if (resetInfo && otp === resetInfo.code && Date.now() < resetInfo.expiresAt) {
      let registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      } catch (e) {}

      const user = registeredUsers.find(u => u.phone === mobileCheck.clean);
      if (user) {
        user.passwordHash = await hashPassword(newPassword);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
      }
      sessionStorage.removeItem('gcs_reset_' + mobileCheck.clean);
      return { success: true, message: 'Password updated successfully! You can now sign in.' };
    }

    return { success: false, message: 'Invalid or expired OTP code.' };
  }

  /**
   * Logout User
   */
  function logout() {
    setCurrentUser(null);
    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show('Logged out successfully.');
    }
    const isSubdir = window.location.pathname.includes('/admin/');
    const pfx = isSubdir ? '../' : '';
    setTimeout(() => {
      window.location.href = pfx + 'login.html';
    }, 300);
  }

  /**
   * Sync Header Auth UI across all pages with full XSS escaping
   */
  function syncHeaderAuthUI() {
    const user = getCurrentUser();
    const actionsContainers = document.querySelectorAll('.gcs-header-actions, .header-actions');
    const isSubdir = window.location.pathname.includes('/admin/');
    const pfx = isSubdir ? '../' : '';

    actionsContainers.forEach(container => {
      let authBtn = container.querySelector('#gcsHeaderAuthBtn');

      if (!authBtn) {
        authBtn = document.createElement('div');
        authBtn.id = 'gcsHeaderAuthBtn';
        authBtn.style.display = 'inline-flex';
        authBtn.style.alignItems = 'center';
        const langGroup = container.querySelector('.gcs-lang-group, .lang-toggle');
        if (langGroup && langGroup.nextSibling) {
          container.insertBefore(authBtn, langGroup.nextSibling);
        } else {
          container.appendChild(authBtn);
        }
      }

      if (user) {
        // Safe string escaping for all interpolated fields
        const safeName = escapeHtml(user.name || 'User');
        const safeFirstName = escapeHtml((user.name || 'User').trim().split(' ')[0]);
        const safeRoleLabel = escapeHtml(user.roleLabel || (user.role === 'admin' ? 'District Admin' : user.role === 'volunteer' ? 'Village Coordinator' : 'Student / Job Seeker'));
        const safeAvatar = escapeHtml(pfx + (user.avatar || 'assets/resume-avatar-ravi.webp'));
        const dashLink = pfx + 'dashboard.html';
        const profileLink = pfx + 'profile.html';
        const adminLink = isSubdir ? 'index.html' : 'admin/index.html';

        authBtn.innerHTML = `
          <div class="gcs-user-pill-dropdown" style="position: relative; display: inline-block;">
            <button type="button" onclick="toggleHeaderUserMenu(event)" style="display: flex; align-items: center; gap: 8px; background: #ECFDF5; border: 1.5px solid #86EFAC; border-radius: 24px; padding: 4px 12px 4px 4px; cursor: pointer; font-family: inherit;">
              <img src="${safeAvatar}" alt="${safeName}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" onerror="this.src='${pfx}assets/resume-avatar-ravi.webp'" />
              <span style="font-size: var(--text-sm); font-weight: 700; color: #064E3B; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${safeFirstName}</span>
              <span class="material-symbols-outlined" style="font-size: var(--text-base); color: #059669;">expand_more</span>
            </button>
            <div id="headerUserMenu" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 200px; z-index: 9999; padding: 6px 0;">
              <div style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9;">
                <div style="font-size: var(--text-sm); font-weight: 800; color: #0F172A;">${safeName}</div>
                <div style="font-size: var(--text-xs); color: #059669; font-weight: 600;">${safeRoleLabel}</div>
              </div>
              <a href="${dashLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: var(--text-sm); color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: var(--text-lg); color: #059669;">dashboard</span>
                <span data-lang-key="ui-my-dashboard">My Dashboard</span>
              </a>
              <a href="${profileLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: var(--text-sm); color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: var(--text-lg); color: #2563EB;">account_circle</span>
                <span data-lang-key="ui-my-profile">My Profile</span>
              </a>
              ${user.role === 'admin' || user.role === 'volunteer' ? `
              <a href="${adminLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: var(--text-sm); color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: var(--text-lg); color: #7C3AED;">admin_panel_settings</span>
                <span data-lang-key="ui-admin-panel">Admin Panel</span>
              </a>` : ''}
              <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 4px 0;" />
              <button type="button" onclick="window.GCS_AUTH.logout()" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 16px; font-size: var(--text-sm); color: #DC2626; background: none; border: none; text-align: left; cursor: pointer; font-weight: 700;">
                <span class="material-symbols-outlined" style="font-size: var(--text-lg);">logout</span>
                <span data-lang-key="ui-sign-out">Sign Out</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Guest mode
        authBtn.innerHTML = `
          <a href="${pfx}login.html" class="gcs-btn-cta-1" style="padding: 6px 14px; font-size: var(--text-sm); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; margin-left: 6px;">
            <span class="material-symbols-outlined" style="font-size: var(--text-base);">login</span>
            <span data-lang-key="ui-sign-in">Sign In</span>
          </a>
        `;
      }
    });

    // The pill is injected after i18n's initial sweep, so translate it now.
    if (window.GCS_I18N) window.GCS_I18N.apply();
  }

  window.toggleHeaderUserMenu = function (e) {
    e.stopPropagation();
    const menu = document.getElementById('headerUserMenu');
    if (menu) {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  };

  document.addEventListener('click', () => {
    const menu = document.getElementById('headerUserMenu');
    if (menu) menu.style.display = 'none';
  });

  // Cross-tab session synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      syncHeaderAuthUI();
      window.dispatchEvent(new CustomEvent('gcs-auth-changed', {
        detail: { user: getCurrentUser() }
      }));
    }
  });

  // Re-render the header pill whenever the language changes.
  window.addEventListener('gcs-language-changed', () => syncHeaderAuthUI());

  // Initialize Auth on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    syncHeaderAuthUI();
    if (window.location.search.includes('code=')) {
      handleOidcCallback();
    }
  });

  // Global Auth API
  window.GCS_AUTH = {
    getUser: getCurrentUser,
    setUser: setCurrentUser,
    requireAuth,
    login,
    signup,
    verifyOTP,
    loginDemo,
    loginWithOidc,
    handleOidcCallback,
    refreshToken,
    oidcConfig: OIDC_CONFIG,
    logout,
    validateMobile: validateMobileNumber,
    calcPasswordStrength: calculatePasswordStrength,
    syncHeader: syncHeaderAuthUI,
    hashPassword,
    getSafeNextUrl,
    sendPasswordResetOtp,
    resetPassword,
    demoUsers: DEMO_USERS
  };

})();
