/**
 * Gramin Career Setu — Advanced Resume Builder & Multi-Template Engine
 * ───────────────────────────────────────────────────────────────────
 * Powers resume.html and resume-preview.html:
 * • 7-step wizard navigation with field validation
 * • Live 2-way data binding to mini A4 preview
 * • 5 distinct, high-impact professional templates
 * • Color theme customization (Emerald, Sapphire, Ruby, Slate, Violet)
 * • Dynamic ATS compatibility & resume score calculator
 * • Profile presets (Ravi Teja / Lalitha Kumari / Ramesh Babu / Blank)
 * • High-fidelity jsPDF export and clean print output
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs_resume_data';
  const TEMPLATE_KEY = 'gcs_resume_template';
  const COLOR_KEY = 'gcs_resume_color';

  // Default demo data (Ravi Teja)
  const DEFAULT_PROFILE = {
    fullName: 'Ravi Teja',
    title: 'Aspiring Software Developer',
    phone: '+91 98765 43210',
    email: 'raviteja@gmail.com',
    address: 'Gudur, Tirupati District, Andhra Pradesh',
    dob: '2002-06-12',
    gender: 'Male',
    linkedIn: 'linkedin.com/in/raviteja',
    github: 'github.com/raviteja',
    objective: 'Passionate and detail-oriented Computer Science graduate with hands-on skills in Java, React, SQL and Web Technologies. Eager to contribute to high-impact projects while enhancing technical proficiencies.',
    education: [
      { degree: 'B.Tech in Computer Science', school: 'Lakireddy Bali Reddy College of Engineering (LBRCE)', year: '2020 – 2024', grade: 'CGPA: 8.45 / 10' },
      { degree: 'Intermediate (MPC)', school: 'Narayana Junior College, Nellore', year: '2018 – 2020', grade: 'Percentage: 92.3%' },
      { degree: 'Secondary School Certificate (SSC)', school: 'Zilla Parishad High School, Gudur', year: '2018', grade: 'GPA: 9.5 / 10' }
    ],
    skills: ['Java', 'Spring Boot', 'React.js', 'JavaScript (ES6)', 'HTML5 & CSS3', 'SQL (MySQL)', 'Git & GitHub', 'RESTful APIs', 'Problem Solving'],
    softSkills: ['Teamwork', 'Communication', 'Adaptability', 'Time Management'],
    languages: [
      { lang: 'Telugu', level: 5 },
      { lang: 'English', level: 4 },
      { lang: 'Hindi', level: 3 }
    ],
    projects: [
      {
        title: 'Student Result & Attendance Portal',
        tech: 'React, Node.js, Express, MongoDB',
        desc: 'Built a full-stack portal used by 800+ rural college students to track marks, semester GPA, and attendance with SMS notifications.'
      },
      {
        title: 'Village Agri-Produce Marketplace',
        tech: 'HTML5, CSS3, JavaScript, LocalStorage PWA',
        desc: 'Designed an offline-first catalog enabling local farmers to list seasonal vegetables and connect directly with town traders.'
      }
    ],
    experience: [
      {
        role: 'Web Development Intern',
        company: 'TechnoHacks Solutions',
        duration: 'June 2023 – Aug 2023',
        desc: 'Developed responsive user interfaces, integrated REST APIs, and reduced page load latency by 28% across mobile devices.'
      }
    ],
    achievements: [
      '1st Prize in State-level Smart Andhra Rural Hackathon 2023',
      'APSSDC Certified Java Full Stack Developer (Grade A)',
      'NPTEL Elite Certificate in Programming in Java'
    ]
  };

  // Alternative presets
  const PRESETS = {
    ravi: DEFAULT_PROFILE,
    lalitha: {
      fullName: 'Lalitha Kumari',
      title: 'Public Administration & Civil Services Aspirant',
      phone: '+91 94401 23456',
      email: 'lalitha.kumari@gmail.com',
      address: 'Penumaka Village, Vijayawada Rural, AP',
      dob: '2001-04-18',
      gender: 'Female',
      linkedIn: 'linkedin.com/in/lalitha-kumari',
      github: '',
      objective: 'Dedicated and ethical graduate seeking an administrative role to leverage analytical, public coordination and documentation abilities for transparent community welfare.',
      education: [
        { degree: 'Bachelor of Arts (Economics & Public Admin)', school: 'Andhra Loyola College, Vijayawada', year: '2019 – 2022', grade: 'Percentage: 86.4%' },
        { degree: 'Intermediate (HEC)', school: 'Government Junior College', year: '2017 – 2019', grade: 'Percentage: 88.0%' }
      ],
      skills: ['Public Policy Analysis', 'Telugu & English Typing', 'MS Office & Excel', 'Documentation', 'AP Secretariat Systems'],
      softSkills: ['Public Speaking', 'Community Empathy', 'Punctuality', 'Leadership'],
      languages: [
        { lang: 'Telugu', level: 5 },
        { lang: 'English', level: 4 }
      ],
      projects: [
        {
          title: 'Village Welfare Scheme Awareness Survey',
          tech: 'Field Research, Google Forms, Data Analysis',
          desc: 'Surveyed 450+ rural households in Penumaka to identify eligibility gaps in state education and financial assistance schemes.'
        }
      ],
      experience: [
        {
          role: 'Volunteer Coordinator',
          company: 'Village Secretariat Assistance Desk',
          duration: 'Jan 2023 – Dec 2023',
          desc: 'Assisted 1,200+ villagers in filling online pension, ration card, and scholarship applications without third-party fees.'
        }
      ],
      achievements: [
        'Cleared APPSC Group II 2023 Prelims Examination',
        'District Level Telugu Elocution Competition Winner'
      ]
    },
    ramesh: {
      fullName: 'Ramesh Naidu',
      title: 'ITI Electrician',
      phone: '+91 90000 00000',
      email: 'ramesh.naidu@example.com',
      address: 'Bukkarayasamudram, Anantapur District, Andhra Pradesh',
      dob: '', gender: 'Male', linkedIn: '', github: '',
      objective: 'ITI-certified electrician with one year of apprenticeship experience in industrial wiring and motor maintenance. Looking for a technician role where I can keep learning on the job.',
      education: [
        { degree: 'ITI — Electrician Trade (NCVT)', school: 'Government ITI, Anantapur', year: '2022 – 2024', grade: 'First Class' },
        { degree: 'SSC (10th Class)', school: 'Zilla Parishad High School, Bukkarayasamudram', year: '2022', grade: 'GPA: 8.2 / 10' }
      ],
      skills: ['Industrial wiring', 'Motor winding & repair', 'Panel board fitting', 'Multimeter testing', 'Electrical safety', 'Blueprint reading'],
      softSkills: ['Punctuality', 'Teamwork', 'Careful work', 'Willing to travel'],
      languages: [ { lang: 'Telugu', level: 5 }, { lang: 'English', level: 2 }, { lang: 'Hindi', level: 2 } ],
      projects: [],
      experience: [
        {
          role: 'Apprentice Electrician (NAPS)',
          company: 'Local engineering workshop, Anantapur',
          duration: '2024 – 2025',
          desc: 'Assisted with motor rewinding, panel wiring and routine maintenance under a senior electrician. Maintained the daily job register.'
        }
      ],
      achievements: ['NCVT Electrician trade certificate', 'Completed one-year apprenticeship under NAPS']
    },
    padma: {
      fullName: 'Padmavathi G',
      title: 'Intermediate pass — preparing for government exams',
      phone: '+91 90000 00000',
      email: 'padmavathi.g@example.com',
      address: 'Nuzvid, Eluru District, Andhra Pradesh',
      dob: '', gender: 'Female', linkedIn: '', github: '',
      objective: 'Intermediate graduate preparing for Railway and SSC examinations, with good typing speed and basic computer skills. Seeking a data entry or office assistant role while continuing exam preparation.',
      education: [
        { degree: 'Intermediate (CEC)', school: 'Government Junior College, Nuzvid', year: '2023 – 2025', grade: 'Percentage: 78%' },
        { degree: 'SSC (10th Class)', school: 'ZP High School, Nuzvid', year: '2023', grade: 'GPA: 8.8 / 10' }
      ],
      skills: ['Telugu & English typing', 'MS Word and Excel basics', 'Data entry', 'Record keeping', 'Customer handling'],
      softSkills: ['Punctuality', 'Patience', 'Clear speaking', 'Learning quickly'],
      languages: [ { lang: 'Telugu', level: 5 }, { lang: 'English', level: 3 } ],
      projects: [],
      experience: [
        {
          role: 'Help desk volunteer',
          company: 'Village Digital Seva centre, Nuzvid',
          duration: '2025',
          desc: 'Helped residents fill online applications for certificates and scholarships, and explained the documents each one needed.'
        }
      ],
      achievements: ['PMGDISHA digital literacy certificate']
    },
    blank: {
      fullName: '',
      title: '',
      phone: '',
      email: '',
      address: '',
      dob: '',
      gender: 'Male',
      linkedIn: '',
      github: '',
      objective: '',
      education: [],
      skills: [],
      softSkills: [],
      languages: [],
      projects: [],
      experience: [],
      achievements: []
    }
  };

  /**
   * Read stored profile or fallback
   */
  function loadProfileData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Start empty: the builder used to open on a filled sample resume,
    // which left students editing someone else's details. Deep-copied so a
    // later edit cannot mutate the shared preset object.
    return JSON.parse(JSON.stringify(PRESETS.blank));
  }

  /**
   * Save profile data
   */
  function saveProfileData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (window.GCS_API && window.GCS_API.resumes) {
        const template = localStorage.getItem('gcs_resume_template') || 'modern';
        window.GCS_API.resumes.save(template, data).catch(e => console.debug('[Resume Engine] remote save:', e));
      }
    } catch (e) {}
  }

  /**
   * Calculate Real Resume Quality & ATS Compatibility Scores
   */
  function computeScores(data) {
    let score = 0;
    let ats = 60; // base

    if (data.fullName && data.fullName.length > 2) score += 15;
    if (data.phone && data.email) score += 15;
    if (data.objective && data.objective.length > 50) {
      score += 15;
      ats += 10;
    }
    if (data.education && data.education.length > 0) {
      score += 15;
      ats += 8;
    }
    if (data.skills && data.skills.length >= 4) {
      score += 15;
      ats += 10;
    }
    if (data.projects && data.projects.length > 0) {
      score += 15;
      ats += 8;
    }
    if (data.experience && data.experience.length > 0) {
      score += 5;
      ats += 4;
    }
    if (data.achievements && data.achievements.length > 0) {
      score += 5;
    }

    return {
      score: Math.min(score, 100),
      ats: Math.min(ats, 98)
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Builder Page (resume.html) Logic
  // ══════════════════════════════════════════════════════════════════════

  function initBuilderPage() {
    const isBuilderPage = window.location.pathname.includes('resume.html') && !window.location.pathname.includes('resume-preview.html');
    if (!isBuilderPage) return;

    let profile = loadProfileData();

    // Bind initial values to inputs
    bindDataToForm(profile);

    // Bind event listeners to wizard step buttons
    setupWizardStepNav();

    // Bind event listeners to template cards
    setupTemplateSelector();

    // Listen to form inputs for live 2-way preview
    setupLiveInputListeners();

    // Render initial live preview & scores
    renderMiniPreview(profile);
    updateScoreMeters(profile);
  }

  /**
   * Setup wizard step navigation — delegates to inline switchResumeStep
   */
  function setupWizardStepNav() {
    // The inline <script> in resume.html defines window.switchResumeStep
    // which toggles fieldset visibility and sidebar active classes.
    // We just ensure step 1 is visible on init.
    if (typeof window.switchResumeStep === 'function') {
      window.switchResumeStep(1);
    }
  }

  /**
   * Render the Column 3 mini A4 preview from profile data
   */
  function renderMiniPreview(profile) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '';
    };
    set('prevName', profile.fullName || 'Your Name');
    set('prevPhone', profile.phone || '+91 00000 00000');
    set('prevEmail', profile.email || 'email@example.com');
    set('prevAddress', profile.address || 'Location');
    set('prevLinkedIn', profile.linkedIn || '');
    set('prevGitHub', profile.github || '');
    set('prevObjective', profile.objective || 'Your career objective will appear here...');
  }

  /**
   * Compute and display real Resume Score and ATS Compatibility
   */
  function updateScoreMeters(profile) {
    const { score, ats } = computeScores(profile);

    // Builder page score circles
    const scoreEl = document.getElementById('builderScoreValue');
    if (scoreEl) {
      scoreEl.innerHTML = `${score}<span style="font-size: var(--text-xs); color: #64748B;">/100</span>`;
    }
    const atsEl = document.getElementById('builderAtsValue');
    if (atsEl) {
      atsEl.textContent = `${ats}%`;
    }

    // Preview page score circles
    const prevScore = document.getElementById('previewScoreValue');
    if (prevScore) {
      prevScore.innerHTML = `${score}<span style="font-size: var(--text-xs); color: #64748B;">/100</span>`;
    }
    const prevAts = document.getElementById('previewAtsValue');
    if (prevAts) {
      prevAts.textContent = `${ats}%`;
    }

    // Update labels
    const labels = [
      { min: 0, text: 'Needs Work' },
      { min: 40, text: 'Getting There' },
      { min: 60, text: 'Good Score' },
      { min: 80, text: 'Great Score!' },
      { min: 95, text: 'Excellent!' }
    ];
    const label = labels.reduce((acc, l) => score >= l.min ? l.text : acc, 'Needs Work');

    const scoreLabelEls = document.querySelectorAll('#builderScoreValue ~ div h3, #previewScoreValue ~ div div:first-child');
    scoreLabelEls.forEach(el => { if (el) el.textContent = label; });
  }

  /**
   * Live input listeners — event delegation on the form for auto-save
   */
  function setupLiveInputListeners() {
    const form = document.getElementById('resumeForm');
    if (!form || form._gcsListenerBound) return;
    form._gcsListenerBound = true;

    let saveTimer = null;
    form.addEventListener('input', () => {
      // Debounce saves to avoid excessive localStorage writes
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const profile = getFormData();
        saveProfileData(profile);
        renderMiniPreview(profile);
        updateScoreMeters(profile);
      }, 300);
    });
  }

  /**
   * Called by inline switchResumeStep on every step change
   */
  function onStepSwitch() {
    const profile = getFormData();
    saveProfileData(profile);
    renderMiniPreview(profile);
    updateScoreMeters(profile);
  }

  function bindDataToForm(data) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('inputFullName', data.fullName);
    setVal('inputTitle', data.title);
    setVal('inputPhone', data.phone);
    setVal('inputEmail', data.email);
    setVal('inputAddress', data.address);
    setVal('inputDob', data.dob);
    setVal('inputGender', data.gender || 'Male');
    setVal('inputLinkedIn', data.linkedIn);
    setVal('inputGitHub', data.github);
    // Keep the stored/preset value consistent with the 200-character field limit.
    const objective = String(data.objective || '').slice(0, 200);
    setVal('inputObjective', objective);

    const charCounter = document.getElementById('charCount');
    if (charCounter) {
      charCounter.textContent = `${objective.length}/200`;
    }

    // Skills, soft skills, languages
    if (data.skills) setVal('inputSkills', data.skills.join(', '));
    if (data.softSkills) setVal('inputSoftSkills', data.softSkills.join(', '));
    if (data.languages) {
      setVal('inputLanguages', data.languages.map(l => typeof l === 'string' ? l : l.lang).join(', '));
    }

    // Achievements
    if (data.achievements) setVal('inputAchievements', data.achievements.join('\n'));

    // Repeatable dynamic lists
    renderEducationRows(data.education);
    renderProjectsRows(data.projects);
    renderExperienceRows(data.experience);
  }

  function getFormData() {
    const profile = loadProfileData();
    const getVal = (id) => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
    const hasEl = (id) => !!document.getElementById(id);

    // Direct assignment - ensures clearing field saves empty string, not fallback
    if (hasEl('inputFullName')) profile.fullName = getVal('inputFullName');
    if (hasEl('inputTitle')) profile.title = getVal('inputTitle');
    if (hasEl('inputPhone')) profile.phone = getVal('inputPhone');
    if (hasEl('inputEmail')) profile.email = getVal('inputEmail');
    if (hasEl('inputAddress')) profile.address = getVal('inputAddress');
    if (hasEl('inputDob')) profile.dob = getVal('inputDob');
    if (hasEl('inputGender')) profile.gender = getVal('inputGender');
    if (hasEl('inputLinkedIn')) profile.linkedIn = getVal('inputLinkedIn');
    if (hasEl('inputGitHub')) profile.github = getVal('inputGitHub');
    if (hasEl('inputObjective')) profile.objective = getVal('inputObjective');

    // Education repeatable rows
    const eduRows = document.querySelectorAll('.education-row-item');
    if (eduRows.length > 0) {
      profile.education = Array.from(eduRows).map(row => ({
        degree: row.querySelector('.edu-degree')?.value.trim() || '',
        school: row.querySelector('.edu-school')?.value.trim() || '',
        year: row.querySelector('.edu-year')?.value.trim() || '',
        grade: row.querySelector('.edu-grade')?.value.trim() || ''
      })).filter(e => e.degree || e.school);
    }

    // Skills
    if (hasEl('inputSkills')) {
      const rawSkills = getVal('inputSkills');
      profile.skills = rawSkills ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
    if (hasEl('inputSoftSkills')) {
      const rawSoft = getVal('inputSoftSkills');
      profile.softSkills = rawSoft ? rawSoft.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
    if (hasEl('inputLanguages')) {
      const rawLangs = getVal('inputLanguages');
      profile.languages = rawLangs ? rawLangs.split(',').map(s => ({ lang: s.trim(), level: 5 })).filter(l => l.lang) : [];
    }

    // Projects repeatable rows
    const projRows = document.querySelectorAll('.project-row-item');
    if (projRows.length > 0) {
      profile.projects = Array.from(projRows).map(row => ({
        title: row.querySelector('.proj-title')?.value.trim() || '',
        tech: row.querySelector('.proj-tech')?.value.trim() || '',
        desc: row.querySelector('.proj-desc')?.value.trim() || ''
      })).filter(p => p.title);
    }

    // Experience repeatable rows
    const expRows = document.querySelectorAll('.experience-row-item');
    if (expRows.length > 0) {
      profile.experience = Array.from(expRows).map(row => ({
        role: row.querySelector('.exp-role')?.value.trim() || '',
        company: row.querySelector('.exp-company')?.value.trim() || '',
        duration: row.querySelector('.exp-duration')?.value.trim() || '',
        desc: row.querySelector('.exp-desc')?.value.trim() || ''
      })).filter(x => x.role || x.company);
    }

    // Achievements
    if (hasEl('inputAchievements')) {
      const rawAch = getVal('inputAchievements');
      profile.achievements = rawAch ? rawAch.split('\n').map(a => a.trim()).filter(Boolean) : [];
    }

    return profile;
  }

  function renderEducationRows(educationList) {
    const container = document.getElementById('educationContainer');
    if (!container) return;
    container.innerHTML = '';
    (educationList || []).forEach((edu, idx) => {
      const div = document.createElement('div');
      div.className = 'education-row-item';
      div.style.background = '#F8FAFC';
      div.style.border = '1px solid #E2E8F0';
      div.style.borderRadius = '10px';
      div.style.padding = '14px';
      div.style.position = 'relative';

      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: var(--text-sm); font-weight: 700; color: #475569;">Qualification #${idx + 1}</span>
          <button type="button" onclick="window.removeEducationRow(${idx})" style="background: none; border: none; cursor: pointer; color: #EF4444; font-size: var(--text-sm); display: flex; align-items: center; gap: 2px;">
            <span class="material-symbols-outlined" style="font-size: var(--text-base);">delete</span>
            <span>Remove</span>
          </button>
        </div>
        <div class="gcs-form-row-2">
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Degree / Diploma / SSC</label>
            <input type="text" class="gcs-form-input edu-degree" value="${escapeHtml(edu?.degree || '')}" placeholder="e.g. B.Tech in CSE" />
          </div>
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">School / College</label>
            <input type="text" class="gcs-form-input edu-school" value="${escapeHtml(edu?.school || '')}" placeholder="e.g. LBRCE / Govt Junior College" />
          </div>
        </div>
        <div class="gcs-form-row-2">
          <div class="gcs-form-group" style="margin-bottom: 0;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Year / Duration</label>
            <input type="text" class="gcs-form-input edu-year" value="${escapeHtml(edu?.year || '')}" placeholder="e.g. 2020 – 2024" />
          </div>
          <div class="gcs-form-group" style="margin-bottom: 0;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Grade / Percentage / CGPA</label>
            <input type="text" class="gcs-form-input edu-grade" value="${escapeHtml(edu?.grade || '')}" placeholder="e.g. CGPA: 8.45 / 85%" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    setupLiveInputListeners();
  }

  function renderProjectsRows(projectsList) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    container.innerHTML = '';
    (projectsList || []).forEach((proj, idx) => {
      const div = document.createElement('div');
      div.className = 'project-row-item';
      div.style.background = '#F8FAFC';
      div.style.border = '1px solid #E2E8F0';
      div.style.borderRadius = '10px';
      div.style.padding = '14px';
      div.style.position = 'relative';

      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: var(--text-sm); font-weight: 700; color: #475569;">Project #${idx + 1}</span>
          <button type="button" onclick="window.removeProjectRow(${idx})" style="background: none; border: none; cursor: pointer; color: #EF4444; font-size: var(--text-sm); display: flex; align-items: center; gap: 2px;">
            <span class="material-symbols-outlined" style="font-size: var(--text-base);">delete</span>
            <span>Remove</span>
          </button>
        </div>
        <div class="gcs-form-row-2">
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Project Title</label>
            <input type="text" class="gcs-form-input proj-title" value="${escapeHtml(proj?.title || '')}" placeholder="e.g. Student Portal" />
          </div>
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Technologies Used</label>
            <input type="text" class="gcs-form-input proj-tech" value="${escapeHtml(proj?.tech || '')}" placeholder="e.g. React, Node.js, SQL" />
          </div>
        </div>
        <div class="gcs-form-group" style="margin-bottom: 0;">
          <label class="gcs-form-label" style="font-size: var(--text-sm);">Description & Impact</label>
          <textarea class="gcs-form-textarea proj-desc" rows="2" placeholder="Brief summary of what the project does...">${escapeHtml(proj?.desc || '')}</textarea>
        </div>
      `;
      container.appendChild(div);
    });
    setupLiveInputListeners();
  }

  function renderExperienceRows(expList) {
    const container = document.getElementById('experienceContainer');
    if (!container) return;
    container.innerHTML = '';
    (expList || []).forEach((exp, idx) => {
      const div = document.createElement('div');
      div.className = 'experience-row-item';
      div.style.background = '#F8FAFC';
      div.style.border = '1px solid #E2E8F0';
      div.style.borderRadius = '10px';
      div.style.padding = '14px';
      div.style.position = 'relative';

      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: var(--text-sm); font-weight: 700; color: #475569;">Experience #${idx + 1}</span>
          <button type="button" onclick="window.removeExperienceRow(${idx})" style="background: none; border: none; cursor: pointer; color: #EF4444; font-size: var(--text-sm); display: flex; align-items: center; gap: 2px;">
            <span class="material-symbols-outlined" style="font-size: var(--text-base);">delete</span>
            <span>Remove</span>
          </button>
        </div>
        <div class="gcs-form-row-2">
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Job Title / Role</label>
            <input type="text" class="gcs-form-input exp-role" value="${escapeHtml(exp?.role || '')}" placeholder="e.g. Web Development Intern" />
          </div>
          <div class="gcs-form-group" style="margin-bottom: 8px;">
            <label class="gcs-form-label" style="font-size: var(--text-sm);">Organization / Company</label>
            <input type="text" class="gcs-form-input exp-company" value="${escapeHtml(exp?.company || '')}" placeholder="e.g. TechnoHacks Solutions" />
          </div>
        </div>
        <div class="gcs-form-group" style="margin-bottom: 8px;">
          <label class="gcs-form-label" style="font-size: var(--text-sm);">Duration</label>
          <input type="text" class="gcs-form-input exp-duration" value="${escapeHtml(exp?.duration || '')}" placeholder="e.g. June 2023 – August 2023" />
        </div>
        <div class="gcs-form-group" style="margin-bottom: 0;">
          <label class="gcs-form-label" style="font-size: var(--text-sm);">Responsibilities / Accomplishments</label>
          <textarea class="gcs-form-textarea exp-desc" rows="2" placeholder="Brief summary of duties and impact...">${escapeHtml(exp?.desc || '')}</textarea>
        </div>
      `;
      container.appendChild(div);
    });
    setupLiveInputListeners();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.addEducationRow = function(edu) {
    const profile = loadProfileData();
    profile.education = profile.education || [];
    profile.education.push(edu || { degree: '', school: '', year: '', grade: '' });
    saveProfileData(profile);
    renderEducationRows(profile.education);
  };

  window.removeEducationRow = function(idx) {
    const profile = loadProfileData();
    if (profile.education && profile.education.length > idx) {
      profile.education.splice(idx, 1);
      saveProfileData(profile);
      renderEducationRows(profile.education);
      renderMiniPreview(profile);
      updateScoreMeters(profile);
    }
  };

  window.addProjectRow = function(proj) {
    const profile = loadProfileData();
    profile.projects = profile.projects || [];
    profile.projects.push(proj || { title: '', tech: '', desc: '' });
    saveProfileData(profile);
    renderProjectsRows(profile.projects);
  };

  window.removeProjectRow = function(idx) {
    const profile = loadProfileData();
    if (profile.projects && profile.projects.length > idx) {
      profile.projects.splice(idx, 1);
      saveProfileData(profile);
      renderProjectsRows(profile.projects);
      renderMiniPreview(profile);
      updateScoreMeters(profile);
    }
  };

  window.addExperienceRow = function(exp) {
    const profile = loadProfileData();
    profile.experience = profile.experience || [];
    profile.experience.push(exp || { role: '', company: '', duration: '', desc: '' });
    saveProfileData(profile);
    renderExperienceRows(profile.experience);
  };

  window.removeExperienceRow = function(idx) {
    const profile = loadProfileData();
    if (profile.experience && profile.experience.length > idx) {
      profile.experience.splice(idx, 1);
      saveProfileData(profile);
      renderExperienceRows(profile.experience);
      renderMiniPreview(profile);
      updateScoreMeters(profile);
    }
  };


  function setupTemplateSelector() {
    const templateCards = document.querySelectorAll('.gcs-template-card-item');
    const selectedTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern';

    templateCards.forEach((card, index) => {
      const templateNames = ['modern', 'executive', 'creative', 'minimal', 'classic'];
      const templateId = templateNames[index] || 'modern';

      if (templateId === selectedTemplate) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }

      card.addEventListener('click', () => {
        templateCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        localStorage.setItem(TEMPLATE_KEY, templateId);

        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`🎨 Template changed to: ${templateId.toUpperCase()}`);
        }
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Preview Page (resume-preview.html) Logic
  // ══════════════════════════════════════════════════════════════════════

  function initPreviewPage() {
    const isPreviewPage = window.location.pathname.includes('resume-preview.html');
    if (!isPreviewPage) return;

    const profile = loadProfileData();
    const activeTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern';
    const activeColor = localStorage.getItem(COLOR_KEY) || '#1B4D3E';

    // Apply color theme to root
    applyColorTheme(activeColor);

    // Render full printable resume
    renderFullResume(profile, activeTemplate);

    // Update score meters on preview page
    updateScoreMeters(profile);

    // Setup action buttons
    setupPreviewControls();
  }

  function applyColorTheme(colorHex) {
    document.documentElement.style.setProperty('--resume-primary', colorHex);
    document.documentElement.style.setProperty('--resume-accent', colorHex);
    localStorage.setItem(COLOR_KEY, colorHex);
  }

  function renderFullResume(profile, templateId) {
    const resumeContainer = document.getElementById('a4ResumeSheet') || document.querySelector('.gcs-printable-resume, aside.gcs-printable-resume, .gcs-resume-sheet');
    if (!resumeContainer) return;

    profile = profile || {};
    const safeEducation = profile.education || [];
    const safeSkills = profile.skills || [];
    const safeSoftSkills = profile.softSkills || [];
    const safeLanguages = (profile.languages || []).map(l => typeof l === 'string' ? l : l.lang || '');
    const safeProjects = profile.projects || [];
    const safeExperience = profile.experience || [];
    const safeAchievements = profile.achievements || [];

    // Reset template classes
    resumeContainer.className = `gcs-printable-resume resume-template-${templateId}`;

    if (templateId === 'minimal') {
      // Clean Single-Column ATS layout
      resumeContainer.innerHTML = `
        <div class="resume-min-header">
          <h1 style="font-size: var(--text-3xl); font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">${escapeHtml(profile.fullName || 'Professional Resume')}</h1>
          <div style="font-size: var(--text-base); color: var(--resume-primary); font-weight: 700; margin-bottom: 8px;">${escapeHtml(profile.title || '')}</div>
          <div style="font-size: var(--text-sm); color: #475569; display: flex; gap: 16px; flex-wrap: wrap;">
            ${profile.address ? `<span>📍 ${escapeHtml(profile.address)}</span>` : ''}
            ${profile.phone ? `<span>📱 ${escapeHtml(profile.phone)}</span>` : ''}
            ${profile.email ? `<span>✉️ ${escapeHtml(profile.email)}</span>` : ''}
            ${profile.linkedIn ? `<span>🔗 ${escapeHtml(profile.linkedIn)}</span>` : ''}
            ${profile.github ? `<span>💻 ${escapeHtml(profile.github)}</span>` : ''}
          </div>
        </div>

        ${profile.objective ? `
        <div class="resume-min-section">
          <h3>Career Objective</h3>
          <p style="font-size: var(--text-base); color: #334155; line-height: 1.6; margin: 0;">${escapeHtml(profile.objective)}</p>
        </div>` : ''}

        ${safeSkills.length > 0 || safeSoftSkills.length > 0 ? `
        <div class="resume-min-section">
          <h3>Technical &amp; Key Skills</h3>
          <div style="font-size: var(--text-base); color: #334155; line-height: 1.6;">
            ${safeSkills.length > 0 ? `<strong>Core Skills:</strong> ${safeSkills.map(s => escapeHtml(s)).join(', ')}<br />` : ''}
            ${safeSoftSkills.length > 0 ? `<strong>Soft Skills:</strong> ${safeSoftSkills.map(s => escapeHtml(s)).join(', ')}` : ''}
          </div>
        </div>` : ''}

        ${safeEducation.length > 0 ? `
        <div class="resume-min-section">
          <h3>Education</h3>
          ${safeEducation.map(e => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; font-size: var(--text-base);">
                <span>${escapeHtml(e.degree || '')}</span>
                <span style="color: #64748B;">${escapeHtml(e.year || '')}</span>
              </div>
              <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(e.school || '')}${e.grade ? ' • <strong>' + escapeHtml(e.grade) + '</strong>' : ''}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeProjects.length > 0 ? `
        <div class="resume-min-section">
          <h3>Key Projects</h3>
          ${safeProjects.map(p => `
            <div style="margin-bottom: 12px;">
              <div style="font-weight: 700; color: #0F172A; font-size: var(--text-base);">${escapeHtml(p.title || '')}${p.tech ? ' <span style="font-weight: 500; font-size: var(--text-sm); color: var(--resume-primary);">(' + escapeHtml(p.tech) + ')</span>' : ''}</div>
              <div style="font-size: var(--text-sm); color: #475569; line-height: 1.5;">${escapeHtml(p.desc || '')}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeExperience.length > 0 ? `
        <div class="resume-min-section">
          <h3>Experience &amp; Internships</h3>
          ${safeExperience.map(x => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; font-size: var(--text-base);">
                <span>${escapeHtml(x.role || '')}${x.company ? ' — ' + escapeHtml(x.company) : ''}</span>
                <span style="color: #64748B;">${escapeHtml(x.duration || '')}</span>
              </div>
              <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(x.desc || '')}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeAchievements.length > 0 ? `
        <div class="resume-min-section">
          <h3>Certifications &amp; Achievements</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: var(--text-sm); color: #334155; line-height: 1.6;">
            ${safeAchievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
          </ul>
        </div>` : ''}
      `;
    } else if (templateId === 'classic') {
      // Classic Ivy Academic Layout (Serif)
      resumeContainer.innerHTML = `
        <div class="resume-classic-header">
          <h1 style="font-size: var(--text-3xl); font-weight: 700; margin: 0 0 4px 0; color: #111827; letter-spacing: 0.02em;">${escapeHtml(profile.fullName || 'Professional Resume')}</h1>
          <div style="font-size: var(--text-base); font-style: italic; color: var(--resume-primary); margin-bottom: 8px;">${escapeHtml(profile.title || '')}</div>
          <div style="font-size: var(--text-sm); color: #374151; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            ${profile.address ? `<span>${escapeHtml(profile.address)}</span>` : ''}
            ${profile.phone ? `<span>• Tel: ${escapeHtml(profile.phone)}</span>` : ''}
            ${profile.email ? `<span>• Email: ${escapeHtml(profile.email)}</span>` : ''}
            ${profile.linkedIn ? `<span>• LinkedIn: ${escapeHtml(profile.linkedIn)}</span>` : ''}
          </div>
        </div>

        ${profile.objective ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 8px;">Career Objective</h3>
          <p style="font-size: var(--text-base); color: #1F2937; line-height: 1.6; margin: 0;">${escapeHtml(profile.objective)}</p>
        </div>` : ''}

        ${safeEducation.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 10px;">Education</h3>
          ${safeEducation.map(e => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: var(--text-base); color: #111827;">
                <span>${escapeHtml(e.degree || '')}</span>
                <span style="font-style: italic; color: #4B5563;">${escapeHtml(e.year || '')}</span>
              </div>
              <div style="font-size: var(--text-sm); color: #374151;">${escapeHtml(e.school || '')}${e.grade ? ' — ' + escapeHtml(e.grade) : ''}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeExperience.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 10px;">Professional Experience</h3>
          ${safeExperience.map(x => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: var(--text-base); color: #111827;">
                <span>${escapeHtml(x.role || '')}${x.company ? ', ' + escapeHtml(x.company) : ''}</span>
                <span style="font-style: italic; color: #4B5563;">${escapeHtml(x.duration || '')}</span>
              </div>
              <div style="font-size: var(--text-sm); color: #374151; margin-top: 2px;">${escapeHtml(x.desc || '')}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeProjects.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 10px;">Key Projects</h3>
          ${safeProjects.map(p => `
            <div style="margin-bottom: 10px;">
              <div style="font-weight: 700; font-size: var(--text-base); color: #111827;">${escapeHtml(p.title || '')}${p.tech ? ' <em>(' + escapeHtml(p.tech) + ')</em>' : ''}</div>
              <div style="font-size: var(--text-sm); color: #374151;">${escapeHtml(p.desc || '')}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${safeSkills.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 8px;">Skills &amp; Competencies</h3>
          <div style="font-size: var(--text-sm); color: #1F2937; line-height: 1.6;">
            <strong>Skills:</strong> ${safeSkills.map(s => escapeHtml(s)).join(', ')}<br />
            ${safeSoftSkills.length > 0 ? `<strong>Attributes:</strong> ${safeSoftSkills.map(s => escapeHtml(s)).join(', ')}<br />` : ''}
            ${safeLanguages.length > 0 ? `<strong>Languages:</strong> ${safeLanguages.map(l => escapeHtml(l)).join(', ')}` : ''}
          </div>
        </div>` : ''}

        ${safeAchievements.length > 0 ? `
        <div>
          <h3 style="font-size: var(--text-lg); font-variant: small-caps; color: var(--resume-primary); border-bottom: 1px solid #9CA3AF; padding-bottom: 2px; margin-bottom: 8px;">Honors &amp; Certifications</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: var(--text-sm); color: #1F2937; line-height: 1.6;">
            ${safeAchievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
          </ul>
        </div>` : ''}
      `;
    } else if (templateId === 'executive') {
      // Executive Sapphire Corporate Layout
      resumeContainer.innerHTML = `
        <div class="resume-exec-header">
          <div>
            <h1 style="font-size: var(--text-2xl); font-weight: 800; margin: 0 0 4px 0; color: #ffffff;">${escapeHtml(profile.fullName || 'Professional Resume')}</h1>
            <div style="font-size: var(--text-base); color: rgba(255,255,255,0.88); font-weight: 600;">${escapeHtml(profile.title || '')}</div>
          </div>
          <div style="font-size: var(--text-sm); text-align: right; color: rgba(255,255,255,0.92); line-height: 1.6;">
            ${profile.phone ? `<div>📱 ${escapeHtml(profile.phone)}</div>` : ''}
            ${profile.email ? `<div>✉️ ${escapeHtml(profile.email)}</div>` : ''}
            ${profile.address ? `<div>📍 ${escapeHtml(profile.address)}</div>` : ''}
            ${profile.linkedIn ? `<div>🔗 ${escapeHtml(profile.linkedIn)}</div>` : ''}
          </div>
        </div>

        <div class="resume-exec-body">
          <div class="resume-exec-main">
            ${profile.objective ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Executive Summary</h3>
              <p style="font-size: var(--text-sm); color: #334155; line-height: 1.6; margin: 0;">${escapeHtml(profile.objective)}</p>
            </div>` : ''}

            ${safeExperience.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Experience</h3>
              ${safeExperience.map(x => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                    <span>${escapeHtml(x.role || '')}${x.company ? ' — ' + escapeHtml(x.company) : ''}</span>
                    <span style="color: #64748B; font-weight: 600;">${escapeHtml(x.duration || '')}</span>
                  </div>
                  <div style="font-size: var(--text-sm); color: #475569; margin-top: 2px; line-height: 1.5;">${escapeHtml(x.desc || '')}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${safeProjects.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Projects &amp; Initiatives</h3>
              ${safeProjects.map(p => `
                <div style="margin-bottom: 12px;">
                  <div style="font-weight: 800; font-size: var(--text-base); color: #0F172A;">${escapeHtml(p.title || '')}${p.tech ? ' <span style="font-size: var(--text-xs); color: var(--resume-primary); font-weight: 600;">(' + escapeHtml(p.tech) + ')</span>' : ''}</div>
                  <div style="font-size: var(--text-sm); color: #475569; line-height: 1.5;">${escapeHtml(p.desc || '')}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${safeEducation.length > 0 ? `
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Education</h3>
              ${safeEducation.map(e => `
                <div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                    <span>${escapeHtml(e.degree || '')}</span>
                    <span style="color: #64748B; font-weight: 600;">${escapeHtml(e.year || '')}</span>
                  </div>
                  <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(e.school || '')}${e.grade ? ' • <strong>' + escapeHtml(e.grade) + '</strong>' : ''}</div>
                </div>
              `).join('')}
            </div>` : ''}
          </div>

          <div class="resume-exec-side">
            ${safeSkills.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 4px;">Core Skills</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${safeSkills.map(s => `<span style="background: #F1F5F9; color: #0F172A; padding: 3px 8px; border-radius: 4px; font-size: var(--text-xs); font-weight: 600;">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>` : ''}

            ${safeSoftSkills.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 4px;">Competencies</h3>
              <div style="font-size: var(--text-sm); color: #334155; line-height: 1.7;">
                ${safeSoftSkills.map(s => `<div>• ${escapeHtml(s)}</div>`).join('')}
              </div>
            </div>` : ''}

            ${safeLanguages.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 4px;">Languages</h3>
              <div style="font-size: var(--text-sm); color: #334155; line-height: 1.7;">
                ${safeLanguages.map(l => `<div>• ${escapeHtml(l)}</div>`).join('')}
              </div>
            </div>` : ''}

            ${safeAchievements.length > 0 ? `
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--resume-primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 4px;">Achievements</h3>
              <ul style="margin: 0; padding-left: 16px; font-size: var(--text-sm); color: #334155; line-height: 1.5;">
                ${safeAchievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
              </ul>
            </div>` : ''}
          </div>
        </div>
      `;
    } else if (templateId === 'creative') {
      // Creative Tech Dark Sidebar
      const initial = (profile.fullName || 'U').charAt(0).toUpperCase();
      resumeContainer.innerHTML = `
        <div class="resume-left-pane">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--resume-accent); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: var(--text-2xl); font-weight: 800; margin: 0 auto 12px; border: 3px solid rgba(255,255,255,0.2);">
              ${escapeHtml(initial)}
            </div>
            <h2 style="font-size: var(--text-xl); font-weight: 800; color: #FFFFFF; margin: 0 0 4px 0;">${escapeHtml(profile.fullName || 'Your Name')}</h2>
            <div style="font-size: var(--text-sm); color: var(--resume-accent); font-weight: 600;">${escapeHtml(profile.title || '')}</div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Contact</div>
            <div style="font-size: var(--text-xs); color: #E2E8F0; display: flex; flex-direction: column; gap: 6px;">
              ${profile.phone ? `<div>📱 ${escapeHtml(profile.phone)}</div>` : ''}
              ${profile.email ? `<div>✉️ ${escapeHtml(profile.email)}</div>` : ''}
              ${profile.address ? `<div>📍 ${escapeHtml(profile.address)}</div>` : ''}
              ${profile.linkedIn ? `<div>🔗 ${escapeHtml(profile.linkedIn)}</div>` : ''}
              ${profile.github ? `<div>💻 ${escapeHtml(profile.github)}</div>` : ''}
            </div>
          </div>

          ${safeSkills.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Technical Stack</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${safeSkills.slice(0, 7).map(s => `
                <div>
                  <div style="font-size: var(--text-xs); color: #FFFFFF; margin-bottom: 2px;">${escapeHtml(s)}</div>
                  <div style="height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                    <div style="width: 85%; height: 100%; background: var(--resume-accent);"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${safeLanguages.length > 0 ? `
          <div>
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Languages</div>
            <div style="font-size: var(--text-xs); color: #E2E8F0; display: flex; flex-direction: column; gap: 6px;">
              ${safeLanguages.map(l => `<div>• ${escapeHtml(l)}</div>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <div class="resume-right-pane">
          ${profile.objective ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0 0 6px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">About Me</h3>
            <p style="font-size: var(--text-sm); color: #334155; line-height: 1.6; margin: 0;">${escapeHtml(profile.objective)}</p>
          </div>` : ''}

          ${safeProjects.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Featured Projects</h3>
            ${safeProjects.map(p => `
              <div style="margin-bottom: 10px; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px;">
                <div style="font-weight: 800; font-size: var(--text-base); color: #0F172A;">${escapeHtml(p.title || '')}${p.tech ? ' <span style="font-size: var(--text-xs); color: var(--resume-accent); font-weight: 600;">| ' + escapeHtml(p.tech) + '</span>' : ''}</div>
                <div style="font-size: var(--text-sm); color: #475569; line-height: 1.5; margin-top: 2px;">${escapeHtml(p.desc || '')}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeExperience.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Work &amp; Internships</h3>
            ${safeExperience.map(x => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                  <span>${escapeHtml(x.role || '')}${x.company ? ' — ' + escapeHtml(x.company) : ''}</span>
                  <span style="color: #64748B; font-weight: 600;">${escapeHtml(x.duration || '')}</span>
                </div>
                <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(x.desc || '')}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeEducation.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Education</h3>
            ${safeEducation.map(e => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                  <span>${escapeHtml(e.degree || '')}</span>
                  <span style="color: #64748B; font-weight: 600;">${escapeHtml(e.year || '')}</span>
                </div>
                <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(e.school || '')}${e.grade ? ' • <span style="color: var(--resume-accent); font-weight: 700;">' + escapeHtml(e.grade) + '</span>' : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeAchievements.length > 0 ? `
          <div>
            <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0 0 10px 0; border-bottom: 2px solid var(--resume-accent); padding-bottom: 4px;">Certifications &amp; Achievements</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: var(--text-sm); color: #334155; line-height: 1.6;">
              ${safeAchievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      `;
    } else {
      // Default / Modern Dual-Column layout
      const initial = (profile.fullName || 'U').charAt(0).toUpperCase();
      resumeContainer.innerHTML = `
        <div class="resume-left-pane">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: rgba(255,255,255,0.2); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: var(--text-2xl); font-weight: 800; margin: 0 auto 12px; border: 2px solid #FFFFFF;">
              ${escapeHtml(initial)}
            </div>
            <h2 style="font-size: var(--text-xl); font-weight: 800; color: #FFFFFF; margin: 0 0 4px 0;">${escapeHtml(profile.fullName || 'Your Name')}</h2>
            <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.85);">${escapeHtml(profile.title || '')}</div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Contact</div>
            <div style="font-size: var(--text-xs); color: #FFFFFF; display: flex; flex-direction: column; gap: 6px;">
              ${profile.phone ? `<div>📱 ${escapeHtml(profile.phone)}</div>` : ''}
              ${profile.email ? `<div>✉️ ${escapeHtml(profile.email)}</div>` : ''}
              ${profile.address ? `<div>📍 ${escapeHtml(profile.address)}</div>` : ''}
              ${profile.linkedIn ? `<div>🔗 ${escapeHtml(profile.linkedIn)}</div>` : ''}
              ${profile.github ? `<div>💻 ${escapeHtml(profile.github)}</div>` : ''}
            </div>
          </div>

          ${safeSkills.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Skills</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${safeSkills.slice(0, 6).map(s => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); color: #FFFFFF; margin-bottom: 2px;">
                    <span>${escapeHtml(s)}</span>
                    <span>85%</span>
                  </div>
                  <div style="height: 4px; background: rgba(255,255,255,0.25); border-radius: 2px; overflow: hidden;">
                    <div style="width: 85%; height: 100%; background: #34D399;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${safeLanguages.length > 0 ? `
          <div>
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Languages</div>
            <div style="font-size: var(--text-xs); color: #FFFFFF; display: flex; flex-direction: column; gap: 6px;">
              ${safeLanguages.map(l => `<div>• ${escapeHtml(l)}</div>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <div class="resume-right-pane">
          ${profile.objective ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--resume-primary); margin: 0 0 6px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Career Objective</h3>
            <p style="font-size: var(--text-sm); color: #334155; line-height: 1.6; margin: 0;">${escapeHtml(profile.objective)}</p>
          </div>` : ''}

          ${safeEducation.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Education</h3>
            ${safeEducation.map(e => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                  <span>${escapeHtml(e.degree || '')}</span>
                  <span style="color: #64748B; font-weight: 600;">${escapeHtml(e.year || '')}</span>
                </div>
                <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(e.school || '')}${e.grade ? ' • <span style="color: var(--resume-primary); font-weight: 700;">' + escapeHtml(e.grade) + '</span>' : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeProjects.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Projects</h3>
            ${safeProjects.map(p => `
              <div style="margin-bottom: 10px;">
                <div style="font-weight: 800; font-size: var(--text-base); color: #0F172A;">${escapeHtml(p.title || '')}${p.tech ? ' <span style="font-size: var(--text-xs); color: #64748B; font-weight: 600;">| ' + escapeHtml(p.tech) + '</span>' : ''}</div>
                <div style="font-size: var(--text-sm); color: #475569; line-height: 1.5;">${escapeHtml(p.desc || '')}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeExperience.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Experience / Internship</h3>
            ${safeExperience.map(x => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: var(--text-base); color: #0F172A;">
                  <span>${escapeHtml(x.role || '')}${x.company ? ' — ' + escapeHtml(x.company) : ''}</span>
                  <span style="color: #64748B; font-weight: 600;">${escapeHtml(x.duration || '')}</span>
                </div>
                <div style="font-size: var(--text-sm); color: #475569;">${escapeHtml(x.desc || '')}</div>
              </div>
            `).join('')}
          </div>` : ''}

          ${safeAchievements.length > 0 ? `
          <div>
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Certifications</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: var(--text-sm); color: #334155; line-height: 1.6;">
              ${safeAchievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      `;
    }
  }

  function setupPreviewControls() {
    // Template Selector Dropdown
    const templateSelect = document.getElementById('previewTemplateSelect');
    if (templateSelect) {
      templateSelect.value = localStorage.getItem(TEMPLATE_KEY) || 'modern';
      templateSelect.addEventListener('change', () => {
        const newTemplate = templateSelect.value;
        localStorage.setItem(TEMPLATE_KEY, newTemplate);
        renderFullResume(loadProfileData(), newTemplate);
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`Template switched to: ${newTemplate.toUpperCase()}`);
        }
      });
    }

    // Color Swatches
    const colorSwatches = document.querySelectorAll('.color-swatch-btn');
    colorSwatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color') || '#1B4D3E';
        applyColorTheme(color);
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`🎨 Color theme updated!`);
        }
      });
    });

    // Check ATS Score Button
    const atsBtn = document.getElementById('btnCheckATS');
    if (atsBtn) {
      atsBtn.onclick = () => {
        const profile = loadProfileData();
        const { score, ats } = computeScores(profile);
        const report = `📊 ATS Analysis Report:\n• ATS Compatibility: ${ats}%\n• Resume Score: ${score}/100\n• Keywords: ${profile.skills ? profile.skills.length : 0} skills listed\n• Format: Standard A4 single/dual-column layout compatible with major ATS parsers.`;
        if (window.GCS_ACTIONS && window.GCS_ACTIONS.showSteps) {
          // showSteps is what actions.js actually exposes; openInfoDialog
          // never existed, so this always fell through to a one-line toast.
          window.GCS_ACTIONS.showSteps('ATS Analysis Report', report.split('\n\u2022 ').slice(1));
        } else if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`ATS: ${ats}% • Score: ${score}/100`);
        } else {
          alert(report);
        }
      };
    }

    // Download PDF Button
    const downloadPdfBtns = document.querySelectorAll('button[onclick*="download"], button[onclick*="Download as PDF"], #btnDownloadPDF');
    downloadPdfBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        window.downloadResumePDF();
      };
    });
  }

  /**
   * True when the resume contains Telugu (or any other Indic) text.
   *
   * This matters because jsPDF has no text-shaping engine. Measured against
   * this project's own bundle: for the cluster "గ్ర" (ga + virama + ra),
   * jsPDF reports a width exactly equal to the three parts added together,
   * while the browser reports roughly a third of that because it forms the
   * conjunct ligature. jsPDF reads only `cmap` and `glyf` — there is no
   * GSUB/GPOS handling in it at all.
   *
   * So embedding a Telugu font in jsPDF does not fix Telugu: it produces
   * disconnected base glyphs with vowel signs in the wrong places. A student
   * could send that resume to an employer without realising it is mangled,
   * which is worse than not offering Telugu export at all.
   *
   * The browser's own print-to-PDF shapes correctly, keeps the text
   * selectable (which matters for employer keyword searches), needs no extra
   * download, and works offline — so Telugu resumes go through printing.
   */
  function hasComplexScript(profile) {
    // Telugu U+0C00–U+0C7F, plus the other Indic blocks a user might paste in.
    const INDIC = /[ऀ-ൿ]/;
    return INDIC.test(JSON.stringify(profile || {}));
  }

  window.downloadResumePDF = async function () {
    const profileForCheck = loadProfileData();

    if (hasComplexScript(profileForCheck)) {
      const isTe = document.documentElement.lang === 'te';
      if (window.GCS_APP && window.GCS_APP.toast) {
        window.GCS_APP.toast.show(
          isTe
            ? 'ℹ️ తెలుగు రెజ్యూమె కోసం ప్రింట్ విండో తెరుచుకుంటుంది — "Save as PDF" ఎంచుకోండి. ఇలా చేస్తేనే తెలుగు అక్షరాలు సరిగ్గా వస్తాయి.'
            : 'ℹ️ Opening the print window — choose "Save as PDF". This is the only way Telugu letters come out correctly.',
          'info'
        );
      }
      // Give the toast a moment to be read before the print dialog blocks.
      setTimeout(() => window.print(), 1200);
      return;
    }

    let jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF && window.GCS_PDF && window.GCS_PDF.load) {
      try {
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show('⏳ Preparing PDF generator...');
        }
        const jspdfModule = await window.GCS_PDF.load();
        jsPDF = jspdfModule.jsPDF;
      } catch (err) {
        console.warn('GCS: jsPDF loading failed, falling back to window.print()', err);
      }
    }
    if (!jsPDF) {
      window.print();
      return;
    }
    const profile = loadProfileData();
    const doc = new jsPDF();

    const primaryColor = localStorage.getItem(COLOR_KEY) || '#153E31';
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 21;
    const g = parseInt(hex.substring(2, 4), 16) || 62;
    const b = parseInt(hex.substring(4, 6), 16) || 49;

    // Left sidebar band (A4 is 210 x 297 mm)
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, 68, 297, 'F');

    // Left column content
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    const nameLines = doc.splitTextToSize(profile.fullName || 'Professional Resume', 56);
    doc.text(nameLines, 6, 28);

    let leftY = 28 + (nameLines.length * 6) + 2;
    doc.setFontSize(8.5);
    doc.setTextColor(167, 243, 208);
    const titleLines = doc.splitTextToSize(profile.title || 'Candidate', 56);
    doc.text(titleLines, 6, leftY);
    leftY += (titleLines.length * 4.5) + 8;

    // Contact section
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('CONTACT', 6, leftY);
    doc.setDrawColor(255, 255, 255);
    doc.line(6, leftY + 1.5, 62, leftY + 1.5);
    leftY += 6;

    doc.setFontSize(7.5);
    doc.setTextColor(209, 250, 229);
    if (profile.phone) { doc.text(`Tel: ${profile.phone}`, 6, leftY); leftY += 5; }
    if (profile.email) {
      const emailLines = doc.splitTextToSize(profile.email, 56);
      doc.text(emailLines, 6, leftY);
      leftY += (emailLines.length * 4) + 1;
    }
    if (profile.address) {
      const addrLines = doc.splitTextToSize(profile.address, 56);
      doc.text(addrLines, 6, leftY);
      leftY += (addrLines.length * 4) + 1;
    }
    if (profile.linkedIn) { doc.text(`LinkedIn: ${profile.linkedIn}`, 6, leftY); leftY += 5; }
    if (profile.github) { doc.text(`GitHub: ${profile.github}`, 6, leftY); leftY += 5; }
    leftY += 6;

    // Skills in sidebar
    if (profile.skills && profile.skills.length > 0) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('SKILLS', 6, leftY);
      doc.line(6, leftY + 1.5, 62, leftY + 1.5);
      leftY += 6;

      doc.setFontSize(7.5);
      doc.setTextColor(209, 250, 229);
      profile.skills.forEach(sk => {
        if (leftY < 280) {
          const skLines = doc.splitTextToSize(`• ${sk}`, 56);
          doc.text(skLines, 6, leftY);
          leftY += (skLines.length * 4);
        }
      });
      leftY += 4;
    }

    // Languages
    if (profile.languages && profile.languages.length > 0) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('LANGUAGES', 6, leftY);
      doc.line(6, leftY + 1.5, 62, leftY + 1.5);
      leftY += 6;

      doc.setFontSize(7.5);
      doc.setTextColor(209, 250, 229);
      profile.languages.forEach(l => {
        if (leftY < 285) {
          const langName = typeof l === 'string' ? l : l.lang;
          doc.text(`• ${langName}`, 6, leftY);
          leftY += 4.5;
        }
      });
    }

    // Right column content (x: 76 to 200)
    let rightY = 22;
    const contentWidth = 126;

    // Objective
    if (profile.objective) {
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text('CAREER OBJECTIVE', 76, rightY);
      doc.setDrawColor(226, 232, 240);
      doc.line(76, rightY + 2, 202, rightY + 2);
      rightY += 7;

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      const objLines = doc.splitTextToSize(profile.objective, contentWidth);
      doc.text(objLines, 76, rightY);
      rightY += (objLines.length * 4.2) + 7;
    }

    // Education
    if (profile.education && profile.education.length > 0) {
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text('EDUCATION', 76, rightY);
      doc.line(76, rightY + 2, 202, rightY + 2);
      rightY += 7;

      profile.education.forEach(edu => {
        if (rightY < 275) {
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text(edu.degree || '', 76, rightY);
          if (edu.year) {
            doc.setTextColor(100, 116, 139);
            doc.text(edu.year, 202, rightY, { align: 'right' });
          }
          rightY += 4.5;

          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const sub = `${edu.school || ''}${edu.grade ? '  •  ' + edu.grade : ''}`;
          const subLines = doc.splitTextToSize(sub, contentWidth);
          doc.text(subLines, 76, rightY);
          rightY += (subLines.length * 4) + 3;
        }
      });
      rightY += 4;
    }

    // Projects
    if (profile.projects && profile.projects.length > 0) {
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text('KEY PROJECTS', 76, rightY);
      doc.line(76, rightY + 2, 202, rightY + 2);
      rightY += 7;

      profile.projects.forEach(proj => {
        if (rightY < 275) {
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          const titleText = `${proj.title || ''}${proj.tech ? ' (' + proj.tech + ')' : ''}`;
          doc.text(titleText, 76, rightY);
          rightY += 4.5;

          if (proj.desc) {
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            const descLines = doc.splitTextToSize(proj.desc, contentWidth);
            doc.text(descLines, 76, rightY);
            rightY += (descLines.length * 4) + 3;
          }
        }
      });
      rightY += 4;
    }

    // Experience
    if (profile.experience && profile.experience.length > 0) {
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text('EXPERIENCE & INTERNSHIPS', 76, rightY);
      doc.line(76, rightY + 2, 202, rightY + 2);
      rightY += 7;

      profile.experience.forEach(exp => {
        if (rightY < 275) {
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          const expTitle = `${exp.role || ''}${exp.company ? ' — ' + exp.company : ''}`;
          doc.text(expTitle, 76, rightY);
          if (exp.duration) {
            doc.setTextColor(100, 116, 139);
            doc.text(exp.duration, 202, rightY, { align: 'right' });
          }
          rightY += 4.5;

          if (exp.desc) {
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            const descLines = doc.splitTextToSize(exp.desc, contentWidth);
            doc.text(descLines, 76, rightY);
            rightY += (descLines.length * 4) + 3;
          }
        }
      });
      rightY += 4;
    }

    // Achievements
    if (profile.achievements && profile.achievements.length > 0) {
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text('CERTIFICATIONS & ACHIEVEMENTS', 76, rightY);
      doc.line(76, rightY + 2, 202, rightY + 2);
      rightY += 7;

      profile.achievements.forEach(ach => {
        if (rightY < 285) {
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const achLines = doc.splitTextToSize(`• ${ach}`, contentWidth);
          doc.text(achLines, 76, rightY);
          rightY += (achLines.length * 4) + 1.5;
        }
      });
    }

    const safeName = (profile.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Resume.pdf`);
  };

  // Preset switchers
  window.loadPresetProfile = function (presetKey) {
    const data = PRESETS[presetKey] || DEFAULT_PROFILE;
    saveProfileData(data);
    bindDataToForm(data);
    renderMiniPreview(data);
    updateScoreMeters(data);

    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(`✅ Loaded profile: ${data.fullName || 'Blank Form'}`);
    }
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initBuilderPage();
    initPreviewPage();
  });

  // Global Export
  window.GCS_RESUME = {
    loadProfile: loadProfileData,
    saveProfile: saveProfileData,
    computeScores,
    loadPreset: window.loadPresetProfile,
    onStepSwitch
  };

})();
