/**
 * Gramin Career Setu — Landing Page Interactive Engine
 */

(function () {
  'use strict';

  // 4A Pillar Descriptions
  const frameworkDetails = {
    Awareness: {
      title_te: "అవగాహన (Awareness)",
      title_en: "Our Pillar: Awareness",
      desc_te: "గ్రామాల్లోని యువత మరియు విద్యార్థులకు అందుబాటులో ఉన్న 100+ కెరీర్ మార్గాలు, ప్రభుత్వ ఉద్యోగాలు, ITI మరియు డిజిటల్ అవకాశాలపై పంచాయతీ స్థాయి అవగాహన కల్పించడం.",
      desc_en: "Awareness brings career guidance directly to village panchayats and high schools, demystifying 100+ vocational, technical, and government career streams for rural youth."
    },
    Access: {
      title_te: "యాక్సెస్ (Access)",
      title_en: "Our Pillar: Access",
      desc_te: "ఇంటర్నెట్ వేగం లేదా ఖరీదైన పరికరాలు లేకపోయినా ప్రతి విద్యార్థికి సమాచారం చేరేలా ఆఫ్‌లైన్ PWA టెక్నాలజీ మరియు తెలుగు భాషలో రిసోర్స్‌లను అందించడం.",
      desc_en: "Access ensures all materials are in simple Telugu, lightweight, and engineered to work completely offline without requiring high-speed broadband."
    },
    Action: {
      title_te: "కార్యాచరణ (Action)",
      title_en: "Our Pillar: Action",
      desc_te: "కేవలం సలహాలు ఇవ్వడమే కాకుండా, దరఖాస్తు ఫారమ్‌లు నింపడం, ఉచిత రెజ్యూమ్ తయారు చేయడం మరియు మాక్ పరీక్షల ద్వారా స్పష్టమైన తదుపరి అడుగు వేయించడం.",
      desc_en: "Action turns passive advice into real applications. We assist with form-filling drives, resume generation, and step-by-step roadmaps with zero middleman fees."
    },
    Accountability: {
      title_te: "జవాబుదారీతనం (Accountability)",
      title_en: "Our Pillar: Accountability",
      desc_te: "వర్క్‌షాప్ ముగిసిన తర్వాత కూడా గ్రామ వాలంటీర్లు మరియు కమ్యూనిటీ లీడర్ల ద్వారా నిరంతర మద్దతు, ఫలితాల ట్రాకింగ్ అందించడం.",
      desc_en: "Accountability establishes local youth coordinators and village champions who track progress, offer peer mentoring, and measure employment outcomes."
    }
  };

  // Modal helpers
  window.openGcsModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  };

  window.closeGcsModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };

  // Workshop Registration
  window.openWorkshopRegister = function (title, venue, date) {
    const titleEl = document.getElementById('modalWsTitle');
    const detailsEl = document.getElementById('modalWsDetails');
    if (titleEl) titleEl.textContent = title;
    if (detailsEl) detailsEl.textContent = `📅 ${date} | 📍 ${venue} | ⏰ 10:00 AM - 1:00 PM`;
    window.openGcsModal('workshopRegisterModal');
  };

  window.handleWorkshopFormSubmit = function (event) {
    event.preventDefault();
    const name = document.getElementById('wsRegName').value.trim();
    const phone = document.getElementById('wsRegPhone').value.trim();
    const village = document.getElementById('wsRegVillage').value.trim();
    const title = document.getElementById('modalWsTitle').textContent;

    if (!name || !phone || !village) return;

    const registration = {
      name,
      phone,
      village,
      workshop: title,
      registeredAt: new Date().toISOString()
    };

    try {
      // Single key shared with assets/actions.js and the dashboard counter.
      // This used to be 'gcs-workshop-registrations' (hyphen) while the
      // Storage helper wrote 'gcs_workshop_registrations', so registrations
      // made here never reached the dashboard.
      const KEY = 'gcs_workshop_registrations';
      const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
      registration.id = 'ws-' + String(title).toLowerCase().replace(/\s+/g, '-');
      existing.push(registration);
      localStorage.setItem(KEY, JSON.stringify(existing));
    } catch (e) {}

    const isTelugu = (document.documentElement.lang || 'te') === 'te';
    const msg = isTelugu
      ? `🎉 ధన్యవాదాలు ${name}! "${title}" కోసం మీ ఉచిత రిజిస్ట్రేషన్ పూర్తయింది. మీ ఫోన్‌కు SMS కన్ఫర్మేషన్ వస్తుంది.`
      : `🎉 Thank you ${name}! Your free registration for "${title}" is confirmed.`;

    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(msg);
    } else {
      alert(msg);
    }
    window.closeGcsModal('workshopRegisterModal');
    document.getElementById('workshopRegForm').reset();
  };

  // Video Testimonial Modal

  // 4A Framework Modal
  window.openFrameworkDetail = function (pillarKey) {
    const detail = frameworkDetails[pillarKey];
    if (!detail) return;

    const isTelugu = (document.documentElement.lang || 'te') === 'te';
    const title = isTelugu ? detail.title_te : detail.title_en;
    const desc = isTelugu ? detail.desc_te : detail.desc_en;

    const titleEl = document.getElementById('frameworkModalHeading');
    const descEl = document.getElementById('frameworkModalBody');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    window.openGcsModal('frameworkDetailModal');
  };

  // Resource Kit PDF Generator via jsPDF
  window.downloadResourceKit = function () {
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF not loaded');
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Top Header
      doc.setFillColor(27, 77, 62);
      doc.rect(0, 0, 210, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("Gramin Career Setu — Resource Kit", 15, 24);
      doc.setFontSize(10);
      doc.text("CareerBridge Initiative · Offline Career Guide & Schemes", 15, 34);

      // Section 1
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(14);
      doc.text("1. Recommended Career Pathways for Rural Youth", 15, 58);
      doc.setFontSize(10);
      doc.text("• Government Careers: APPSC Group IV, Village Secretariat, India Post GDS, Police", 20, 68);
      doc.text("• Technical & Trades: ITI Electrician, Fitter, Solar Technician, Mobile Repair", 20, 76);
      doc.text("• Digital & IT: Data Entry Operator, Junior Web Designer, Digital Seva Center", 20, 84);
      doc.text("• Healthcare: ANM / Staff Nurse, Pharmacy Assistant, Lab Technician", 20, 92);
      doc.text("• Agriculture Technology: Micro-irrigation, Soil Testing, Agri-Equipment Services", 20, 100);

      // Section 2
      doc.setFontSize(14);
      doc.text("2. Key Government Schemes & Financial Support", 15, 120);
      doc.setFontSize(10);
      doc.text("• MUDRA Loan: Shishu micro-loans up to Rs. 50,000 with 0 collateral for village startups.", 20, 130);
      doc.text("• PMKVY 4.0: Free skill development certifications with training stipend.", 20, 138);
      doc.text("• APSSDC: State-sponsored district skill training centers and job melas.", 20, 146);

      // Section 3
      doc.setFontSize(14);
      doc.text("3. Safe Career & Job Application Rules", 15, 166);
      doc.setFontSize(10);
      doc.text("• NEVER pay money or bribes to any agent promising a government job.", 20, 176);
      doc.text("• Always cross-check job notifications on official (.gov.in) government portals.", 20, 184);
      doc.text("• Keep your Aadhaar, educational certificates, and passport photos scanned.", 20, 192);

      // Callout Box
      doc.setFillColor(240, 253, 244);
      doc.rect(15, 215, 180, 28, 'F');
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(11);
      doc.text("Need offline help? Visit your local Panchayat or Gramin Career Setu volunteer.", 20, 232);

      doc.save("Gramin_Career_Setu_Resource_Kit.pdf");
    } catch (err) {
      console.warn('[Resource Kit] PDF creation fallback:', err.message);
      if (window.GCS_APP && window.GCS_APP.toast) {
        window.GCS_APP.toast.show("Downloading Career Resource Kit summary...");
      } else {
        alert("Downloading Career Resource Kit summary...");
      }
    }
  };

  // Mobile Menu Toggle
  window.toggleMobileNav = function () {
    const nav = document.getElementById('gcsMobileMenu');
    if (!nav) return;
    nav.classList.toggle('open');
  };

  // Language switcher synchronization
  window.switchGcsLanguage = function (lang) {
    if (window.GCS_I18N && typeof window.GCS_I18N.setLanguage === 'function') {
      window.GCS_I18N.setLanguage(lang);
    } else if (window.I18n && typeof window.I18n.applyLanguage === 'function') {
      window.I18n.applyLanguage(lang);
    } else {
      document.documentElement.lang = lang;
      localStorage.setItem('gcs-lang', lang);
    }

    // Update pill buttons
    const teBtn = document.getElementById('gcsPillTe');
    const enBtn = document.getElementById('gcsPillEn');
    if (teBtn) teBtn.classList.toggle('active', lang === 'te');
    if (enBtn) enBtn.classList.toggle('active', lang === 'en');
  };

  // Auto-inject i18n.js, app.js, and auth.js if not present
  function ensureCoreModules() {
    const isSubdir = window.location.pathname.includes('/admin/');
    const pfx = isSubdir ? '../' : '';

    if (!window.GCS_I18N && !document.querySelector('script[src*="i18n.js"]')) {
      const s1 = document.createElement('script');
      s1.src = pfx + 'assets/i18n.js';
      document.head.appendChild(s1);
    }
    if (!window.GCS_APP && !document.querySelector('script[src*="app.js"]')) {
      const s2 = document.createElement('script');
      s2.src = pfx + 'assets/app.js';
      document.head.appendChild(s2);
    }
    if (!window.GCS_AUTH && !document.querySelector('script[src*="auth.js"]')) {
      const s3 = document.createElement('script');
      s3.src = pfx + 'assets/auth.js';
      document.head.appendChild(s3);
    }
  }

  ensureCoreModules();

  // Listen for language changes from I18n
  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('gcs-lang') || 'te';
    const teBtn = document.getElementById('gcsPillTe');
    const enBtn = document.getElementById('gcsPillEn');
    if (teBtn) teBtn.classList.toggle('active', saved === 'te');
    if (enBtn) enBtn.classList.toggle('active', saved === 'en');
  });

})();
