const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const port = 5178;
let serverProcess;

function request(requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: requestPath, method: 'GET' }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      await request('/index.html');
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  throw new Error('server did not start');
}

test.before(async () => {
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  });
  await waitForServer();
});

test.after(() => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
});

test('serves the application entry point', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.match(response.body, /Gramin Career Setu/i);
});

test('returns the custom 404 page for missing files', async () => {
  const response = await request('/does-not-exist');
  assert.equal(response.status, 404);
  assert.match(response.body, /404/i);
});

test('rejects encoded path traversal', async () => {
  const response = await request('/%2e%2e/server.js');
  assert.equal(response.status, 403);
  assert.doesNotMatch(response.body, /const http = require/);
});

test('returns 400 for malformed URL encoding and stays alive', async () => {
  const response = await request('/%E0%A4%A');
  assert.equal(response.status, 400);
  const health = await request('/index.html');
  assert.equal(health.status, 200);
});

test('jobs page has working query/category/pagination implementation', () => {
  const jobs = fs.readFileSync(path.join(root, 'jobs.html'), 'utf8');
  assert.match(jobs, /params\.get\('q'\)/);
  assert.match(jobs, /const category = document\.getElementById\('jobCatSelect'\)\.value/);
  assert.match(jobs, /renderPagination\(pageCount\)/);
  assert.match(jobs, /id="jobsPagination"/);
});

test('resume objective limit is enforced in markup and initialization', () => {
  const resume = fs.readFileSync(path.join(root, 'resume.html'), 'utf8');
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.match(resume, /id="inputObjective"[^>]*maxlength="200"/);
  assert.match(engine, /String\(data\.objective \|\| ''\)\.slice\(0, 200\)/);
});

test('serves assets/api.js with GCS_API client', async () => {
  const response = await request('/assets/api.js');
  assert.equal(response.status, 200);
  assert.match(response.body, /GCS_API/);
  assert.match(response.body, /offlineQueue/);
});

test('handles /api/v1/ reverse proxy gracefully', async () => {
  const response = await request('/api/v1/jobs');
  assert.ok(response.status === 200 || response.status === 503, `Expected status 200 or 503, got ${response.status}`);
  if (response.status === 200) {
    assert.match(response.body, /"success"\s*:\s*true/);
  } else {
    assert.match(response.body, /offline fallback active/);
  }
});

test('service worker caches assets/api.js for offline operation', () => {
  const sw = fs.readFileSync(path.join(root, 'assets', 'sw.js'), 'utf8');
  assert.match(sw, /\.\/assets\/api\.js/);
  // Assert that the cache is versioned, not which version it is: bumping the
  // version is the correct thing to do when the precache list changes.
  assert.match(sw, /const CACHE_NAME = 'gcs-cache-v\d+';/);
});

test('GCS_API contains quiz, scholarships, and schemes modules', async () => {
  const response = await request('/assets/api.js');
  assert.equal(response.status, 200);
  assert.match(response.body, /quiz:\s*\{/);
  assert.match(response.body, /scholarships:\s*\{/);
  assert.match(response.body, /schemes:\s*\{/);
});

test('quiz, scholarships, and schemes pages link assets/api.js', () => {
  const quiz = fs.readFileSync(path.join(root, 'quiz.html'), 'utf8');
  const scholarships = fs.readFileSync(path.join(root, 'scholarships.html'), 'utf8');
  const schemes = fs.readFileSync(path.join(root, 'schemes.html'), 'utf8');

  assert.match(quiz, /<script src="assets\/api\.js"/);
  assert.match(scholarships, /<script src="assets\/api\.js"/);
  assert.match(schemes, /<script src="assets\/api\.js"/);
});

test('GCS_API supports workshop cancellation and protects offline PII', () => {
  const api = fs.readFileSync(path.join(root, 'assets', 'api.js'), 'utf8');
  assert.match(api, /cancel\(workshopId,\s*\{\s*phone\s*\}\)/);
  assert.match(api, /_protect\(payload\)/);
  assert.match(api, /_unprotect\(payload\)/);
  assert.match(api, /__enc_/);
});

test('GCS_AUTH supports OIDC PKCE flow and distinguishes demo sessions', () => {
  const auth = fs.readFileSync(path.join(root, 'assets', 'auth.js'), 'utf8');
  assert.match(auth, /OIDC_CONFIG/);
  assert.match(auth, /loginWithOidc/);
  assert.match(auth, /handleOidcCallback/);
  assert.match(auth, /refreshToken/);
  assert.match(auth, /isDemoSession:\s*true/);
});

test('actions and login synchronize with OIDC and backend cancellation', () => {
  const actions = fs.readFileSync(path.join(root, 'assets', 'actions.js'), 'utf8');
  const login = fs.readFileSync(path.join(root, 'login.html'), 'utf8');
  assert.match(actions, /GCS_API\.workshops\.cancel/);
  assert.match(login, /loginWithOidc\(\)/);
});

test('serves production security headers on HTTP responses', async () => {
  const response = await request('/index.html');
  assert.equal(response.status, 200);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
  assert.match(response.headers['content-security-policy'], /default-src 'self'/);
});

test('resumes API client sends structured { resumeJson } payload', () => {
  const api = fs.readFileSync(path.join(root, 'assets', 'api.js'), 'utf8');
  assert.match(api, /body:\s*JSON\.stringify\(\{\s*resumeJson:\s*jsonString\s*\}\)/);
});

test('V5 migration uses portable composite indexes, not pg_trgm', () => {
  const v5Path = path.join(root, 'backend', 'src', 'main', 'resources', 'db', 'migration', 'V5__job_search_trigram_and_quiz_indexes.sql');
  assert.ok(fs.existsSync(v5Path), 'V5 migration file must exist');
  const v5Sql = fs.readFileSync(v5Path, 'utf8');
  // Portable B-tree indexes only: this migration also runs against MySQL and
  // H2, where a Postgres pg_trgm GIN index would fail outright.
  assert.match(v5Sql, /idx_quiz_user_created/i);
  assert.match(v5Sql, /idx_resumes_user_updated/i);
  assert.match(v5Sql, /idx_jobs_title_en/i);
  assert.doesNotMatch(v5Sql, /pg_trgm/i, 'V5 must stay portable across MySQL and H2');
});

test('actuator configuration isolates liveness probe from external dependencies', () => {
  const appYml = fs.readFileSync(path.join(root, 'backend', 'src', 'main', 'resources', 'application.yml'), 'utf8');
  const prodYml = fs.readFileSync(path.join(root, 'backend', 'src', 'main', 'resources', 'application-prod.yml'), 'utf8');
  assert.match(appYml, /liveness:\s*\n\s*include:\s*livenessState/);
  assert.match(prodYml, /liveness:\s*\n\s*include:\s*livenessState/);
  assert.match(prodYml, /readiness:\s*\n\s*include:\s*readinessState,db,redis,diskSpace/);
});



// ── Content integrity ──────────────────────────────────────────────────────
// These guard the Phase A cleanup: the project must not reintroduce invented
// job listings, impact statistics or testimonials, because its Community
// Service Project assessment rests on what it claims about real people.

test('job data is generated from data/jobs.csv and stays in sync with it', () => {
  const csv = fs.readFileSync(path.join(root, 'data', 'jobs.csv'), 'utf8');
  const csvRows = csv.trim().split(/\r?\n/).length - 1; // minus the header

  const dataJs = fs.readFileSync(path.join(root, 'data', 'jobs-data.js'), 'utf8');
  assert.match(dataJs, /GENERATED FILE/, 'jobs-data.js must declare that it is generated');

  const scope = {};
  new Function('window', dataJs)(scope);
  assert.ok(Array.isArray(scope.GCS_JOBS), 'jobs-data.js must define window.GCS_JOBS');
  assert.equal(scope.GCS_JOBS.length, csvRows,
    'jobs-data.js is stale — run: node scripts/build-jobs-data.js');

  for (const job of scope.GCS_JOBS) {
    assert.ok(job.titleTe && job.titleEn, `${job.id} needs both Telugu and English titles`);
    assert.ok(job.qualification, `${job.id} must state who can apply`);
    assert.match(job.applyUrl, /^https:\/\//, `${job.id} must link to an official https portal`);
    assert.ok(Array.isArray(job.eligibleLevels) && job.eligibleLevels.length,
      `${job.id} must be reachable by at least one education level`);
  }
});

test('a 10th-pass student is shown roles they are actually eligible for', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'jobs-data.js'), 'utf8'))(scope);
  const forTenth = scope.GCS_JOBS.filter(j => j.eligibleLevels.includes('10th'));
  assert.ok(forTenth.length >= 5,
    `only ${forTenth.length} roles open to a 10th-pass student; the target user must not hit a dead end`);
});

test('no fabricated employer listings remain in the shipped job data', () => {
  const invented = /Tata Consultancy|Infosys Limited|Wipro Limited|Accenture Solutions|Zoho Corporation/i;
  for (const file of ['data/jobs-data.js', 'data/jobs.csv', 'assets/app.js', 'jobs.html']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(text, invented, `${file} must not carry invented listings for real employers`);
  }
});

test('impact dashboard has no hardcoded statistics and ships without survey data', () => {
  const page = fs.readFileSync(path.join(root, 'results.html'), 'utf8');
  assert.doesNotMatch(page, /5,758|1,102|2,458|1,356|Lives Impacted|Top Reached Villages/i,
    'results.html must not reintroduce invented impact figures');
  assert.match(page, /data\/survey-data\.js/, 'results.html must render from the survey data file');

  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'survey-data.js'), 'utf8'))(scope);
  const survey = scope.GCS_SURVEY;
  assert.ok(survey, 'survey-data.js must define window.GCS_SURVEY');
  assert.equal(survey.metrics.length, 3, 'the three problem-statement metrics must be present');

  // Either no survey has been run (every metric empty), or one has been run
  // and every metric is complete. A half-filled file would render a partial
  // comparison that reads as a result.
  const filled = survey.metrics.filter(m =>
    typeof m.beforeYes === 'number' && typeof m.afterYes === 'number' && typeof m.respondents === 'number');
  if (survey.status === 'collected') {
    assert.equal(filled.length, 3, 'status is "collected" but some metrics have no responses');
    for (const m of survey.metrics) {
      assert.ok(m.respondents > 0, `${m.id} must have respondents`);
      assert.ok(m.beforeYes <= m.respondents && m.afterYes <= m.respondents,
        `${m.id} cannot have more yes answers than respondents`);
    }
  } else {
    assert.equal(filled.length, 0, 'status is "pending" but metrics carry numbers');
  }
});

test('no named testimonial is presented as a real participant', () => {
  const named = /Sandeep Kumar|Lalitha Kumari|Ramesh Babu|openStoryVideo/;
  for (const file of ['index.html', 'stories.html', 'assets/landing.js']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const body = text.replace(/<!--[\s\S]*?-->/g, ''); // explanatory comments may name what was removed
    assert.doesNotMatch(body, named, `${file} must not present invented success stories`);
  }
});

test('workshop registration never invents a name or phone number', () => {
  const actions = fs.readFileSync(path.join(root, 'assets', 'actions.js'), 'utf8');
  // Comment lines may name the placeholders that were removed, so judge the code only.
  const code = actions.split(/\r?\n/).filter(l => !l.trim().startsWith('//')).join('\n');
  assert.doesNotMatch(code, /'9876543210'|'Registered Scholar'/,
    'registrations must only reach the backend with the student’s real details');
  assert.match(actions, /canSync/, 'registration sync must be gated on having real details');
});

// ── Career roadmaps ────────────────────────────────────────────────────────

test('every roadmap step answers the six questions, in both languages', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8'))(scope);
  const data = scope.GCS_ROADMAPS;
  assert.ok(Array.isArray(data.goals) && data.goals.length, 'roadmaps.js must define goals');

  const LEVELS = ['below10', '10th', 'inter', 'iti', 'degree'];
  for (const goal of data.goals) {
    assert.ok(goal.realityEn && goal.realityTe, `${goal.id} must state the honest picture in both languages`);
    assert.ok(goal.steps.length, `${goal.id} must have steps`);
    for (const step of goal.steps) {
      assert.ok(LEVELS.includes(step.fromLevel), `${goal.id}/${step.id} has an unknown fromLevel`);
      for (const f of ['titleEn', 'titleTe', 'whatEn', 'whatTe', 'durationEn', 'durationTe',
                       'costEn', 'costTe', 'officialName', 'officialUrl', 'verifyEn', 'verifyTe']) {
        assert.ok(step[f], `${goal.id}/${step.id} is missing ${f}`);
      }
      assert.ok(step.howEn.length && step.howTe.length, `${goal.id}/${step.id} needs how-to steps`);
      assert.equal(step.howEn.length, step.howTe.length,
        `${goal.id}/${step.id} has a different number of how-to steps in each language`);
      assert.match(step.officialUrl, /^https:\/\//, `${goal.id}/${step.id} must link to an https official source`);
    }
  }
});

test('roadmaps encode no volatile figures that would go stale', () => {
  // Age limits, fees, vacancy counts and physical standards change with every
  // recruitment notification and differ between posts in the same one. Nobody
  // maintains this file after handover, so a number here becomes wrong and
  // misleads a student. The roadmap links to the official portal instead.
  const raw = fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8');
  const code = raw.split(/\r?\n/).filter(l => !l.trim().startsWith('*') && !l.trim().startsWith('//')).join('\n');
  const volatile = [
    [/age limit (is|of|:)\s*\d/i, 'a specific age limit'],
    [/\b(aged|age)\s+\d{2}\s*(to|-|–)\s*\d{2}/i, 'an age band'],
    [/₹\s?\d/, 'a rupee amount'],
    [/\b\d+\s*vacanc/i, 'a vacancy count'],
    [/cut-?off\s+(marks?|rank)\s+(is|of|:)\s*\d/i, 'a cut-off figure'],
    [/\b\d{2,3}\s?cm\b/i, 'a physical measurement']
  ];
  for (const [re, what] of volatile) {
    assert.doesNotMatch(code, re, `data/roadmaps.js must not hardcode ${what}`);
  }
});

test('a 10th-pass student gets a path that starts where they are', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8'))(scope);
  const RANK = { below10: 0, '10th': 1, inter: 2, iti: 2, degree: 3 };

  for (const goal of scope.GCS_ROADMAPS.goals) {
    // Every goal must be reachable from 10th: either a step they can begin
    // now, or an alternative route open to them. Otherwise a 10th-pass
    // student picking this goal hits a dead end, which is the exact failure
    // this page was rebuilt to remove.
    const reachableStep = goal.steps.some(s => RANK[s.fromLevel] <= RANK['10th']);
    const reachableAlt = (goal.alternatives || []).some(a => RANK[a.fromLevel] <= RANK['10th']);
    assert.ok(reachableStep || reachableAlt,
      `${goal.id} offers a 10th-pass student nothing to start`);
  }
});

test('roadmap page renders from the data file and not from hardcoded markup', () => {
  const page = fs.readFileSync(path.join(root, 'roadmap.html'), 'utf8');
  assert.match(page, /data\/roadmaps\.js/, 'roadmap.html must load the roadmap data');
  assert.match(page, /GCS_ROADMAPS/, 'roadmap.html must render from GCS_ROADMAPS');
  assert.doesNotMatch(page, /B\.Tech in CSE|Top Career Options in Software/,
    'the fixed B.Tech-CSE path must not return');
});

test('quiz results lead into the roadmap instead of inventing match scores', () => {
  const page = fs.readFileSync(path.join(root, 'quiz-results.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /Cyber Security Analyst|Data Scientist|Database Administrator/,
    'quiz results must not recommend IT careers the quiz never measured');
  assert.doesNotMatch(body, /\b(92|85|81|76|75|70)%\s*Match/i,
    'match percentages must come from the quiz, not from the markup');
  assert.match(body, /resultRoadmapLink/, 'quiz results must link into the roadmap');
});

test('Telugu resumes are exported through printing, not jsPDF', () => {
  // jsPDF has no shaping engine: measured against this repo's own bundle, the
  // cluster "గ్ర" comes out exactly as wide as its three parts added up, while
  // the browser renders it about a third of that because it forms the conjunct.
  // Embedding a Telugu font would therefore produce a mangled resume, so
  // Telugu content must go through the browser's print-to-PDF instead.
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.match(engine, /hasComplexScript/, 'the export must detect complex-script content');
  assert.match(engine, /\u0900-\u0D7F/, 'detection must cover the Indic range');

  // The guard has to run before jsPDF is reached, or Telugu still goes to jsPDF.
  const guard = engine.indexOf('hasComplexScript(profileForCheck)');
  const jsPdfUse = engine.indexOf('const doc = new jsPDF()');
  assert.ok(guard > -1 && jsPdfUse > -1 && guard < jsPdfUse,
    'the complex-script check must come before the jsPDF path');

  assert.doesNotMatch(engine, /addFileToVFS|addFont\(/,
    'embedding a Telugu font in jsPDF does not fix shaping and must not be reintroduced');

  // Printing only yields a resume if the print stylesheet isolates one.
  const css = fs.readFileSync(path.join(root, 'assets', 'landing.css'), 'utf8');
  assert.match(css, /@media print/, 'a print stylesheet is required for the Telugu export path');
  assert.match(css, /\.gcs-printable-resume/, 'print CSS must target the printable resume');
});

test('no control advertises a feature that does not exist', () => {
  // 62 buttons and links used to call GCS_ACTIONS.notAvailable(): 42 dead
  // social icons across the footers, and 19 controls offering features that
  // were never built (workshop scheduling, mentor review, recording links,
  // admin editors). Telling a student a feature is "coming soon" after they
  // tap it is worse than not offering it, and in a demo every one of them is
  // a question that cannot be answered well.
  const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'))
    .concat(['admin/index.html']);
  const offenders = [];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const body = html.replace(/<!--[\s\S]*?-->/g, '');
    const hits = (body.match(/notAvailable\(/g) || []).length;
    if (hits) offenders.push(`${page} (${hits})`);
  }
  assert.deepEqual(offenders, [],
    `these pages still offer features that do nothing: ${offenders.join(', ')}`);
});

test('quiz result resource cards follow the student track', () => {
  const page = fs.readFileSync(path.join(root, 'quiz-results.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /500\+ Active Openings|Top MNC Companies|High Salary Packages/,
    'job availability must be counted from data/jobs.csv, not asserted');
  assert.doesNotMatch(body, /Data Structures &amp; Algorithms|Google IT Support/,
    'skills and courses must not be fixed IT lists shown to every student');
  assert.match(body, /data\/jobs-data\.js/, 'quiz results must load the real role data');

  // Each track needs its own skills and courses, or the cards fall back to
  // showing one track's content to everyone.
  const scope = { document: { documentElement: {} } };
  const configMatch = page.match(/const PATH_CONFIG = (\{[\s\S]*?\n    \});/);
  assert.ok(configMatch, 'PATH_CONFIG must be present');
  const config = new Function('return ' + configMatch[1])();
  for (const track of ['government', 'iti', 'bpo', 'business']) {
    assert.ok(config[track].skills && config[track].skills.length,
      `${track} track needs its own skills list`);
    assert.ok(config[track].courses && config[track].courses.length,
      `${track} track needs its own course list`);
    for (const c of config[track].courses) {
      assert.match(c.url, /^https:\/\//, `${track} course "${c.name}" needs an https link`);
    }
    for (const s of config[track].skills) {
      assert.ok(s.en && s.te, `${track} skills must be bilingual`);
    }
  }
});

// ── Phase C/D: reach, weight and targeting ─────────────────────────────────

test('the apply-online guide exists, is reachable and is bilingual', () => {
  // Objective 6 of the problem statement ("improve digital literacy and
  // awareness of online job applications") had no implementation at all.
  const page = fs.readFileSync(path.join(root, 'apply-online.html'), 'utf8');
  const steps = (page.match(/class="apply-step"/g) || []).length;
  assert.ok(steps >= 8, `the guide needs the full application sequence, found ${steps} steps`);
  assert.match(page, /[ఀ-౿]/, 'the guide must be available in Telugu');
  assert.match(page, /Never pay anyone who promises/i, 'the fraud warnings must be present');

  // A guide nobody can find is no guide.
  const linking = fs.readdirSync(root).filter(f => f.endsWith('.html'))
    .filter(f => fs.readFileSync(path.join(root, f), 'utf8').includes('href="apply-online.html"'));
  assert.ok(linking.length >= 10,
    `only ${linking.length} pages link to the guide; it should be in the shared navigation`);
  assert.ok(fs.readFileSync(path.join(root, 'jobs.html'), 'utf8').includes('apply-online.html'),
    'the job list is where students hit this wall, so it must link the guide');
});

test('images are sized for the screens they are shown on', () => {
  // 2 MB of 1200px JPEGs were being served to phones that render them at
  // 260-470px, on connections this project exists to accommodate.
  const assets = path.join(root, 'assets');
  const jpgs = fs.readdirSync(assets).filter(f => f.endsWith('.jpg'));
  assert.deepEqual(jpgs, [], `oversized JPEGs are back: ${jpgs.join(', ')}`);

  const webps = fs.readdirSync(assets).filter(f => f.endsWith('.webp'));
  assert.ok(webps.length > 10, 'the WebP images should be present');
  const total = webps.reduce((sum, f) => sum + fs.statSync(path.join(assets, f)).size, 0);
  assert.ok(total < 900 * 1024,
    `images total ${Math.round(total / 1024)} KB; keep the set under 900 KB for low-bandwidth use`);
});

test('the service worker precaches a shell, not the whole site', () => {
  const sw = fs.readFileSync(path.join(root, 'assets', 'sw.js'), 'utf8');
  const listed = [...sw.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);

  let total = 0;
  for (const rel of listed) {
    const p = path.join(root, rel);
    assert.ok(fs.existsSync(p), `precache lists a file that does not exist: ${rel}`);
    total += fs.statSync(p).size;
  }
  assert.ok(total < 1.5 * 1024 * 1024,
    `first-visit precache is ${(total / 1048576).toFixed(2)} MB; the fetch handler caches the rest on demand`);

  // Font subsets that can never match a character on a Telugu/English site.
  for (const dead of ['ec84a3760fbd', '4ee8fc9834b2', 'eef1e4977282', '983e90946228']) {
    assert.ok(!sw.includes(dead), `precaching an unusable font subset: ${dead}`);
  }
});

test('the resume builder opens empty and offers reachable examples', () => {
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.match(engine, /return JSON\.parse\(JSON\.stringify\(PRESETS\.blank\)\)/,
    'the builder must open on an empty form, not on a filled sample');

  // The only sample used to be a B.Tech CSE graduate with Java, React and an
  // NPTEL certificate — nothing the target student could put their name to.
  for (const preset of ['ramesh', 'padma']) {
    assert.ok(engine.includes(preset + ': {'), `missing the ${preset} example profile`);
  }
  const resume = fs.readFileSync(path.join(root, 'resume.html'), 'utf8');
  assert.match(resume, /loadPresetProfile\('ramesh'\)/, 'the ITI example must be offered first');
});

test('the dashboard recommends from the student record, not a fixed list', () => {
  const page = fs.readFileSync(path.join(root, 'dashboard.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /APPSC Group 2/,
    'a graduates-only exam must not be recommended to every student');
  assert.match(body, /data\/jobs-data\.js/, 'the dashboard needs the real role data');
  assert.match(body, /dashReco/, 'recommendations must be rendered, not hardcoded');
});

test('login and dashboard are translated, not English-only shells', () => {
  const dict = {};
  new Function('window', fs.readFileSync(path.join(root, 'assets', 'i18n-dict.js'), 'utf8'))({
    get GCS_DICTIONARY() { return dict; },
    set GCS_DICTIONARY(v) { Object.assign(dict, v); }
  });

  for (const page of ['login.html', 'dashboard.html']) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const keys = [...html.matchAll(/data-lang-key="([^"]+)"/g)].map(m => m[1]);
    assert.ok(keys.length >= 15,
      `${page} has only ${keys.length} translated strings; it was an English-only page`);
    for (const k of keys) {
      if (!dict[k]) continue; // shared nav keys live in the same dictionary
      assert.ok(dict[k].te && dict[k].en, `${page}: key "${k}" is missing a translation`);
      // A proper noun may legitimately read the same in both languages.
      if (dict[k].te !== dict[k].en) {
        assert.match(dict[k].te, /[ఀ-౿]/, `${page}: key "${k}" has no Telugu text`);
      }
    }
  }
});

// ── Workshops and authentication ───────────────────────────────────────────

test('workshops are rendered from data and none are advertised falsely', () => {
  const page = fs.readFileSync(path.join(root, 'workshops.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');

  // Six sessions dated May 2024 used to sit under an "Upcoming" heading with
  // working Register buttons, two and a half years after the stated date.
  assert.doesNotMatch(body, /Python for Beginners|Introduction to AI|Data Science Overview|Digital Marketing 101/,
    'the stale IT workshop listings must not return');
  assert.doesNotMatch(body, /20(1\d|2[0-4])/, 'no hardcoded past year may appear on the page');
  assert.match(body, /data\/workshops\.js/, 'workshops must render from the data file');

  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'workshops.js'), 'utf8'))(scope);
  const data = scope.GCS_WORKSHOPS;
  assert.ok(data.curriculum.length >= 4, 'the curriculum should describe what we teach');
  for (const topic of data.curriculum) {
    assert.ok(topic.titleEn && topic.titleTe, `${topic.id} must be bilingual`);
    // A topic is not an event. Giving one a date is how the old page came to
    // advertise sessions that were never going to happen.
    assert.ok(!('date' in topic), `${topic.id} is a topic and must not carry a date`);
  }
  // Registration is only ever offered for a real scheduled session.
  for (const s of data.scheduled) {
    assert.match(s.date, /^\d{4}-\d{2}-\d{2}$/, 'a scheduled session needs a real date');
    assert.ok(s.village && s.district, 'a scheduled session needs a place');
    assert.ok(data.curriculum.some(c => c.id === s.curriculumId),
      `scheduled session ${s.id} points at an unknown topic`);
  }
});

test('no literal password or code opens an account', () => {
  const auth = fs.readFileSync(path.join(root, 'assets', 'auth.js'), 'utf8');
  const code = auth.split(/\r?\n/)
    .filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*') && !l.trim().startsWith('/*'))
    .join('\n');

  // Any account could be opened with 'password123' or 'demo123' whatever its
  // stored hash, '123456' verified any signup, and — worse — '123456' also
  // completed a password RESET, taking over an existing account.
  assert.doesNotMatch(code, /password\s*!==\s*'password123'|password\s*!==\s*'demo123'/,
    'the universal password bypass must not return');
  assert.doesNotMatch(code, /===\s*'123456'|!==\s*'123456'/,
    'the master OTP code must not return');
  assert.doesNotMatch(code, /9876543210 \(Student\)|Demo password: password123/,
    'the login error must not print working credentials');
  assert.match(code, /inputHash !== expectedHash/, 'the password hash must actually be compared');
});

test('the login page does not claim to send an SMS it cannot send', () => {
  const page = fs.readFileSync(path.join(root, 'login.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /We've sent a 6-digit OTP|sent via SMS/i,
    'there is no SMS gateway, so the page must not say a code was sent');
  assert.match(body, /cannot send SMS/i, 'the page must say plainly why the code is on screen');
});

test('endpoints that store personal data require authentication', () => {
  const config = fs.readFileSync(
    path.join(root, 'backend', 'src', 'main', 'java', 'com', 'gramincareersetu',
              'auth', 'SecurityConfig.java'), 'utf8');
  for (const route of ['/api/v1/jobs/*/apply', '/api/v1/workshops/*/register',
                       '/api/v1/workshops/*/cancel']) {
    assert.ok(config.includes('"' + route + '").authenticated()'),
      `${route} must require a signed-in user`);
    assert.ok(!config.includes('"' + route + '").permitAll()'),
      `${route} must not be open to anonymous callers`);
  }
  // Browsing must stay open: the site exists so a student can look without an account.
  assert.match(config, /HttpMethod\.GET, "\/api\/v1\/jobs\/\*\*"\)\.permitAll\(\)/,
    'reading the job list must stay public');
});

test('no signing secret is committed to the repository', () => {
  const jwt = fs.readFileSync(
    path.join(root, 'backend', 'src', 'main', 'java', 'com', 'gramincareersetu',
              'auth', 'JwtTokenService.java'), 'utf8');
  assert.doesNotMatch(jwt, /GraminCareerSetuSecureJwtSecretKey/,
    'a signing secret in source lets anyone who reads the repo mint an admin token');
  assert.match(jwt, /\$\{app\.jwt\.secret:\}/, 'the secret must come from configuration');
  assert.match(jwt, /SecureRandom/, 'an unset secret must fall back to a random key, not a literal');
});

test('the footer year cannot go stale', () => {
  const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    if (!/(&copy;|©)/.test(html)) continue;
    assert.doesNotMatch(html, /(&copy;|©)\s*\d{4}/,
      `${page} hardcodes a copyright year; it read 2024 two years after the fact`);
  }
  const app = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');
  assert.match(app, /gcs-current-year/, 'the year must be filled in at runtime');
});
