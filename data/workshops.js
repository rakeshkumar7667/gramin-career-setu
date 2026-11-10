/**
 * Gramin Career Setu — Workshops
 * ───────────────────────────────
 * THIS FILE IS THE ONLY SOURCE OF WHAT workshops.html SHOWS.
 *
 * The page used to list six sessions — Python for Beginners, Introduction to
 * AI, Web Development Basics, Data Science Overview, Digital Marketing 101,
 * Excel for Everyone — labelled "Upcoming", all dated May 2024, all with a
 * working Register button. They were neither upcoming nor rural career
 * guidance, and a student could sign up for one at any time.
 *
 * So the page now shows two things only:
 *   1. `curriculum` — the sessions this project is set up to run. These are
 *      descriptions of what we teach, not events, and carry no dates.
 *   2. `scheduled` / `held` — real sessions, added by hand when they are
 *      actually arranged and after they actually happen.
 *
 * Registration is only possible for a session in `scheduled`. When that list
 * is empty the page says so instead of offering a button.
 *
 * ── HOW TO SCHEDULE A SESSION ──────────────────────────────────────────────
 * Add an entry to `scheduled`:
 *   { id, curriculumId, date: 'YYYY-MM-DD', time, village, district, venue, seats }
 * After it happens, move it to `held` and add the attendance figure. Then
 * record the before/after survey answers in data/survey-data.js — the two
 * files are what the impact dashboard reports on.
 */

window.GCS_WORKSHOPS = {
  /**
   * What we are set up to teach. Ordered by what a rural student needs first.
   * These are not events and must never be given a date here.
   */
  curriculum: [
    {
      id: 'career-awareness',
      titleEn: 'What can I do after 10th / Intermediate?',
      titleTe: '10వ తరగతి / ఇంటర్ తర్వాత నేను ఏమి చేయవచ్చు?',
      durationEn: '90 minutes',
      durationTe: '90 నిమిషాలు',
      descEn: 'The career paths actually open at each qualification level — government exams, ITI trades, polytechnic, BPO work and self-employment — and what each one really requires.',
      descTe: 'ప్రతి విద్యార్హత స్థాయిలో నిజంగా అందుబాటులో ఉన్న కెరీర్ మార్గాలు — ప్రభుత్వ పరీక్షలు, ఐటీఐ ట్రేడ్లు, పాలిటెక్నిక్, బీపీఓ ఉద్యోగాలు, స్వయం ఉపాధి — మరియు వాటికి నిజంగా ఏమి కావాలి.',
      icon: 'explore'
    },
    {
      id: 'apply-online',
      titleEn: 'How to apply online',
      titleTe: 'ఆన్‌లైన్‌లో ఎలా దరఖాస్తు చేయాలి',
      durationEn: '2 hours, hands-on',
      durationTe: '2 గంటలు, ప్రత్యక్ష సాధన',
      descEn: 'Each student brings their documents and completes a real registration end to end: email, portal account, form, photo and signature upload, fee and printed confirmation.',
      descTe: 'ప్రతి విద్యార్థి తమ పత్రాలతో వచ్చి, ఒక నిజమైన రిజిస్ట్రేషన్‌ను మొదటి నుంచి చివరి వరకు పూర్తి చేస్తారు: ఈమెయిల్, పోర్టల్ ఖాతా, ఫారమ్, ఫోటో-సంతకం అప్‌లోడ్, ఫీజు, ప్రింటెడ్ నిర్ధారణ.',
      icon: 'contact_support'
    },
    {
      id: 'resume',
      titleEn: 'Build your first resume',
      titleTe: 'మీ మొదటి రెజ్యూమె తయారు చేసుకోండి',
      durationEn: '90 minutes, hands-on',
      durationTe: '90 నిమిషాలు, ప్రత్యక్ష సాధన',
      descEn: 'Every student leaves with a printed PDF resume of their own, made on a phone, with no shop fee.',
      descTe: 'ప్రతి విద్యార్థి ఫోన్‌లోనే తయారు చేసుకున్న సొంత PDF రెజ్యూమెను ప్రింట్ చేసుకుని వెళ్తారు — దుకాణం ఖర్చు లేకుండా.',
      icon: 'description'
    },
    {
      id: 'exam-prep',
      titleEn: 'Preparing for a government exam without coaching',
      titleTe: 'కోచింగ్ లేకుండా ప్రభుత్వ పరీక్షకు సిద్ధం కావడం',
      durationEn: '90 minutes',
      durationTe: '90 నిమిషాలు',
      descEn: 'Which exams you are already eligible for, the free material that exists, and how to build a study routine that fits around work.',
      descTe: 'మీరు ఇప్పటికే అర్హత ఉన్న పరీక్షలు, అందుబాటులో ఉన్న ఉచిత సామగ్రి, పనితో పాటు కొనసాగించగలిగే చదువు ప్రణాళిక.',
      icon: 'menu_book'
    },
    {
      id: 'self-employment',
      titleEn: 'Starting a small business with a government loan',
      titleTe: 'ప్రభుత్వ రుణంతో చిన్న వ్యాపారం ప్రారంభించడం',
      durationEn: '90 minutes',
      durationTe: '90 నిమిషాలు',
      descEn: 'Choosing a business your village needs, the free RSETI training, and how MUDRA and PMEGP applications actually work at a bank branch.',
      descTe: 'మీ గ్రామానికి అవసరమైన వ్యాపారం ఎంచుకోవడం, ఉచిత RSETI శిక్షణ, బ్యాంకు శాఖలో ముద్రా మరియు PMEGP దరఖాస్తులు నిజంగా ఎలా జరుగుతాయి.',
      icon: 'storefront'
    }
  ],

  /**
   * Real sessions that have been arranged but not yet held.
   * { id, curriculumId, date: 'YYYY-MM-DD', time, village, district, venue, seats }
   */
  scheduled: [],

  /**
   * Sessions that actually took place. Keep these: they are the record the
   * impact dashboard and the project report are built on.
   * { id, curriculumId, date: 'YYYY-MM-DD', village, district, attended }
   */
  held: []
};
