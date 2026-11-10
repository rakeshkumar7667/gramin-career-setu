/**
 * Gramin Career Setu — Unified Interactive Client-Side Engine (app.js)
 * ───────────────────────────────────────────────────────────────────
 * • Centralized datasets (Jobs, Scholarships, Schemes, Workshops, Resources)
 * • Real-time filtering, instant search & tag-based live queries
 * • Dynamic job detail loading with URL params (?id=...)
 * • Interactive job application modal & resume attachment
 * • Roadmap generator with tailored milestone matrix
 * • Client-side jsPDF downloads for resources, roadmaps, and resumes
 * • LocalStorage persistence for bookmarks, applications, registrations, and quiz
 * • Universal toast notification system
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  //  1. Central Datasets (job roles live in data/jobs.csv)
  // ══════════════════════════════════════════════════════════════════════

  const SCHOLARSHIPS_DATABASE = [
    {
      id: 'post-matric-obc',
      title: 'Post Matric Fee Reimbursement (RTF & MTF)',
      provider: 'AP Social Welfare & BC Welfare Departments',
      badge: 'Merit Based',
      amount: '₹15,000 / year',
      eligibility: '10th Pass & above, OBC category, income < ₹2.5 Lakh',
      deadline: '31 Aug 2024',
      qual: ['10th', 'inter', 'degree'],
      category: 'obc',
      gender: 'all',
      maxIncome: 2.5,
      description: 'Financial assistance for students belonging to Other Backward Classes studying post-matriculation courses in recognized institutions in Andhra Pradesh.',
      documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Previous Marks Memo', 'Bank Passbook']
    },
    {
      id: 'nsp-central-sector',
      title: 'PM-USP Central Sector Scheme of Scholarship (CSSS)',
      provider: 'Government of India',
      badge: 'Merit Based',
      amount: '₹20,000 / year',
      eligibility: '10th Pass & above with >80% marks, all categories',
      deadline: '30 Sep 2024',
      qual: ['inter', 'degree'],
      category: 'all',
      gender: 'all',
      maxIncome: 5.0,
      description: 'Central sector scheme for college and university students to support day-to-day expenses while pursuing higher education.',
      documents: ['Aadhaar Card', 'College Bonafide Certificate', '12th Class Marks Card', 'Parent Income Proof']
    },
    {
      id: 'saksham-scholarship',
      title: 'AICTE Saksham Scholarship for Specially-Abled (Divyang)',
      provider: 'Ministry of Social Justice & AICTE',
      badge: 'Need Based',
      amount: '₹50,000 / year',
      eligibility: 'Specially-abled students (disability >= 40%) in technical degree/diploma',
      deadline: '15 Sep 2024',
      qual: ['10th', 'inter', 'degree'],
      category: 'all',
      gender: 'all',
      maxIncome: 2.5,
      description: 'Scholarship dedicated to encourage economically disadvantaged and specially-abled students to pursue technical education without financial strain.',
      documents: ['Medical Disability Certificate (if applicable)', 'Income Certificate', 'Aadhaar Card']
    },
    {
      id: 'pre-matric-obc',
      title: 'PM-YASASVI Scholarship Scheme (OBC, EBC & DNT)',
      provider: 'AP Social Welfare & BC Welfare Departments',
      badge: 'Merit Based',
      amount: '₹10,000 / year',
      eligibility: '9th & 10th Class students with passing grades',
      deadline: '31 Aug 2024',
      qual: ['10th'],
      category: 'obc',
      gender: 'all',
      maxIncome: 2.5,
      description: 'State scholarship to prevent student dropouts in high school and promote transition to intermediate and vocational education.',
      documents: ['School Study Certificate', 'Ration Card / Income Certificate', 'Aadhaar Card']
    },
    {
      id: 'pragati-girls-scholarship',
      title: 'Pragati Scholarship for Girl Students',
      provider: 'AICTE / Govt. of India',
      badge: 'Girl Child Only',
      amount: '₹50,000 / year',
      eligibility: 'Girls admitted to 1st year Degree/Diploma, Family Income < ₹8 Lakh',
      deadline: '31 Oct 2024',
      qual: ['inter', 'degree'],
      category: 'all',
      gender: 'female',
      maxIncome: 8.0,
      description: 'Prestigious national scholarship dedicated exclusively to empowering female students pursuing technical engineering and diploma degrees.',
      documents: ['College Admission Receipt', '10th/12th Marksheet', 'Family Income Certificate']
    }
  ];

  // ══════════════════════════════════════════════════════════════════════
  //  2. Local Storage Manager
  // ══════════════════════════════════════════════════════════════════════

  const Storage = {
    get(key, defaultValue) {
      try {
        const val = localStorage.getItem('gcs_' + key);
        return val ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem('gcs_' + key, JSON.stringify(value));
      } catch (e) {
        console.warn('[GCS Storage] write error:', e);
      }
    },
    toggleBookmark(type, id) {
      const key = `saved_${type}`;
      const list = this.get(key, []);
      const index = list.indexOf(id);
      let isSaved = false;

      if (index === -1) {
        list.push(id);
        isSaved = true;
      } else {
        list.splice(index, 1);
        isSaved = false;
      }

      this.set(key, list);
      return isSaved;
    },
    isBookmarked(type, id) {
      const list = this.get(`saved_${type}`, []);
      return list.includes(id);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  3. Toast Notification Component
  // ══════════════════════════════════════════════════════════════════════

  const Toast = {
    show(message, type = 'success', duration = 3500) {
      let container = document.getElementById('gcsToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'gcsToastContainer';
        container.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        `;
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      const isSuccess = type === 'success';
      toast.style.cssText = `
        background: ${isSuccess ? '#1B4D3E' : '#DC2626'};
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: var(--text-base);
        font-weight: 600;
        font-family: 'Plus Jakarta Sans', sans-serif;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      const icon = isSuccess ? 'check_circle' : 'info';
      toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: var(--text-xl);">${icon}</span>
        <span>${message}</span>
      `;

      container.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      // Auto dismiss
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
      }, duration);
    }
  };


  // ══════════════════════════════════════════════════════════════════════
  //  6. Scholarships Interactive Filtering
  // ══════════════════════════════════════════════════════════════════════

  window.filterScholarshipCards = function () {
    const qual = (document.getElementById('schQual') ? document.getElementById('schQual').value : 'all');
    const cat = (document.getElementById('schCat') ? document.getElementById('schCat').value : 'all');
    const gen = (document.getElementById('schGen') ? document.getElementById('schGen').value : 'all');
    const inc = (document.getElementById('schInc') ? document.getElementById('schInc').value : 'all');

    const cards = document.querySelectorAll('.scholarship-card-item');
    let visible = 0;

    cards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      let match = true;

      if (qual !== 'all' && !cardText.includes(qual.toLowerCase()) && !cardText.includes('pass')) {
        match = false;
      }
      if (cat !== 'all' && !cardText.includes(cat.toLowerCase()) && !cardText.includes('all')) {
        match = false;
      }
      if (gen === 'female' && !cardText.includes('girl') && !cardText.includes('female') && !cardText.includes('need based')) {
        match = false;
      }

      if (match) {
        card.style.display = 'flex';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    const countEl = document.getElementById('schCount');
    if (countEl) {
      countEl.textContent = `Showing ${visible} scholarships matching your filters`;
    }
  };

  window.resetScholarshipFilters = function () {
    ['schQual', 'schCat', 'schGen', 'schInc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });
    window.filterScholarshipCards();
    Toast.show('Filters reset to default');
  };

  // ══════════════════════════════════════════════════════════════════════
  //  7. Workshops Registration & My Registrations View
  // ══════════════════════════════════════════════════════════════════════

  // Workshop registration lives in assets/actions.js (GCS_ACTIONS.toggleWorkshop).
  // The previous implementation here collected details through three
  // sequential prompt() dialogs, which are blocked outright in sandboxed and
  // embedded contexts, and — being defined in a deferred script — silently
  // overwrote the page-level handler. It also wrote a fourth distinct shape
  // under the shared storage key.

  window.filterWorkshopCategory = function (cat, btn) {
    if (btn) {
      document.querySelectorAll('.gcs-tab-pill-btn, .gcs-pill-tag').forEach(b => {
        b.classList.remove('active');
        b.style.background = '#fff';
        b.style.color = '#334155';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--gcs-green-primary)';
      btn.style.color = '#fff';
    }

    const cards = document.querySelectorAll('.gcs-workshop-card');

    if (cat === 'my') {
      const myRegs = Storage.get('workshop_registrations', []);
      // Entries have been written in several shapes over time (bare title
      // strings, {title}, {workshop, id}). Normalise before comparing so a
      // legacy entry cannot throw on a missing field.
      const regTitles = myRegs.map(r => {
        if (typeof r === 'string') return r.toLowerCase();
        return String((r && (r.workshop || r.title || r.id)) || '').toLowerCase();
      });
      cards.forEach(c => {
        const title = c.querySelector('.gcs-workshop-title');
        const t = title ? title.textContent.trim().toLowerCase() : '';
        const match = !!t && regTitles.some(r => r.includes(t) || r === 'ws-' + t.replace(/\s+/g, '-'));
        c.style.display = match ? 'block' : 'none';
      });
      Toast.show(`Showing ${myRegs.length} registered workshops.`);
      return;
    }

    cards.forEach(c => {
      if (cat === 'all' || c.getAttribute('data-cat') === cat) {
        c.style.display = 'block';
      } else {
        c.style.display = 'none';
      }
    });
  };

  // ══════════════════════════════════════════════════════════════════════
  //  8. Resource Kit Direct PDF Generation
  // ══════════════════════════════════════════════════════════════════════

  window.downloadResourcePDF = function (resourceTitle, category) {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        Toast.show(`📥 Preparing ${resourceTitle}...`);
        return;
      }
      const doc = new jsPDF();
      doc.setFillColor(27, 77, 62);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Gramin Career Setu — Study Resource Kit', 14, 22);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text(resourceTitle, 14, 50);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Category: ${category || 'Career Guidelines'} • Summary generated by this site`, 14, 58);

      doc.text('Key Highlights & Comprehensive Exam Guidelines:', 14, 72);
      doc.text('1. Eligibility: Open to rural youth passing 10th, Intermediate, or Degree.', 14, 82);
      doc.text('2. Syllabus & Exam Pattern: General Studies, Aptitude, English & Telugu literacy.', 14, 92);
      doc.text('3. Free Materials: Handouts, question banks, and mock papers via your Panchayat desk.', 14, 102);
      doc.text('4. Official Portal: Always register directly on official .gov.in portals.', 14, 112);

      doc.setFillColor(240, 253, 244);
      doc.rect(14, 130, 182, 24, 'F');
      doc.setTextColor(21, 128, 61);
      doc.text('Prepared for rural students under the CareerBridge CSP Initiative.', 20, 144);

      doc.save(`${resourceTitle.replace(/\s+/g, '_')}_GCS.pdf`);
      Toast.show(`📥 Downloaded ${resourceTitle}!`);
    } catch (e) {
      Toast.show(`📥 Downloaded ${resourceTitle}!`);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  9. Job Detail Tab Switcher
  // ══════════════════════════════════════════════════════════════════════


  // HTML Escaping Utility for XSS Prevention
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Universal Bookmark Toggle
  window.toggleGcsBookmark = function (type, id, btn) {
    const isSaved = Storage.toggleBookmark(type, id);
    if (btn) {
      const icon = btn.querySelector('.material-symbols-outlined') || (btn.classList.contains('material-symbols-outlined') ? btn : null);
      if (icon) {
        icon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
      }
      btn.style.color = isSaved ? '#059669' : '#64748B';
    }
    const typeLabel = type === 'jobs' ? 'Job' : type === 'scholarships' ? 'Scholarship' : type === 'resources' ? 'Resource' : 'Career';
    Toast.show(isSaved ? `✅ ${typeLabel} saved to bookmarks!` : `ℹ️ ${typeLabel} removed from bookmarks.`);
    return isSaved;
  };

  function initAllBookmarks() {
    document.querySelectorAll('[data-bookmark-type][data-bookmark-id]').forEach(btn => {
      const type = btn.getAttribute('data-bookmark-type');
      const id = btn.getAttribute('data-bookmark-id');
      const isSaved = Storage.isBookmarked(type, id);
      const icon = btn.querySelector('.material-symbols-outlined') || (btn.classList.contains('material-symbols-outlined') ? btn : null);
      if (icon) {
        icon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
      }
      btn.style.color = isSaved ? '#059669' : '#64748B';
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleGcsBookmark(type, id, btn);
      };
    });
  }

  // Initialize interactive features on load
  document.addEventListener('DOMContentLoaded', () => {
    // Lift the sticky header off the content once the page scrolls.
    var gcsHeader = document.querySelector('.gcs-header');
    if (gcsHeader) {
      var onScroll = function () {
        gcsHeader.classList.toggle('is-stuck', window.scrollY > 4);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Footer copyright year, so it never reads as stale.
    document.querySelectorAll('.gcs-current-year').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });

    initAllBookmarks();
  });

  // ── Service Worker registration ─────────────────────────────────
  // Lives here rather than in the legacy script.js, which only two of the
  // 22 pages load — offline support was effectively off site-wide.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const base = location.pathname.includes('/admin/') ? '../sw.js' : './sw.js';
      navigator.serviceWorker.register(base).catch(err => {
        console.warn('[Service Worker] registration failed:', err);
      });
    });
  }

  // ── Text-to-Speech Resilience Listener ───────────────────────────
  window.addEventListener('gcs-speech-unavailable', (e) => {
    const lang = (e && e.detail && e.detail.lang) || 'te';
    const isTe = lang === 'te';
    const msg = isTe
      ? 'ℹ️ మీ పరికరంలో తెలుగు వాయిస్ లేదు (No Telugu voice on this device). English voice fallback active.'
      : 'ℹ️ Audio speech voice is not available on this device.';
    Toast.show(msg, 'info');
  });

  // Global Exports
  window.GCS_APP = {
    // Real role data, generated from data/jobs.csv by
    // scripts/build-jobs-data.js. Empty if data/jobs-data.js is not loaded.
    get jobs() { return window.GCS_JOBS || []; },
    scholarships: SCHOLARSHIPS_DATABASE,
    storage: Storage,
    toast: Toast,
    escapeHtml: escapeHtml,
    toggleBookmark: window.toggleGcsBookmark
  };

})();
