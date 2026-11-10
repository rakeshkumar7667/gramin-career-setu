/**
 * Gramin Career Setu — Workshop Impact Survey Data
 * ─────────────────────────────────────────────────
 * THIS FILE IS THE ONLY SOURCE OF THE IMPACT DASHBOARD'S NUMBERS.
 *
 * It ships empty on purpose. The Community Service Project deliverable is
 * evidence of real change in real students, so results.html must never show a
 * number that did not come from a survey someone actually ran. Until you run
 * one, the dashboard says so plainly.
 *
 * ── HOW TO FILL THIS IN ────────────────────────────────────────────────────
 *
 * 1. Before a workshop begins, give every participant the three questions in
 *    `metrics` below on paper. Record how many answered YES to each.
 * 2. Run the workshop.
 * 3. At the end, give the SAME three questions to the SAME group again.
 *    Record how many answered YES to each.
 * 4. Add one entry to `workshops` describing the session.
 * 5. For each metric, set `beforeYes` and `afterYes` to the running totals
 *    across all workshops, and set `respondents` to the total number of
 *    participants who answered both times.
 * 6. Set `status` to 'collected'.
 *
 * Count only students who answered BOTH the before and after survey. A student
 * who left halfway is not a data point, and dropping them is more honest than
 * assuming their answer.
 *
 * Do not estimate. Do not round up. Do not fill a metric you did not ask.
 * A real n=28 with a stated method is worth more than any larger invented
 * number, and it is the one thing an evaluator cannot argue with.
 */

window.GCS_SURVEY = {
  /**
   * 'pending'   — no survey conducted yet; the dashboard shows an empty state.
   * 'collected' — real data below; the dashboard renders the comparison.
   */
  status: 'pending',

  methodology: {
    instrument: 'Three yes/no questions, asked on paper immediately before and immediately after each career-guidance workshop.',
    instrument_te: 'మూడు అవును/కాదు ప్రశ్నలు — ప్రతి వర్క్‌షాప్‌కు ముందు మరియు వెంటనే తర్వాత కాగితంపై అడిగినవి.',
    consent: 'Participation was voluntary and anonymous. No names, phone numbers or photographs were recorded on the survey forms.',
    consent_te: 'పాల్గొనడం స్వచ్ఛందం మరియు అజ్ఞాతం. సర్వే ఫారమ్‌లలో పేర్లు, ఫోన్ నంబర్లు లేదా ఫోటోలు నమోదు చేయబడలేదు.',
    collectedBy: '',   // e.g. 'B.Tech CSE CSP team, <college name>'
    firstWorkshop: '', // 'YYYY-MM-DD'
    lastWorkshop: ''   // 'YYYY-MM-DD'
  },

  /**
   * The three metrics named in the project's problem statement.
   * beforeYes / afterYes / respondents stay null until a survey is run.
   */
  metrics: [
    {
      id: 'career-paths',
      question_en: 'Can you name three or more career paths open to you after your current qualification?',
      question_te: 'మీ ప్రస్తుత విద్యార్హత తర్వాత మీకు అందుబాటులో ఉన్న మూడు లేదా అంతకంటే ఎక్కువ కెరీర్ మార్గాలను చెప్పగలరా?',
      beforeYes: null,
      afterYes: null,
      respondents: null
    },
    {
      id: 'online-apply',
      question_en: 'Do you know how to apply for a job or an exam online?',
      question_te: 'ఉద్యోగం లేదా పరీక్షకు ఆన్‌లైన్‌లో ఎలా దరఖాస్తు చేయాలో మీకు తెలుసా?',
      beforeYes: null,
      afterYes: null,
      respondents: null
    },
    {
      id: 'resume',
      question_en: 'Can you produce a PDF resume for yourself?',
      question_te: 'మీ కోసం మీరే PDF రెజ్యూమె తయారు చేయగలరా?',
      beforeYes: null,
      afterYes: null,
      respondents: null
    }
  ],

  /**
   * One entry per workshop actually conducted.
   * { date: 'YYYY-MM-DD', village: '', district: '', participants: 0 }
   */
  workshops: []
};
