/**
 * Gramin Career Setu — Job data build step
 * ─────────────────────────────────────────
 * Reads data/jobs.csv (the single source of truth, editable by anyone with a
 * spreadsheet) and writes data/jobs-data.js, which the browser loads as
 * window.GCS_JOBS.
 *
 * Why a build step instead of fetching the CSV at runtime:
 *   - the pages must work from file:// during development, where fetch() of a
 *     relative file is blocked;
 *   - it keeps ONE authoring surface, so the four competing job datasets this
 *     project used to carry cannot come back.
 *
 * Run it after every edit to data/jobs.csv:
 *     node scripts/build-jobs-data.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'data', 'jobs.csv');
const OUT_PATH = path.join(ROOT, 'data', 'jobs-data.js');

/** The education levels a student can select on the site. */
const ALL_LEVELS = ['below10', '10th', 'inter', 'iti', 'degree'];

/**
 * Works out which students may apply, from the qualification text in the CSV.
 *
 * The card always shows the raw qualification string as well — that text is the
 * authoritative requirement, and this mapping is only a convenience filter. When
 * the text is ambiguous we widen rather than narrow, so the filter never hides a
 * role a student might actually be eligible for.
 */
function eligibleLevels(qualification) {
  const q = qualification.toLowerCase();

  // No gate at all — self-employment and short vocational courses.
  if (/no formal|skill training helpful|basic computer|short-term vocational/.test(q)) {
    return ALL_LEVELS.slice();
  }

  // A specific ITI trade certificate is required (and not general diploma/degree/10th)
  if (/\biti\b/.test(q) && !/diploma|degree|10th|10\+2|12th|intermediate|b\.tech|bca|b\.sc/.test(q)) {
    return ['iti'];
  }

  // 10th pass level roles (also open to inter, iti, degree holders)
  const has10th = /\b10th\b/.test(q) && !/10\+2/.test(q);
  if (has10th) {
    return ['10th', 'inter', 'iti', 'degree'];
  }

  // 10+2, Intermediate, or Technical/Nursing Diploma (open to inter, iti, degree holders)
  const hasInterOrDiploma = /10\+2|12th|intermediate|\binter\b|diploma|d\.ed|d\.pharm|gnm/.test(q);
  if (hasInterOrDiploma) {
    return ['inter', 'iti', 'degree'];
  }

  // Degree / Graduate level roles
  const hasDegree = /\bdegree\b|graduate|b\.tech|bca|b\.sc|mbbs|b\.pharm|b\.ed/.test(q);
  if (hasDegree) {
    return ['degree'];
  }

  // Unrecognised wording: show it to everyone rather than silently hiding it.
  return ALL_LEVELS.slice();
}

/** Minimal RFC-4180 reader: handles the quoted salary fields in this CSV. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') { inQuotes = true; continue; }
    if (c === ',') { row.push(field); field = ''; continue; }
    if (c === '\r') continue;
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

const raw = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCsv(raw);
const header = rows[0].map(h => h.trim());

const jobs = rows.slice(1).map(cells => {
  const rec = {};
  header.forEach((h, i) => { rec[h] = (cells[i] || '').trim(); });

  return {
    id: rec.job_id,
    titleTe: rec.title_te,
    titleEn: rec.title_en,
    category: rec.category,
    qualification: rec.qualification,
    examName: rec.exam_name,
    applyUrl: rec.where_to_apply,
    salaryRange: rec.salary_range,
    prepTime: rec.prep_time,
    freeResourceUrl: rec.free_resource,
    eligibleLevels: eligibleLevels(rec.qualification)
  };
});

const counts = jobs.reduce((acc, j) => {
  acc[j.category] = (acc[j.category] || 0) + 1;
  return acc;
}, {});

const banner = `/**
 * Gramin Career Setu — Job role data (GENERATED FILE — DO NOT EDIT BY HAND)
 * ─────────────────────────────────────────────────────────────────────────
 * Source:    data/jobs.csv
 * Regenerate: node scripts/build-jobs-data.js
 *
 * These are role TYPES that rural students are eligible for, each pointing at
 * the official portal where real notifications are published. They are not
 * live vacancies, and nothing here is marked "verified" — salary bands and
 * preparation times are indicative, and the official site is always the
 * authority on current openings and eligibility.
 *
 * ${jobs.length} roles: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}
 */
`;

const out = banner + '\nwindow.GCS_JOBS = ' + JSON.stringify(jobs, null, 2) + ';\n';
fs.writeFileSync(OUT_PATH, out, 'utf8');

console.log(`Wrote ${path.relative(ROOT, OUT_PATH)} — ${jobs.length} roles (${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ')})`);
