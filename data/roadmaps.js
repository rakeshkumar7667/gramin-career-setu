/**
 * Gramin Career Setu — Career Roadmaps
 * ─────────────────────────────────────
 * One roadmap per career goal, as an ordered list of steps. Each step knows the
 * education level it begins from, so the page can start the flow where the
 * student actually is: a 10th-pass student who picks "Police" is shown that
 * Intermediate comes first, rather than a generic path that assumes a degree.
 *
 * ── WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN ───────────────────────────
 *
 * No age limits. No application fees in rupees. No vacancy counts. No exam
 * dates. No physical measurement standards. No cut-off marks.
 *
 * Those change with every recruitment notification, and they differ between
 * posts within the same notification. We checked: public summaries of the same
 * AP Police recruitment disagree with each other on the age band. A number
 * written here would be wrong within months, and nobody will be maintaining
 * this file after the project is handed over — a confidently wrong age limit
 * would do a student more harm than no number at all.
 *
 * So every step encodes only what stays true for years — the ORDER of the
 * stages, what each stage is, roughly how long it takes, and whether it costs
 * money — and points at the official portal for everything else. `verify` is
 * the line shown to the student telling them what to go and check there.
 *
 * ── LEVELS ─────────────────────────────────────────────────────────────────
 * 'below10' | '10th' | 'inter' | 'iti' | 'degree'
 * `fromLevel` on a step is the level a student must already hold to begin it.
 *
 * ── REVIEWING THIS FILE ────────────────────────────────────────────────────
 * Before a workshop, open each `officialUrl` and confirm the portal still
 * exists and still covers that stage, then update `lastReviewed`. That check
 * takes about twenty minutes for the whole file.
 */

window.GCS_ROADMAPS = {
  lastReviewed: '2026-10-31',

  levelLabels: {
    below10:  { en: 'Studying before 10th', te: '10వ తరగతి కంటే ముందు' },
    '10th':   { en: '10th pass',            te: '10వ తరగతి పాస్' },
    inter:    { en: 'Intermediate pass',    te: 'ఇంటర్మీడియట్ పాస్' },
    iti:      { en: 'ITI / Diploma',        te: 'ఐటీఐ / డిప్లొమా' },
    degree:   { en: 'Degree pass',          te: 'డిగ్రీ పాస్' }
  },

  goals: [
    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'police',
      icon: 'local_police',
      track: 'government',
      titleEn: 'Police Constable or Sub-Inspector',
      titleTe: 'పోలీస్ కానిస్టేబుల్ లేదా సబ్ ఇన్‌స్పెక్టర్',
      summaryEn: 'Join the Andhra Pradesh police as a Constable after Intermediate, or as a Sub-Inspector after a degree.',
      summaryTe: 'ఇంటర్ తర్వాత కానిస్టేబుల్‌గా, డిగ్రీ తర్వాత సబ్ ఇన్‌స్పెక్టర్‌గా ఆంధ్రప్రదేశ్ పోలీస్‌లో చేరవచ్చు.',
      realityEn: 'You cannot join the police directly after 10th. Constable needs Intermediate; Sub-Inspector needs a degree. Both have a physical test as well as a written exam, so start running and training early — that part costs nothing.',
      realityTe: '10వ తరగతి తర్వాత నేరుగా పోలీస్‌లో చేరలేరు. కానిస్టేబుల్‌కు ఇంటర్, ఎస్‌ఐకి డిగ్రీ కావాలి. రెండింటికీ రాత పరీక్షతో పాటు శారీరక పరీక్ష ఉంటుంది — కాబట్టి ఇప్పటి నుంచే పరుగు, వ్యాయామం మొదలుపెట్టండి. దానికి డబ్బు ఖర్చు లేదు.',
      steps: [
        {
          id: 'p1', fromLevel: '10th',
          titleEn: 'Complete Intermediate (any group)',
          titleTe: 'ఇంటర్మీడియట్ పూర్తి చేయండి (ఏ గ్రూప్ అయినా)',
          durationEn: '2 years', durationTe: '2 సంవత్సరాలు',
          whatEn: 'Constable recruitment needs Intermediate or an equivalent qualification. Any group works — MPC, BiPC, CEC or MEC — so choose what you can study well.',
          whatTe: 'కానిస్టేబుల్ నియామకానికి ఇంటర్మీడియట్ లేదా తత్సమాన అర్హత కావాలి. ఏ గ్రూప్ అయినా సరిపోతుంది — MPC, BiPC, CEC లేదా MEC — కాబట్టి మీరు బాగా చదవగలిగేది ఎంచుకోండి.',
          howEn: [
            'Join a government junior college in your mandal — fees are minimal.',
            'If you cannot attend regularly, enrol in AP Open School (APOSS) instead.',
            'Start physical training now: running, push-ups, long jump. It is free and it is half the selection.'
          ],
          howTe: [
            'మీ మండలంలోని ప్రభుత్వ జూనియర్ కాలేజీలో చేరండి — ఫీజు చాలా తక్కువ.',
            'క్రమం తప్పకుండా వెళ్లలేకపోతే AP ఓపెన్ స్కూల్ (APOSS)లో చేరండి.',
            'ఇప్పటి నుంచే శారీరక సాధన మొదలుపెట్టండి: పరుగు, పుష్-అప్స్, లాంగ్ జంప్. ఇది ఉచితం, ఎంపికలో సగం భాగం.'
          ],
          costEn: 'Government junior college fees are low. APOSS charges a small exam fee.',
          costTe: 'ప్రభుత్వ జూనియర్ కాలేజీ ఫీజు తక్కువ. APOSS కొద్దిపాటి పరీక్ష ఫీజు తీసుకుంటుంది.',
          officialName: 'AP Board of Intermediate Education',
          officialUrl: 'https://bie.ap.gov.in',
          verifyEn: 'Check admission dates for the academic year on the board website.',
          verifyTe: 'ఆ సంవత్సరపు ప్రవేశ తేదీలను బోర్డు వెబ్‌సైట్‌లో చూడండి.'
        },
        {
          id: 'p2', fromLevel: 'inter',
          titleEn: 'Prepare for the Constable written exam',
          titleTe: 'కానిస్టేబుల్ రాత పరీక్షకు సిద్ధం అవ్వండి',
          durationEn: '4 – 8 months', durationTe: '4 – 8 నెలలు',
          whatEn: 'The written exam covers arithmetic, reasoning, general studies and current affairs. Alongside it you must clear a physical measurement and efficiency test.',
          whatTe: 'రాత పరీక్షలో అంకగణితం, రీజనింగ్, జనరల్ స్టడీస్, కరెంట్ అఫైర్స్ ఉంటాయి. దానితో పాటు శారీరక కొలతలు మరియు సామర్థ్య పరీక్ష కూడా ఉత్తీర్ణత సాధించాలి.',
          howEn: [
            'Download previous question papers free from the SLPRB website.',
            'Read a Telugu newspaper daily for current affairs — no coaching fee needed.',
            'Train physically six days a week; the running standard is where most candidates fail.',
            'Free coaching is sometimes offered by the state for SC/ST/BC candidates — ask at your Mandal office.'
          ],
          howTe: [
            'SLPRB వెబ్‌సైట్ నుంచి పాత ప్రశ్నపత్రాలను ఉచితంగా డౌన్‌లోడ్ చేసుకోండి.',
            'కరెంట్ అఫైర్స్ కోసం ప్రతిరోజూ తెలుగు వార్తాపత్రిక చదవండి — కోచింగ్ ఫీజు అవసరం లేదు.',
            'వారానికి ఆరు రోజులు శారీరక సాధన చేయండి; చాలా మంది పరుగు పరీక్షలోనే విఫలమవుతారు.',
            'SC/ST/BC అభ్యర్థులకు ప్రభుత్వం కొన్నిసార్లు ఉచిత కోచింగ్ ఇస్తుంది — మీ మండల కార్యాలయంలో అడగండి.'
          ],
          costEn: 'Self-study is free. Coaching is optional, not required.',
          costTe: 'స్వయం అధ్యయనం ఉచితం. కోచింగ్ ఐచ్ఛికం, తప్పనిసరి కాదు.',
          officialName: 'AP State Level Police Recruitment Board',
          officialUrl: 'https://slprb.ap.gov.in',
          verifyEn: 'Check the current notification for the exact syllabus, age limit and physical standards — these change with every recruitment.',
          verifyTe: 'ఖచ్చితమైన సిలబస్, వయో పరిమితి, శారీరక ప్రమాణాల కోసం ప్రస్తుత నోటిఫికేషన్ చూడండి — ప్రతి నియామకంలో ఇవి మారుతాయి.'
        },
        {
          id: 'p3', fromLevel: 'inter',
          titleEn: 'Apply when the notification opens',
          titleTe: 'నోటిఫికేషన్ వచ్చినప్పుడు దరఖాస్తు చేయండి',
          durationEn: 'Application window is usually 3 – 4 weeks', durationTe: 'దరఖాస్తు గడువు సాధారణంగా 3 – 4 వారాలు',
          whatEn: 'Recruitment opens only when SLPRB publishes a notification. Applications are online, and the window is short — missing it means waiting for the next cycle.',
          whatTe: 'SLPRB నోటిఫికేషన్ ఇచ్చినప్పుడు మాత్రమే నియామకం జరుగుతుంది. దరఖాస్తులు ఆన్‌లైన్‌లో ఉంటాయి, గడువు తక్కువ — తప్పిపోతే తదుపరి సారి వరకు ఆగాలి.',
          howEn: [
            'Keep these ready in advance: Aadhaar, 10th and Intermediate certificates, caste certificate, passport photo and signature scans.',
            'Check slprb.ap.gov.in every month, or ask your village volunteer to check for you.',
            'Apply from a Digital Seva / CSC centre if you do not have a computer — they charge a small fee.',
            'Save your application number and print the acknowledgement.'
          ],
          howTe: [
            'ఇవి ముందుగానే సిద్ధంగా ఉంచుకోండి: ఆధార్, 10వ తరగతి మరియు ఇంటర్ సర్టిఫికెట్లు, కుల ధ్రువీకరణ పత్రం, పాస్‌పోర్ట్ ఫోటో, సంతకం స్కాన్.',
            'ప్రతి నెలా slprb.ap.gov.in చూడండి, లేదా మీ గ్రామ వాలంటీర్‌ను చూడమని అడగండి.',
            'కంప్యూటర్ లేకపోతే డిజిటల్ సేవా / CSC కేంద్రం నుంచి దరఖాస్తు చేయండి — వారు కొద్దిపాటి రుసుము తీసుకుంటారు.',
            'మీ దరఖాస్తు నంబర్ భద్రపరచుకోండి, అక్నాలెడ్జ్‌మెంట్ ప్రింట్ తీసుకోండి.'
          ],
          costEn: 'Government application fee applies; fee concessions usually exist for SC/ST/BC candidates.',
          costTe: 'ప్రభుత్వ దరఖాస్తు రుసుము ఉంటుంది; SC/ST/BC అభ్యర్థులకు సాధారణంగా రాయితీ ఉంటుంది.',
          officialName: 'SLPRB Andhra Pradesh — notifications',
          officialUrl: 'https://slprb.ap.gov.in',
          verifyEn: 'The fee amount and last date are in the notification itself. Never pay anyone who promises a job.',
          verifyTe: 'రుసుము మొత్తం, చివరి తేదీ నోటిఫికేషన్‌లోనే ఉంటాయి. ఉద్యోగం ఇప్పిస్తానని చెప్పే వారికి డబ్బు ఇవ్వకండి.'
        },
        {
          id: 'p4', fromLevel: 'inter',
          titleEn: 'Clear the selection stages',
          titleTe: 'ఎంపిక దశలను పూర్తి చేయండి',
          durationEn: 'Spread over several months', durationTe: 'కొన్ని నెలల పాటు',
          whatEn: 'Selection runs in stages: a preliminary written test, physical measurement and efficiency tests, a final written exam, and medical verification.',
          whatTe: 'ఎంపిక దశలవారీగా జరుగుతుంది: ప్రాథమిక రాత పరీక్ష, శారీరక కొలతలు మరియు సామర్థ్య పరీక్షలు, తుది రాత పరీక్ష, వైద్య పరీక్ష.',
          howEn: [
            'Attend every stage on the date given — there are no second chances for a missed stage.',
            'Carry original certificates to verification, not just photocopies.',
            'Keep training between stages; the gap is where people lose fitness.'
          ],
          howTe: [
            'ప్రతి దశకు ఇచ్చిన తేదీనే హాజరవ్వండి — తప్పిన దశకు మరో అవకాశం ఉండదు.',
            'ధ్రువీకరణకు జిరాక్స్ కాపీలే కాదు, ఒరిజినల్ సర్టిఫికెట్లు తీసుకెళ్లండి.',
            'దశల మధ్య కూడా సాధన కొనసాగించండి; ఈ విరామంలోనే చాలామంది ఫిట్‌నెస్ కోల్పోతారు.'
          ],
          costEn: 'No further fee after the application. Travel to test centres is at your own cost.',
          costTe: 'దరఖాస్తు తర్వాత మరో రుసుము లేదు. పరీక్ష కేంద్రాలకు ప్రయాణ ఖర్చు మీదే.',
          officialName: 'SLPRB Andhra Pradesh',
          officialUrl: 'https://slprb.ap.gov.in',
          verifyEn: 'Stage dates and admit cards are published only on the official site.',
          verifyTe: 'దశల తేదీలు, హాల్ టికెట్లు అధికారిక సైట్‌లో మాత్రమే ఉంటాయి.'
        },
        {
          id: 'p5', fromLevel: 'degree',
          titleEn: 'Or aim for Sub-Inspector with a degree',
          titleTe: 'లేదా డిగ్రీతో సబ్ ఇన్‌స్పెక్టర్ లక్ష్యంగా పెట్టుకోండి',
          durationEn: 'Degree 3 years, then 6 – 12 months preparation',
          durationTe: 'డిగ్రీ 3 సంవత్సరాలు, తర్వాత 6 – 12 నెలల సన్నద్ధత',
          whatEn: 'Sub-Inspector is a higher post with higher pay and requires a bachelor’s degree in any subject. The exam is harder and has more papers, but the physical test is similar.',
          whatTe: 'సబ్ ఇన్‌స్పెక్టర్ ఉన్నత పోస్టు, జీతం ఎక్కువ. ఏ సబ్జెక్టులోనైనా డిగ్రీ ఉండాలి. పరీక్ష కష్టంగా ఉంటుంది, పేపర్లు ఎక్కువ, కానీ శారీరక పరీక్ష దాదాపు ఒకేలా ఉంటుంది.',
          howEn: [
            'Any degree qualifies — a government degree college costs very little.',
            'Prepare for SI and Constable together; the syllabus overlaps heavily.',
            'You can work as a Constable and still write the SI exam later.'
          ],
          howTe: [
            'ఏ డిగ్రీ అయినా సరిపోతుంది — ప్రభుత్వ డిగ్రీ కాలేజీ ఖర్చు చాలా తక్కువ.',
            'ఎస్‌ఐ మరియు కానిస్టేబుల్ రెండింటికీ కలిపి సిద్ధం అవ్వండి; సిలబస్ చాలావరకు ఒకటే.',
            'కానిస్టేబుల్‌గా పనిచేస్తూ కూడా తర్వాత ఎస్‌ఐ పరీక్ష రాయవచ్చు.'
          ],
          costEn: 'Government degree college fees are low; scholarships cover most of it for eligible students.',
          costTe: 'ప్రభుత్వ డిగ్రీ కాలేజీ ఫీజు తక్కువ; అర్హులైన విద్యార్థులకు స్కాలర్‌షిప్‌లు చాలావరకు భరిస్తాయి.',
          officialName: 'SLPRB Andhra Pradesh',
          officialUrl: 'https://slprb.ap.gov.in',
          verifyEn: 'SI and Constable notifications are separate. Check which posts are open in the current cycle.',
          verifyTe: 'ఎస్‌ఐ, కానిస్టేబుల్ నోటిఫికేషన్లు వేరువేరు. ప్రస్తుత నియామకంలో ఏ పోస్టులు ఉన్నాయో చూడండి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Home Guard', titleTe: 'హోం గార్డ్',
          whyEn: 'A way into police work with a lower entry bar, and the experience can help in later recruitment.',
          whyTe: 'తక్కువ అర్హతతో పోలీస్ రంగంలోకి ప్రవేశించే మార్గం; ఈ అనుభవం తర్వాతి నియామకాల్లో ఉపయోగపడుతుంది.',
          fromLevel: '10th',
          officialName: 'AP Police', officialUrl: 'https://www.appolice.gov.in'
        },
        {
          titleEn: 'Fireman / Warder', titleTe: 'ఫైర్‌మెన్ / వార్డర్',
          whyEn: 'Recruited by the same board, often in the same notification, with similar physical tests.',
          whyTe: 'అదే బోర్డు, తరచూ అదే నోటిఫికేషన్‌లో నియమిస్తుంది; శారీరక పరీక్షలు దాదాపు ఒకేలా ఉంటాయి.',
          fromLevel: 'inter',
          officialName: 'SLPRB Andhra Pradesh', officialUrl: 'https://slprb.ap.gov.in'
        },
        {
          titleEn: 'Army / CAPF (BSF, CRPF, CISF)', titleTe: 'ఆర్మీ / CAPF (BSF, CRPF, CISF)',
          whyEn: 'Central uniformed services recruit at 10th and 12th level, with similar fitness requirements.',
          whyTe: 'కేంద్ర యూనిఫాం సేవలు 10వ తరగతి, ఇంటర్ స్థాయిలో నియమిస్తాయి; ఫిట్‌నెస్ అవసరాలు దాదాపు ఒకేలా ఉంటాయి.',
          fromLevel: '10th',
          officialName: 'Join Indian Army', officialUrl: 'https://joinindianarmy.nic.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'doctor',
      icon: 'stethoscope',
      track: 'government',
      titleEn: 'Doctor and other health careers',
      titleTe: 'డాక్టర్ మరియు ఇతర ఆరోగ్య రంగ వృత్తులు',
      summaryEn: 'The MBBS route through NEET, and the shorter health-care routes that are far easier to reach.',
      summaryTe: 'NEET ద్వారా MBBS మార్గం, మరియు చాలా సులభంగా చేరుకోగల తక్కువ వ్యవధి ఆరోగ్య రంగ మార్గాలు.',
      realityEn: 'Be clear about this one. MBBS takes about 10 years from 10th, needs Intermediate with Biology, and NEET is one of the hardest exams in India — lakhs compete for a small number of government seats, and a private seat costs more than most rural families can raise. It is possible, and some do it. But there are five other health careers below that you can reach in 1–4 years, that serve the same patients, and that your village actually needs. Look at both before you decide.',
      realityTe: 'ఈ విషయంలో స్పష్టత అవసరం. 10వ తరగతి నుంచి MBBS కు దాదాపు 10 సంవత్సరాలు పడుతుంది, బయాలజీతో ఇంటర్ ఉండాలి, NEET భారతదేశంలో అత్యంత కష్టమైన పరీక్షల్లో ఒకటి — కొద్ది ప్రభుత్వ సీట్ల కోసం లక్షల మంది పోటీపడతారు, ప్రైవేట్ సీటు ఖర్చు చాలా గ్రామీణ కుటుంబాలకు భరించలేనిది. సాధ్యమే, కొందరు సాధిస్తారు కూడా. కానీ కింద ఉన్న మరో ఐదు ఆరోగ్య రంగ వృత్తులు 1–4 సంవత్సరాల్లో చేరుకోవచ్చు, అవే రోగులకు సేవ చేస్తాయి, మీ గ్రామానికి నిజంగా అవసరమైనవి. నిర్ణయించుకునే ముందు రెండింటినీ చూడండి.',
      steps: [
        {
          id: 'd1', fromLevel: '10th',
          titleEn: 'Take Intermediate with Biology (BiPC)',
          titleTe: 'బయాలజీతో ఇంటర్మీడియట్ (BiPC) చదవండి',
          durationEn: '2 years', durationTe: '2 సంవత్సరాలు',
          whatEn: 'This is the one gate you cannot go around. NEET is only open to students who studied Physics, Chemistry and Biology at Intermediate. Choosing MPC or CEC closes the medical route.',
          whatTe: 'ఇది తప్పించుకోలేని ఏకైక ద్వారం. ఇంటర్‌లో ఫిజిక్స్, కెమిస్ట్రీ, బయాలజీ చదివిన విద్యార్థులకు మాత్రమే NEET అవకాశం ఉంటుంది. MPC లేదా CEC ఎంచుకుంటే వైద్య మార్గం మూసుకుపోతుంది.',
          howEn: [
            'Choose the BiPC group when you join junior college.',
            'A government junior college is enough — a costly corporate college is not required to clear NEET.',
            'Build a strong Biology base in the first year; NEET is mostly Biology by weight.'
          ],
          howTe: [
            'జూనియర్ కాలేజీలో చేరేటప్పుడు BiPC గ్రూప్ ఎంచుకోండి.',
            'ప్రభుత్వ జూనియర్ కాలేజీ సరిపోతుంది — NEET సాధించడానికి ఖరీదైన కార్పొరేట్ కాలేజీ అవసరం లేదు.',
            'మొదటి సంవత్సరంలోనే బయాలజీలో బలమైన పునాది వేసుకోండి; NEETలో బయాలజీకే ఎక్కువ వెయిటేజ్.'
          ],
          costEn: 'Government junior college fees are low. Post-matric scholarships are available for eligible students.',
          costTe: 'ప్రభుత్వ జూనియర్ కాలేజీ ఫీజు తక్కువ. అర్హులైన విద్యార్థులకు పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్‌లు ఉన్నాయి.',
          officialName: 'AP Board of Intermediate Education',
          officialUrl: 'https://bie.ap.gov.in',
          verifyEn: 'Confirm the BiPC group is offered at the college before you take admission.',
          verifyTe: 'ప్రవేశం తీసుకునే ముందు ఆ కాలేజీలో BiPC గ్రూప్ ఉందో లేదో నిర్ధారించుకోండి.'
        },
        {
          id: 'd2', fromLevel: 'inter',
          titleEn: 'Write NEET-UG',
          titleTe: 'NEET-UG రాయండి',
          durationEn: '1 – 2 years of preparation', durationTe: '1 – 2 సంవత్సరాల సన్నద్ధత',
          whatEn: 'NEET-UG is the single national entrance exam for MBBS, BDS, BAMS, BHMS and several allied courses. Your rank decides whether you get a government seat.',
          whatTe: 'MBBS, BDS, BAMS, BHMS మరియు పలు అనుబంధ కోర్సులకు NEET-UG ఒక్కటే జాతీయ ప్రవేశ పరీక్ష. మీ ర్యాంక్‌ను బట్టి ప్రభుత్వ సీటు వస్తుందో లేదో నిర్ణయమవుతుంది.',
          howEn: [
            'Study NCERT Biology thoroughly — it carries most of the paper.',
            'Use free resources: NTA’s own sample papers, and SWAYAM / DIKSHA lessons.',
            'Sit previous years’ papers under exam timing.',
            'A low rank still opens BAMS, BHMS, BSc Nursing and allied courses — it is not pass or fail.'
          ],
          howTe: [
            'NCERT బయాలజీని పూర్తిగా చదవండి — పేపర్‌లో ఎక్కువ భాగం దాని నుంచే.',
            'ఉచిత వనరులు వాడండి: NTA సొంత నమూనా పత్రాలు, SWAYAM / DIKSHA పాఠాలు.',
            'పాత సంవత్సరాల ప్రశ్నపత్రాలను పరీక్ష సమయ నిబంధనలతో రాయండి.',
            'తక్కువ ర్యాంక్ వచ్చినా BAMS, BHMS, బీఎస్సీ నర్సింగ్, అనుబంధ కోర్సులకు అవకాశం ఉంటుంది — ఇది పాస్/ఫెయిల్ కాదు.'
          ],
          costEn: 'NTA charges an exam fee. Self-study with NCERT and free online material is realistic.',
          costTe: 'NTA పరీక్ష రుసుము తీసుకుంటుంది. NCERT మరియు ఉచిత ఆన్‌లైన్ వనరులతో స్వయం అధ్యయనం చేయడం సాధ్యమే.',
          officialName: 'National Testing Agency — NEET',
          officialUrl: 'https://neet.nta.nic.in',
          verifyEn: 'Registration dates, fee and syllabus are announced fresh each year on the NTA site.',
          verifyTe: 'రిజిస్ట్రేషన్ తేదీలు, రుసుము, సిలబస్ ప్రతి సంవత్సరం NTA సైట్‌లో కొత్తగా ప్రకటిస్తారు.'
        },
        {
          id: 'd3', fromLevel: 'inter',
          titleEn: 'Counselling and admission',
          titleTe: 'కౌన్సెలింగ్ మరియు ప్రవేశం',
          durationEn: 'A few months after the result', durationTe: 'ఫలితం తర్వాత కొన్ని నెలలు',
          whatEn: 'Seats are allotted through counselling, not by applying to colleges directly. AP has a state quota alongside the all-India quota.',
          whatTe: 'సీట్లు కౌన్సెలింగ్ ద్వారా కేటాయిస్తారు, నేరుగా కాలేజీలకు దరఖాస్తు చేయడం ద్వారా కాదు. అఖిల భారత కోటాతో పాటు ఏపీకి రాష్ట్ర కోటా ఉంటుంది.',
          howEn: [
            'Register for both all-India and AP state counselling if you are eligible.',
            'Keep caste, income and residence certificates ready — reserved seats need them.',
            'Fill many choices, not just the famous colleges.'
          ],
          howTe: [
            'అర్హత ఉంటే అఖిల భారత మరియు ఏపీ రాష్ట్ర కౌన్సెలింగ్ రెండింటికీ నమోదు చేసుకోండి.',
            'కుల, ఆదాయ, నివాస ధ్రువీకరణ పత్రాలు సిద్ధంగా ఉంచుకోండి — రిజర్వ్‌డ్ సీట్లకు ఇవి కావాలి.',
            'పేరున్న కాలేజీలు మాత్రమే కాకుండా ఎక్కువ ఆప్షన్లు ఇవ్వండి.'
          ],
          costEn: 'Government college fees are modest. Private and deemed college fees are very high — check before accepting a seat.',
          costTe: 'ప్రభుత్వ కాలేజీ ఫీజు మధ్యస్థం. ప్రైవేట్, డీమ్డ్ కాలేజీల ఫీజు చాలా ఎక్కువ — సీటు తీసుకునే ముందు చూసుకోండి.',
          officialName: 'Dr. NTR University of Health Sciences',
          officialUrl: 'https://drntr.uhsap.in',
          verifyEn: 'Counselling schedule and seat matrix are published by the university each year.',
          verifyTe: 'కౌన్సెలింగ్ షెడ్యూల్, సీట్ మ్యాట్రిక్స్ ప్రతి సంవత్సరం యూనివర్సిటీ ప్రకటిస్తుంది.'
        },
        {
          id: 'd4', fromLevel: 'degree',
          titleEn: 'MBBS, internship and registration',
          titleTe: 'MBBS, ఇంటర్న్‌షిప్ మరియు రిజిస్ట్రేషన్',
          durationEn: '5.5 years including internship', durationTe: 'ఇంటర్న్‌షిప్‌తో కలిపి 5.5 సంవత్సరాలు',
          whatEn: 'MBBS is four and a half years of study plus a one-year rotating internship. After that you register with the state medical council and can practise.',
          whatTe: 'MBBS అంటే నాలుగున్నర సంవత్సరాల చదువు, దానితో పాటు ఒక సంవత్సరం రొటేటింగ్ ఇంటర్న్‌షిప్. తర్వాత రాష్ట్ర మెడికల్ కౌన్సిల్‌లో నమోదు చేసుకుని ప్రాక్టీస్ చేయవచ్చు.',
          howEn: [
            'The internship is paid with a stipend.',
            'Government medical colleges often have a rural service bond — read it before you sign.',
            'Specialisation (MD/MS) needs NEET-PG afterwards; it is optional.'
          ],
          howTe: [
            'ఇంటర్న్‌షిప్‌కు స్టైపెండ్ ఇస్తారు.',
            'ప్రభుత్వ మెడికల్ కాలేజీల్లో తరచూ గ్రామీణ సేవా బాండ్ ఉంటుంది — సంతకం చేసే ముందు చదవండి.',
            'స్పెషలైజేషన్ (MD/MS) కోసం తర్వాత NEET-PG రాయాలి; ఇది ఐచ్ఛికం.'
          ],
          costEn: 'Government seat: low fees. Private seat: very high, often requiring a loan.',
          costTe: 'ప్రభుత్వ సీటు: ఫీజు తక్కువ. ప్రైవేట్ సీటు: చాలా ఎక్కువ, తరచూ రుణం అవసరం.',
          officialName: 'National Medical Commission',
          officialUrl: 'https://www.nmc.org.in',
          verifyEn: 'Confirm any college is NMC-recognised before paying a rupee.',
          verifyTe: 'ఒక్క రూపాయి కట్టే ముందు ఆ కాలేజీకి NMC గుర్తింపు ఉందో లేదో నిర్ధారించుకోండి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'B.Sc Nursing', titleTe: 'బీఎస్సీ నర్సింగ్',
          whyEn: '4 years after BiPC. Strong government and private demand, and nurses are recruited abroad as well.',
          whyTe: 'BiPC తర్వాత 4 సంవత్సరాలు. ప్రభుత్వ, ప్రైవేట్ రంగాల్లో మంచి డిమాండ్; విదేశాల్లోనూ నర్సులకు అవకాశాలు.',
          fromLevel: 'inter',
          officialName: 'Indian Nursing Council', officialUrl: 'https://www.indiannursingcouncil.org'
        },
        {
          titleEn: 'GNM / ANM nursing', titleTe: 'GNM / ANM నర్సింగ్',
          whyEn: 'ANM is about 2 years, GNM about 3. ANM posts are recruited directly into village sub-centres — this is the health worker your own village sees most.',
          whyTe: 'ANM దాదాపు 2 సంవత్సరాలు, GNM దాదాపు 3. ANM పోస్టులను నేరుగా గ్రామ సబ్-సెంటర్లలో నియమిస్తారు — మీ గ్రామంలో ఎక్కువగా కనిపించే ఆరోగ్య కార్యకర్త ఈమే.',
          fromLevel: 'inter',
          officialName: 'Indian Nursing Council', officialUrl: 'https://www.indiannursingcouncil.org'
        },
        {
          titleEn: 'D.Pharm / B.Pharm', titleTe: 'డి.ఫార్మ్ / బి.ఫార్మ్',
          whyEn: 'D.Pharm is 2 years and lets you work in or open a medical shop — a steady rural business.',
          whyTe: 'డి.ఫార్మ్ 2 సంవత్సరాలు; మెడికల్ షాపులో పనిచేయవచ్చు లేదా సొంతంగా పెట్టుకోవచ్చు — గ్రామాల్లో స్థిరమైన వ్యాపారం.',
          fromLevel: 'inter',
          officialName: 'Pharmacy Council of India', officialUrl: 'https://www.pci.nic.in'
        },
        {
          titleEn: 'Paramedical: lab technician, radiology, OT assistant',
          titleTe: 'పారామెడికల్: ల్యాబ్ టెక్నీషియన్, రేడియాలజీ, OT అసిస్టెంట్',
          whyEn: '1 – 3 year diplomas. Every hospital and diagnostic lab needs them, including in small towns.',
          whyTe: '1 – 3 సంవత్సరాల డిప్లొమాలు. చిన్న పట్టణాల్లో సహా ప్రతి ఆసుపత్రికి, డయాగ్నస్టిక్ ల్యాబ్‌కు వీరు అవసరం.',
          fromLevel: 'inter',
          officialName: 'National Commission for Allied and Healthcare Professions',
          officialUrl: 'https://www.nchp.gov.in'
        },
        {
          titleEn: 'ASHA worker / Anganwadi', titleTe: 'ఆశా కార్యకర్త / అంగన్‌వాడీ',
          whyEn: 'Reachable after 10th or Intermediate, recruited within your own village, and a real entry into community health work.',
          whyTe: '10వ తరగతి లేదా ఇంటర్ తర్వాత అందుబాటులో; మీ గ్రామంలోనే నియామకం; సామాజిక ఆరోగ్య రంగంలోకి నిజమైన ప్రవేశం.',
          fromLevel: '10th',
          officialName: 'AP Women & Child Welfare', officialUrl: 'https://wdcw.ap.gov.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'teacher',
      icon: 'school',
      track: 'government',
      titleEn: 'Government school teacher',
      titleTe: 'ప్రభుత్వ పాఠశాల ఉపాధ్యాయుడు',
      summaryEn: 'Become a primary or secondary school teacher through D.El.Ed or B.Ed, TET and the DSC recruitment.',
      summaryTe: 'D.El.Ed లేదా B.Ed, TET మరియు DSC నియామకం ద్వారా ప్రాథమిక లేదా ఉన్నత పాఠశాల ఉపాధ్యాయులుగా మారండి.',
      realityEn: 'Teaching needs a teacher-training qualification — a degree alone is not enough. The order is fixed: training course, then TET, then DSC. DSC notifications do not come every year, so clear TET early and keep the certificate ready.',
      realityTe: 'ఉపాధ్యాయ వృత్తికి ఉపాధ్యాయ శిక్షణ అర్హత తప్పనిసరి — డిగ్రీ ఒక్కటే సరిపోదు. క్రమం స్థిరంగా ఉంటుంది: శిక్షణ కోర్సు, తర్వాత TET, తర్వాత DSC. DSC నోటిఫికేషన్లు ప్రతి సంవత్సరం రావు, కాబట్టి TET ముందుగానే పూర్తి చేసి సర్టిఫికెట్ సిద్ధంగా ఉంచుకోండి.',
      steps: [
        {
          id: 't1', fromLevel: '10th',
          titleEn: 'Complete Intermediate',
          titleTe: 'ఇంటర్మీడియట్ పూర్తి చేయండి',
          durationEn: '2 years', durationTe: '2 సంవత్సరాలు',
          whatEn: 'Intermediate is the entry point for D.El.Ed, the two-year course that qualifies you to teach primary classes.',
          whatTe: 'ప్రాథమిక తరగతులు బోధించే అర్హతనిచ్చే రెండేళ్ల D.El.Ed కోర్సుకు ఇంటర్మీడియట్ ప్రవేశ స్థాయి.',
          howEn: [
            'Any group is accepted, but your Intermediate subjects affect which school subject you can later teach.',
            'If you want to teach Maths or Science later, take MPC or BiPC.'
          ],
          howTe: [
            'ఏ గ్రూప్ అయినా అంగీకరిస్తారు, కానీ మీరు తర్వాత ఏ సబ్జెక్టు బోధించగలరో ఇంటర్ సబ్జెక్టులు ప్రభావితం చేస్తాయి.',
            'తర్వాత లెక్కలు లేదా సైన్స్ బోధించాలనుకుంటే MPC లేదా BiPC తీసుకోండి.'
          ],
          costEn: 'Government junior college fees are low.',
          costTe: 'ప్రభుత్వ జూనియర్ కాలేజీ ఫీజు తక్కువ.',
          officialName: 'AP Board of Intermediate Education',
          officialUrl: 'https://bie.ap.gov.in',
          verifyEn: 'Check admission dates for the academic year.',
          verifyTe: 'ఆ సంవత్సరపు ప్రవేశ తేదీలను చూడండి.'
        },
        {
          id: 't2', fromLevel: 'inter',
          titleEn: 'Do D.El.Ed (primary) or a degree then B.Ed (secondary)',
          titleTe: 'D.El.Ed (ప్రాథమిక) చేయండి లేదా డిగ్రీ తర్వాత B.Ed (ఉన్నత) చేయండి',
          durationEn: 'D.El.Ed 2 years, or degree 3 years + B.Ed 2 years',
          durationTe: 'D.El.Ed 2 సంవత్సరాలు, లేదా డిగ్రీ 3 + B.Ed 2 సంవత్సరాలు',
          whatEn: 'D.El.Ed qualifies you for primary classes (1–5). For higher classes you need a degree followed by B.Ed. Choose based on which classes you want to teach.',
          whatTe: 'D.El.Ed ప్రాథమిక తరగతులకు (1–5) అర్హత ఇస్తుంది. ఉన్నత తరగతులకు డిగ్రీ తర్వాత B.Ed కావాలి. మీరు ఏ తరగతులు బోధించాలనుకుంటున్నారో దాన్ని బట్టి ఎంచుకోండి.',
          howEn: [
            'D.El.Ed admission in AP is through the DEECET entrance test.',
            'B.Ed admission is through EdCET after your degree.',
            'Make sure the college is recognised by NCTE — an unrecognised course will not be accepted at DSC.'
          ],
          howTe: [
            'ఏపీలో D.El.Ed ప్రవేశం DEECET ప్రవేశ పరీక్ష ద్వారా జరుగుతుంది.',
            'డిగ్రీ తర్వాత B.Ed ప్రవేశం EdCET ద్వారా ఉంటుంది.',
            'ఆ కాలేజీకి NCTE గుర్తింపు ఉందో లేదో నిర్ధారించుకోండి — గుర్తింపు లేని కోర్సును DSCలో అంగీకరించరు.'
          ],
          costEn: 'Government D.El.Ed colleges charge low fees. Private college fees vary a lot.',
          costTe: 'ప్రభుత్వ D.El.Ed కాలేజీల ఫీజు తక్కువ. ప్రైవేట్ కాలేజీల ఫీజు చాలా తేడాగా ఉంటుంది.',
          officialName: 'AP School Education Department',
          officialUrl: 'https://cse.ap.gov.in',
          verifyEn: 'Confirm NCTE recognition of the college on the NCTE website before admission.',
          verifyTe: 'ప్రవేశానికి ముందు NCTE వెబ్‌సైట్‌లో ఆ కాలేజీ గుర్తింపును నిర్ధారించుకోండి.'
        },
        {
          id: 't3', fromLevel: 'degree',
          titleEn: 'Clear AP TET',
          titleTe: 'AP TET ఉత్తీర్ణత సాధించండి',
          durationEn: '3 – 6 months of preparation', durationTe: '3 – 6 నెలల సన్నద్ధత',
          whatEn: 'The Teacher Eligibility Test is compulsory before you can be appointed. Paper 1 is for primary classes, Paper 2 for higher classes.',
          whatTe: 'నియామకానికి ముందు ఉపాధ్యాయ అర్హత పరీక్ష తప్పనిసరి. పేపర్ 1 ప్రాథమిక తరగతులకు, పేపర్ 2 ఉన్నత తరగతులకు.',
          howEn: [
            'Study the official TET syllabus and child development section carefully.',
            'Previous papers are free on the AP TET site.',
            'You can write TET more than once to improve your score.'
          ],
          howTe: [
            'అధికారిక TET సిలబస్‌ను, ముఖ్యంగా శిశు వికాస విభాగాన్ని శ్రద్ధగా చదవండి.',
            'పాత ప్రశ్నపత్రాలు AP TET సైట్‌లో ఉచితంగా లభిస్తాయి.',
            'స్కోర్ మెరుగుపరచుకోవడానికి TET ఒకటికంటే ఎక్కువసార్లు రాయవచ్చు.'
          ],
          costEn: 'Government exam fee only.',
          costTe: 'ప్రభుత్వ పరీక్ష రుసుము మాత్రమే.',
          officialName: 'AP TET',
          officialUrl: 'https://aptet.apcfss.in',
          verifyEn: 'Check the current notification for qualifying marks and certificate validity.',
          verifyTe: 'అర్హత మార్కులు, సర్టిఫికెట్ చెల్లుబాటు కోసం ప్రస్తుత నోటిఫికేషన్ చూడండి.'
        },
        {
          id: 't4', fromLevel: 'degree',
          titleEn: 'Apply through DSC and get posted',
          titleTe: 'DSC ద్వారా దరఖాస్తు చేసి పోస్టింగ్ పొందండి',
          durationEn: 'Depends on when DSC is notified', durationTe: 'DSC ఎప్పుడు ప్రకటిస్తారో దాన్ని బట్టి',
          whatEn: 'DSC is the actual teacher recruitment. Your DSC score, usually combined with your TET score, decides selection and the school you are posted to.',
          whatTe: 'DSC అసలు ఉపాధ్యాయ నియామకం. మీ DSC స్కోరు, సాధారణంగా TET స్కోరుతో కలిపి, ఎంపికను మరియు మీకు వచ్చే పాఠశాలను నిర్ణయిస్తుంది.',
          howEn: [
            'Keep TET certificate, degree, training certificate and caste certificate ready.',
            'Apply online within the notification window.',
            'Rural postings are often easier to get and count towards later transfers.'
          ],
          howTe: [
            'TET సర్టిఫికెట్, డిగ్రీ, శిక్షణ సర్టిఫికెట్, కుల ధ్రువీకరణ పత్రం సిద్ధంగా ఉంచుకోండి.',
            'నోటిఫికేషన్ గడువులోపు ఆన్‌లైన్‌లో దరఖాస్తు చేయండి.',
            'గ్రామీణ పోస్టింగ్‌లు తరచూ సులభంగా వస్తాయి, తర్వాతి బదిలీలకు కూడా ఉపయోగపడతాయి.'
          ],
          costEn: 'Government application fee applies.',
          costTe: 'ప్రభుత్వ దరఖాస్తు రుసుము ఉంటుంది.',
          officialName: 'AP School Education — DSC',
          officialUrl: 'https://cse.ap.gov.in',
          verifyEn: 'DSC is not held every year. Check the department site for the current notification.',
          verifyTe: 'DSC ప్రతి సంవత్సరం జరగదు. ప్రస్తుత నోటిఫికేషన్ కోసం శాఖ సైట్ చూడండి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Private school teacher', titleTe: 'ప్రైవేట్ పాఠశాల ఉపాధ్యాయుడు',
          whyEn: 'Hires without waiting for DSC. Lower pay, but it is real classroom experience while you prepare.',
          whyTe: 'DSC కోసం ఎదురుచూడకుండా నియమిస్తారు. జీతం తక్కువ, కానీ సిద్ధమవుతూనే నిజమైన తరగతి గది అనుభవం వస్తుంది.',
          fromLevel: 'degree',
          officialName: 'National Career Service', officialUrl: 'https://www.ncs.gov.in'
        },
        {
          titleEn: 'Anganwadi teacher', titleTe: 'అంగన్‌వాడీ టీచర్',
          whyEn: 'Recruited at 10th or Intermediate level, within your own village, working with pre-school children.',
          whyTe: '10వ తరగతి లేదా ఇంటర్ స్థాయిలో, మీ గ్రామంలోనే నియామకం; బడికి ముందు వయసు పిల్లలతో పని.',
          fromLevel: '10th',
          officialName: 'AP Women & Child Welfare', officialUrl: 'https://wdcw.ap.gov.in'
        },
        {
          titleEn: 'Lecturer in a junior college', titleTe: 'జూనియర్ కాలేజీ లెక్చరర్',
          whyEn: 'Needs a postgraduate degree instead of B.Ed, recruited through APPSC.',
          whyTe: 'B.Ed బదులు పోస్ట్ గ్రాడ్యుయేట్ డిగ్రీ కావాలి; APPSC ద్వారా నియామకం.',
          fromLevel: 'degree',
          officialName: 'APPSC', officialUrl: 'https://psc.ap.gov.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'govt-exam',
      icon: 'account_balance',
      track: 'government',
      titleEn: 'Central government job (Railway, SSC, Post Office)',
      titleTe: 'కేంద్ర ప్రభుత్వ ఉద్యోగం (రైల్వే, SSC, పోస్టాఫీసు)',
      summaryEn: 'Railway Group D and SSC MTS are open at 10th pass. Postal Assistant and SSC CHSL open at Intermediate.',
      summaryTe: 'రైల్వే గ్రూప్ D మరియు SSC MTS 10వ తరగతితోనే అందుబాటులో ఉంటాయి. పోస్టల్ అసిస్టెంట్, SSC CHSL ఇంటర్‌తో.',
      realityEn: 'This is the shortest honest route to a government job for a 10th-pass student. Competition is heavy, but the syllabus is school-level and you can prepare without coaching. The same preparation works for several exams at once, so you get many attempts from one effort.',
      realityTe: '10వ తరగతి పాసైన విద్యార్థికి ప్రభుత్వ ఉద్యోగానికి ఇదే అత్యంత తక్కువ వ్యవధి మార్గం. పోటీ ఎక్కువ, కానీ సిలబస్ పాఠశాల స్థాయిదే, కోచింగ్ లేకుండానే సిద్ధం కావచ్చు. ఒకే సన్నద్ధతతో పలు పరీక్షలు రాయవచ్చు, కాబట్టి ఒక ప్రయత్నంతో అనేక అవకాశాలు.',
      steps: [
        {
          id: 'g1', fromLevel: '10th',
          titleEn: 'Pick the exams you are already eligible for',
          titleTe: 'మీరు ఇప్పటికే అర్హులైన పరీక్షలను ఎంచుకోండి',
          durationEn: 'Start today', durationTe: 'ఈరోజే మొదలుపెట్టండి',
          whatEn: 'With 10th pass you can already write Railway Group D and SSC MTS. You do not need to wait for any further qualification.',
          whatTe: '10వ తరగతి పాసైతే రైల్వే గ్రూప్ D, SSC MTS ఇప్పుడే రాయవచ్చు. మరో అర్హత కోసం ఎదురుచూడాల్సిన అవసరం లేదు.',
          howEn: [
            'Register free on the National Career Service portal to see notifications.',
            'Create an email ID and keep one mobile number for all applications.',
            'Note that Railway Group D also has a physical efficiency test.'
          ],
          howTe: [
            'నోటిఫికేషన్లు చూడటానికి నేషనల్ కెరీర్ సర్వీస్ పోర్టల్‌లో ఉచితంగా నమోదు చేసుకోండి.',
            'ఒక ఈమెయిల్ ఐడీ సృష్టించి, అన్ని దరఖాస్తులకు ఒకే మొబైల్ నంబర్ వాడండి.',
            'రైల్వే గ్రూప్ Dకి శారీరక సామర్థ్య పరీక్ష కూడా ఉంటుందని గుర్తుంచుకోండి.'
          ],
          costEn: 'Free to start. Application fees come later, with concessions for reserved categories and women.',
          costTe: 'మొదలుపెట్టడం ఉచితం. దరఖాస్తు రుసుములు తర్వాత; రిజర్వ్‌డ్ కేటగిరీలకు, మహిళలకు రాయితీలు ఉంటాయి.',
          officialName: 'National Career Service',
          officialUrl: 'https://www.ncs.gov.in',
          verifyEn: 'Each exam has its own eligibility. Confirm on the exam’s own official site before applying.',
          verifyTe: 'ప్రతి పరీక్షకు సొంత అర్హత ఉంటుంది. దరఖాస్తుకు ముందు ఆ పరీక్ష అధికారిక సైట్‌లో నిర్ధారించుకోండి.'
        },
        {
          id: 'g2', fromLevel: '10th',
          titleEn: 'Build the common foundation',
          titleTe: 'ఉమ్మడి పునాది వేసుకోండి',
          durationEn: '4 – 6 months', durationTe: '4 – 6 నెలలు',
          whatEn: 'Almost every one of these exams tests the same four things: arithmetic, reasoning, general awareness and basic English. Prepare once, write many.',
          whatTe: 'ఈ పరీక్షలన్నీ దాదాపు ఒకే నాలుగు అంశాలను పరీక్షిస్తాయి: అంకగణితం, రీజనింగ్, జనరల్ అవేర్‌నెస్, ప్రాథమిక ఇంగ్లీష్. ఒకసారి సిద్ధమై, అనేకం రాయండి.',
          howEn: [
            'Work through 6th–10th NCERT maths — that is the real syllabus level.',
            'Practise reasoning puzzles daily; this section is the easiest to score in.',
            'Read a Telugu daily plus one English page for general awareness and English together.',
            'Use free mock tests on the official portals rather than paid apps.'
          ],
          howTe: [
            '6–10 తరగతుల NCERT గణితం పూర్తిగా సాధన చేయండి — అసలు సిలబస్ స్థాయి అదే.',
            'ప్రతిరోజూ రీజనింగ్ పజిల్స్ సాధన చేయండి; ఈ విభాగంలో మార్కులు సులభంగా వస్తాయి.',
            'జనరల్ అవేర్‌నెస్, ఇంగ్లీష్ రెండింటికీ కలిపి తెలుగు దినపత్రికతో పాటు ఒక ఇంగ్లీష్ పేజీ చదవండి.',
            'డబ్బు చెల్లించే యాప్‌ల కంటే అధికారిక పోర్టల్స్‌లోని ఉచిత మాక్ టెస్టులు వాడండి.'
          ],
          costEn: 'Free. NCERT books are free to download.',
          costTe: 'ఉచితం. NCERT పుస్తకాలు ఉచితంగా డౌన్‌లోడ్ చేసుకోవచ్చు.',
          officialName: 'NCERT e-books',
          officialUrl: 'https://ncert.nic.in/textbook.php',
          verifyEn: 'Check each exam’s official syllabus — the weightings differ slightly.',
          verifyTe: 'ప్రతి పరీక్ష అధికారిక సిలబస్ చూడండి — వెయిటేజీలు కొద్దిగా తేడాగా ఉంటాయి.'
        },
        {
          id: 'g3', fromLevel: '10th',
          titleEn: 'Apply to every notification you qualify for',
          titleTe: 'మీకు అర్హత ఉన్న ప్రతి నోటిఫికేషన్‌కూ దరఖాస్తు చేయండి',
          durationEn: 'Ongoing', durationTe: 'నిరంతరం',
          whatEn: 'These exams are not held on a fixed calendar. The students who get selected are usually the ones who applied to every cycle, not the ones who studied hardest for one.',
          whatTe: 'ఈ పరీక్షలు నిర్ణీత క్యాలెండర్ ప్రకారం జరగవు. ఎంపికయ్యేవారు సాధారణంగా ఒక్కదాని కోసం ఎక్కువ చదివినవారు కాదు — ప్రతి అవకాశానికీ దరఖాస్తు చేసినవారే.',
          howEn: [
            'Check rrbcdg.gov.in, ssc.gov.in and indiapost.gov.in every month.',
            'Apply even if you feel underprepared — the attempt itself teaches you the paper.',
            'Keep scanned documents in one folder so applying takes minutes, not days.'
          ],
          howTe: [
            'ప్రతి నెలా rrbcdg.gov.in, ssc.gov.in, indiapost.gov.in చూడండి.',
            'సన్నద్ధత సరిపోలేదనిపించినా దరఖాస్తు చేయండి — ఆ ప్రయత్నమే పేపర్‌ను నేర్పుతుంది.',
            'స్కాన్ చేసిన పత్రాలను ఒకే ఫోల్డర్‌లో ఉంచుకోండి, అప్పుడు దరఖాస్తుకు రోజులు కాదు, నిమిషాలే పడతాయి.'
          ],
          costEn: 'Application fee per exam, with concessions for SC/ST/PwD and women in many exams.',
          costTe: 'ప్రతి పరీక్షకు దరఖాస్తు రుసుము; చాలా పరీక్షల్లో SC/ST/దివ్యాంగులకు, మహిళలకు రాయితీ ఉంటుంది.',
          officialName: 'Staff Selection Commission',
          officialUrl: 'https://ssc.gov.in',
          verifyEn: 'Only apply on the official site. Agents who promise a government job are frauds.',
          verifyTe: 'అధికారిక సైట్‌లో మాత్రమే దరఖాస్తు చేయండి. ప్రభుత్వ ఉద్యోగం ఇప్పిస్తామని చెప్పే ఏజెంట్లు మోసగాళ్లు.'
        },
        {
          id: 'g4', fromLevel: 'inter',
          titleEn: 'Add the Intermediate-level exams',
          titleTe: 'ఇంటర్ స్థాయి పరీక్షలను కూడా చేర్చండి',
          durationEn: 'Alongside the above', durationTe: 'పైవాటితో పాటే',
          whatEn: 'With Intermediate you also become eligible for Postal Assistant, SSC CHSL and many state posts — the same preparation, more openings.',
          whatTe: 'ఇంటర్ ఉంటే పోస్టల్ అసిస్టెంట్, SSC CHSL మరియు అనేక రాష్ట్ర పోస్టులకూ అర్హత వస్తుంది — అదే సన్నద్ధత, ఎక్కువ అవకాశాలు.',
          howEn: [
            'Add typing practice: CHSL and Postal Assistant both test typing speed.',
            'Practise free at typingclub.com — no fee, works on a phone.',
            'Grama Sachivalayam posts also open up at this level.'
          ],
          howTe: [
            'టైపింగ్ సాధన చేర్చండి: CHSL, పోస్టల్ అసిస్టెంట్ రెండూ టైపింగ్ వేగాన్ని పరీక్షిస్తాయి.',
            'typingclub.com లో ఉచితంగా సాధన చేయండి — రుసుము లేదు, ఫోన్‌లోనే పనిచేస్తుంది.',
            'ఈ స్థాయిలో గ్రామ సచివాలయ పోస్టులు కూడా అందుబాటులోకి వస్తాయి.'
          ],
          costEn: 'Free to practise; government application fees only.',
          costTe: 'సాధన ఉచితం; ప్రభుత్వ దరఖాస్తు రుసుములు మాత్రమే.',
          officialName: 'India Post',
          officialUrl: 'https://indiapost.gov.in',
          verifyEn: 'Typing speed requirements are stated in each notification.',
          verifyTe: 'టైపింగ్ వేగ అవసరాలు ప్రతి నోటిఫికేషన్‌లో ఉంటాయి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Grama Sachivalayam', titleTe: 'గ్రామ సచివాలయం',
          whyEn: 'State recruitment for posts inside your own village or ward, at Intermediate and degree level.',
          whyTe: 'మీ గ్రామం లేదా వార్డులోనే ఉండే పోస్టులకు రాష్ట్ర నియామకం; ఇంటర్, డిగ్రీ స్థాయిలో.',
          fromLevel: 'inter',
          officialName: 'APPSC / AP Seva', officialUrl: 'https://psc.ap.gov.in'
        },
        {
          titleEn: 'Bank clerk via IBPS', titleTe: 'IBPS ద్వారా బ్యాంక్ క్లర్క్',
          whyEn: 'Needs a degree, but the preparation overlaps almost completely with SSC.',
          whyTe: 'డిగ్రీ కావాలి, కానీ సన్నద్ధత దాదాపు పూర్తిగా SSCతో కలిసిపోతుంది.',
          fromLevel: 'degree',
          officialName: 'IBPS', officialUrl: 'https://www.ibps.in'
        },
        {
          titleEn: 'APPSC Group exams', titleTe: 'APPSC గ్రూప్ పరీక్షలు',
          whyEn: 'State civil service posts at degree level — higher posts, longer preparation.',
          whyTe: 'డిగ్రీ స్థాయిలో రాష్ట్ర సివిల్ సర్వీస్ పోస్టులు — ఉన్నత పోస్టులు, ఎక్కువ సన్నద్ధత.',
          fromLevel: 'degree',
          officialName: 'APPSC', officialUrl: 'https://psc.ap.gov.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'iti-trade',
      icon: 'construction',
      track: 'iti',
      titleEn: 'Skilled trade through ITI',
      titleTe: 'ఐటీఐ ద్వారా నైపుణ్య వృత్తి',
      summaryEn: 'Learn electrician, fitter, welder or COPA at an ITI after 10th, then apprentice and work.',
      summaryTe: '10వ తరగతి తర్వాత ఐటీఐలో ఎలక్ట్రీషియన్, ఫిట్టర్, వెల్డర్ లేదా COPA నేర్చుకుని, అప్రెంటిస్‌షిప్ చేసి ఉద్యోగం పొందండి.',
      realityEn: 'This is the fastest route from 10th to a real paying skill — often under two years. It does not carry the prestige of a degree, but an electrician or welder with a certificate and some experience is employable anywhere in India, and can later work independently.',
      realityTe: '10వ తరగతి నుంచి నిజమైన సంపాదన నైపుణ్యానికి ఇదే వేగవంతమైన మార్గం — తరచూ రెండేళ్ల లోపే. డిగ్రీ అంత పేరు ఉండకపోవచ్చు, కానీ సర్టిఫికెట్‌తో, కొంత అనుభవంతో ఉన్న ఎలక్ట్రీషియన్ లేదా వెల్డర్‌కు భారతదేశంలో ఎక్కడైనా ఉద్యోగం దొరుకుతుంది, తర్వాత సొంతంగా కూడా పనిచేయవచ్చు.',
      steps: [
        {
          id: 'i1', fromLevel: '10th',
          titleEn: 'Choose a trade and join an ITI',
          titleTe: 'ఒక ట్రేడ్ ఎంచుకుని ఐటీఐలో చేరండి',
          durationEn: '1 – 2 years depending on trade', durationTe: 'ట్రేడ్‌ను బట్టి 1 – 2 సంవత్సరాలు',
          whatEn: 'ITI courses under NCVT or SCVT need only a 10th pass. Electrician, fitter, welder, mechanic and COPA (computer operator) are the trades with the steadiest demand.',
          whatTe: 'NCVT లేదా SCVT కింద ఐటీఐ కోర్సులకు 10వ తరగతి పాస్ చాలు. ఎలక్ట్రీషియన్, ఫిట్టర్, వెల్డర్, మెకానిక్, COPA (కంప్యూటర్ ఆపరేటర్) ట్రేడ్లకు స్థిరమైన డిమాండ్ ఉంటుంది.',
          howEn: [
            'Prefer a government ITI — fees are much lower than private institutes.',
            'Check that the institute is NCVT or SCVT affiliated; an unaffiliated certificate is worth little.',
            'Pick a trade by what work exists near you: electricians and welders are needed in every mandal.'
          ],
          howTe: [
            'ప్రభుత్వ ఐటీఐకే ప్రాధాన్యత ఇవ్వండి — ప్రైవేట్ సంస్థల కంటే ఫీజు చాలా తక్కువ.',
            'ఆ సంస్థకు NCVT లేదా SCVT అనుబంధం ఉందో లేదో చూడండి; అనుబంధం లేని సర్టిఫికెట్‌కు విలువ తక్కువ.',
            'మీ దగ్గర ఏ పని ఉందో దాన్ని బట్టి ట్రేడ్ ఎంచుకోండి: ప్రతి మండలంలోనూ ఎలక్ట్రీషియన్లు, వెల్డర్లు అవసరం.'
          ],
          costEn: 'Government ITI fees are low. Scholarships are available for SC/ST/BC and minority students.',
          costTe: 'ప్రభుత్వ ఐటీఐ ఫీజు తక్కువ. SC/ST/BC మరియు మైనారిటీ విద్యార్థులకు స్కాలర్‌షిప్‌లు ఉన్నాయి.',
          officialName: 'NCVT MIS — ITI directory',
          officialUrl: 'https://ncvtmis.gov.in',
          verifyEn: 'Search the institute on NCVT MIS to confirm it is genuinely affiliated.',
          verifyTe: 'ఆ సంస్థకు నిజంగా అనుబంధం ఉందో లేదో NCVT MISలో వెతికి నిర్ధారించుకోండి.'
        },
        {
          id: 'i2', fromLevel: 'iti',
          titleEn: 'Do an apprenticeship',
          titleTe: 'అప్రెంటిస్‌షిప్ చేయండి',
          durationEn: '1 year', durationTe: '1 సంవత్సరం',
          whatEn: 'An apprenticeship places you in a real factory or workshop with a monthly stipend. Many apprentices are kept on as regular employees.',
          whatTe: 'అప్రెంటిస్‌షిప్ మిమ్మల్ని నిజమైన ఫ్యాక్టరీ లేదా వర్క్‌షాప్‌లో నెలవారీ స్టైపెండ్‌తో నియమిస్తుంది. చాలా మంది అప్రెంటిస్‌లను తర్వాత రెగ్యులర్ ఉద్యోగులుగా తీసుకుంటారు.',
          howEn: [
            'Register on the NAPS portal — this is the official apprenticeship scheme.',
            'Apply to several establishments; placement is not automatic.',
            'The stipend is paid partly by the government, so it costs the employer little to take you.'
          ],
          howTe: [
            'NAPS పోర్టల్‌లో నమోదు చేసుకోండి — ఇది అధికారిక అప్రెంటిస్‌షిప్ పథకం.',
            'అనేక సంస్థలకు దరఖాస్తు చేయండి; ప్లేస్‌మెంట్ ఆటోమేటిక్‌గా రాదు.',
            'స్టైపెండ్‌లో కొంత భాగం ప్రభుత్వమే చెల్లిస్తుంది, కాబట్టి మిమ్మల్ని తీసుకోవడం యజమానికి పెద్ద భారం కాదు.'
          ],
          costEn: 'You are paid, not charged.',
          costTe: 'మీకు డబ్బు వస్తుంది, మీరు కట్టాల్సిన అవసరం లేదు.',
          officialName: 'National Apprenticeship Promotion Scheme',
          officialUrl: 'https://www.apprenticeshipindia.gov.in',
          verifyEn: 'Register only on the official NAPS portal. No genuine apprenticeship asks you for money.',
          verifyTe: 'అధికారిక NAPS పోర్టల్‌లో మాత్రమే నమోదు చేసుకోండి. నిజమైన అప్రెంటిస్‌షిప్ మీ దగ్గర డబ్బు అడగదు.'
        },
        {
          id: 'i3', fromLevel: 'iti',
          titleEn: 'Take a job, or go independent',
          titleTe: 'ఉద్యోగంలో చేరండి, లేదా సొంతంగా పనిచేయండి',
          durationEn: 'Ongoing', durationTe: 'నిరంతరం',
          whatEn: 'With an ITI certificate and apprenticeship experience you can take a technician job, apply to PSU trade posts, or work independently in your own area.',
          whatTe: 'ఐటీఐ సర్టిఫికెట్, అప్రెంటిస్‌షిప్ అనుభవంతో టెక్నీషియన్ ఉద్యోగం చేయవచ్చు, PSU ట్రేడ్ పోస్టులకు దరఖాస్తు చేయవచ్చు, లేదా మీ ప్రాంతంలోనే సొంతంగా పనిచేయవచ్చు.',
          howEn: [
            'PSUs like Railways, NTPC and BHEL recruit ITI holders for technician posts — watch their sites.',
            'Working independently as an electrician or mechanic often pays more than a factory job.',
            'A MUDRA loan can fund your own tools and a small workshop.'
          ],
          howTe: [
            'రైల్వేలు, NTPC, BHEL వంటి PSUలు టెక్నీషియన్ పోస్టులకు ఐటీఐ అభ్యర్థులను నియమిస్తాయి — వాటి సైట్లు గమనించండి.',
            'ఎలక్ట్రీషియన్ లేదా మెకానిక్‌గా సొంతంగా పనిచేస్తే తరచూ ఫ్యాక్టరీ ఉద్యోగం కంటే ఎక్కువ సంపాదన ఉంటుంది.',
            'ముద్రా రుణంతో సొంత పనిముట్లు, చిన్న వర్క్‌షాప్ ఏర్పాటు చేసుకోవచ్చు.'
          ],
          costEn: 'Nothing to pay. Tools cost money if you go independent, which a MUDRA loan can cover.',
          costTe: 'చెల్లించాల్సింది లేదు. సొంతంగా పనిచేస్తే పనిముట్లకు ఖర్చవుతుంది, దాన్ని ముద్రా రుణం భరించగలదు.',
          officialName: 'Skill India',
          officialUrl: 'https://www.skillindia.gov.in',
          verifyEn: 'For PSU trade posts, check the individual PSU recruitment page.',
          verifyTe: 'PSU ట్రేడ్ పోస్టుల కోసం ఆయా PSU నియామక పేజీని చూడండి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Polytechnic diploma via POLYCET', titleTe: 'POLYCET ద్వారా పాలిటెక్నిక్ డిప్లొమా',
          whyEn: '3 years after 10th. A diploma ranks above ITI and allows lateral entry into B.Tech second year.',
          whyTe: '10వ తరగతి తర్వాత 3 సంవత్సరాలు. డిప్లొమా ఐటీఐ కంటే ఉన్నత స్థాయి; B.Tech రెండో సంవత్సరంలోకి లాటరల్ ఎంట్రీ అవకాశం.',
          fromLevel: '10th',
          officialName: 'AP SBTET', officialUrl: 'https://sbtet.ap.gov.in'
        },
        {
          titleEn: 'Short-term skill course (PMKVY)', titleTe: 'స్వల్పకాలిక నైపుణ్య కోర్సు (PMKVY)',
          whyEn: '3 – 6 months, free, with certification — mobile repair, solar panel fitting, CCTV installation.',
          whyTe: '3 – 6 నెలలు, ఉచితం, సర్టిఫికెట్‌తో — మొబైల్ రిపేర్, సోలార్ ప్యానెల్ ఫిట్టింగ్, CCTV ఇన్‌స్టాలేషన్.',
          fromLevel: '10th',
          officialName: 'PMKVY', officialUrl: 'https://www.skillindiadigital.gov.in/content/pmkvy'
        },
        {
          titleEn: 'APSSDC skill training', titleTe: 'APSSDC నైపుణ్య శిక్షణ',
          whyEn: 'State skill development programmes with placement support, often free for rural youth.',
          whyTe: 'ప్లేస్‌మెంట్ సహకారంతో రాష్ట్ర నైపుణ్య అభివృద్ధి కార్యక్రమాలు; గ్రామీణ యువతకు తరచూ ఉచితం.',
          fromLevel: '10th',
          officialName: 'APSSDC', officialUrl: 'https://apssdc.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'bpo-service',
      icon: 'headset_mic',
      track: 'bpo',
      titleEn: 'Customer support and office work',
      titleTe: 'కస్టమర్ సపోర్ట్ మరియు ఆఫీస్ ఉద్యోగాలు',
      summaryEn: 'Telugu voice process, data entry and retail jobs — the quickest way to a first salary.',
      summaryTe: 'తెలుగు వాయిస్ ప్రాసెస్, డేటా ఎంట్రీ, రిటైల్ ఉద్యోగాలు — మొదటి జీతానికి అత్యంత వేగవంతమైన మార్గం.',
      realityEn: 'These jobs hire fast — often within weeks — and that is their real value: a first salary, work experience and confidence while you prepare for something longer-term. Pay starts modest and shift work is common. Treat it as a starting point, not a ceiling.',
      realityTe: 'ఈ ఉద్యోగాలు త్వరగా నియమిస్తాయి — తరచూ కొన్ని వారాల్లోనే — అదే వీటి నిజమైన విలువ: దీర్ఘకాలిక లక్ష్యానికి సిద్ధమవుతూనే మొదటి జీతం, పని అనుభవం, ఆత్మవిశ్వాసం. ప్రారంభ జీతం మధ్యస్థం, షిఫ్ట్ పని సాధారణం. దీన్ని ప్రారంభ బిందువుగా చూడండి, పరిమితిగా కాదు.',
      steps: [
        {
          id: 'b1', fromLevel: '10th',
          titleEn: 'Build the two skills that get you hired',
          titleTe: 'ఉద్యోగం ఇప్పించే రెండు నైపుణ్యాలు పెంచుకోండి',
          durationEn: '1 – 2 months', durationTe: '1 – 2 నెలలు',
          whatEn: 'For voice process work: clear speech and basic conversational English alongside Telugu. For data entry: typing speed and accuracy. Both can be learned free on a phone.',
          whatTe: 'వాయిస్ ప్రాసెస్ ఉద్యోగానికి: స్పష్టమైన మాట, తెలుగుతో పాటు ప్రాథమిక సంభాషణ ఇంగ్లీష్. డేటా ఎంట్రీకి: టైపింగ్ వేగం, కచ్చితత్వం. రెండూ ఫోన్‌లోనే ఉచితంగా నేర్చుకోవచ్చు.',
          howEn: [
            'Practise typing free at typingclub.com for 20 minutes a day.',
            'Speak English aloud daily, even alone — fluency matters more than grammar here.',
            'Many companies hire specifically for Telugu voice process, where your Telugu is the qualification.'
          ],
          howTe: [
            'రోజూ 20 నిమిషాలు typingclub.com లో ఉచితంగా టైపింగ్ సాధన చేయండి.',
            'ప్రతిరోజూ ఇంగ్లీష్ బిగ్గరగా మాట్లాడండి, ఒంటరిగానైనా సరే — ఇక్కడ వ్యాకరణం కంటే ధారాళత ముఖ్యం.',
            'చాలా కంపెనీలు ప్రత్యేకంగా తెలుగు వాయిస్ ప్రాసెస్‌కు నియమిస్తాయి; అక్కడ మీ తెలుగే అర్హత.'
          ],
          costEn: 'Free.',
          costTe: 'ఉచితం.',
          officialName: 'National Career Service',
          officialUrl: 'https://www.ncs.gov.in',
          verifyEn: 'NCS lists verified employers and free training. Use it before paid job portals.',
          verifyTe: 'NCS ధ్రువీకరించిన యజమానులను, ఉచిత శిక్షణను చూపుతుంది. డబ్బు తీసుకునే జాబ్ పోర్టళ్ల కంటే ముందు దీన్ని వాడండి.'
        },
        {
          id: 'b2', fromLevel: '10th',
          titleEn: 'Make a resume and apply',
          titleTe: 'రెజ్యూమె తయారు చేసి దరఖాస్తు చేయండి',
          durationEn: '1 – 2 weeks', durationTe: '1 – 2 వారాలు',
          whatEn: 'Most of these employers simply need a clear one-page resume and a working phone number. You can build one free on this site.',
          whatTe: 'ఈ యజమానుల్లో చాలామందికి స్పష్టమైన ఒక పేజీ రెజ్యూమె, పనిచేసే ఫోన్ నంబర్ ఉంటే చాలు. ఈ సైట్‌లోనే ఉచితంగా తయారు చేసుకోవచ్చు.',
          howEn: [
            'Use the resume builder on this site — it is free and needs no account.',
            'List your languages prominently: Telugu plus any English is a real qualification here.',
            'Apply on NCS first, then on job portals. Keep your phone switched on; these employers call.'
          ],
          howTe: [
            'ఈ సైట్‌లోని రెజ్యూమె బిల్డర్ వాడండి — ఉచితం, ఖాతా అవసరం లేదు.',
            'మీకు తెలిసిన భాషలను ముందు రాయండి: తెలుగుతో పాటు కొద్దిపాటి ఇంగ్లీష్ కూడా ఇక్కడ నిజమైన అర్హత.',
            'ముందు NCSలో, తర్వాత జాబ్ పోర్టళ్లలో దరఖాస్తు చేయండి. ఫోన్ ఆన్‌లో ఉంచండి; ఈ యజమానులు ఫోన్ చేస్తారు.'
          ],
          costEn: 'Free. Never pay a fee to get a job — that is always a fraud.',
          costTe: 'ఉచితం. ఉద్యోగం కోసం ఎప్పుడూ డబ్బు చెల్లించకండి — అది ఎప్పుడూ మోసమే.',
          officialName: 'National Career Service',
          officialUrl: 'https://www.ncs.gov.in',
          verifyEn: 'A genuine employer never asks for a registration or security deposit.',
          verifyTe: 'నిజమైన యజమాని ఎప్పుడూ రిజిస్ట్రేషన్ లేదా సెక్యూరిటీ డిపాజిట్ అడగడు.'
        },
        {
          id: 'b3', fromLevel: '10th',
          titleEn: 'Work, then move up',
          titleTe: 'పనిచేయండి, తర్వాత ఎదగండి',
          durationEn: 'Ongoing', durationTe: 'నిరంతరం',
          whatEn: 'After a year of experience you can move to team leader or quality roles, or use the salary and confidence to fund a longer qualification.',
          whatTe: 'ఒక సంవత్సరం అనుభవం తర్వాత టీమ్ లీడర్ లేదా క్వాలిటీ పాత్రలకు మారవచ్చు, లేదా ఆ జీతం, ఆత్మవిశ్వాసంతో దీర్ఘకాలిక అర్హత సాధించవచ్చు.',
          howEn: [
            'Many people do a degree through open university while working here.',
            'Keep a record of what you handled — it becomes your next resume.',
            'Night shift allowances can add meaningfully to the base pay.'
          ],
          howTe: [
            'ఇక్కడ పనిచేస్తూనే చాలామంది ఓపెన్ యూనివర్సిటీ ద్వారా డిగ్రీ పూర్తి చేస్తారు.',
            'మీరు నిర్వహించిన పనుల రికార్డు ఉంచుకోండి — అదే మీ తదుపరి రెజ్యూమె అవుతుంది.',
            'నైట్ షిఫ్ట్ అలవెన్సులు మూల జీతానికి గణనీయంగా కలుస్తాయి.'
          ],
          costEn: 'You are earning at this stage.',
          costTe: 'ఈ దశలో మీరు సంపాదిస్తున్నారు.',
          officialName: 'Dr. B.R. Ambedkar Open University',
          officialUrl: 'https://braou.ac.in',
          verifyEn: 'Open university degrees are valid for government jobs when the university is UGC-recognised.',
          verifyTe: 'యూనివర్సిటీకి UGC గుర్తింపు ఉంటే ఓపెన్ యూనివర్సిటీ డిగ్రీలు ప్రభుత్వ ఉద్యోగాలకు చెల్లుతాయి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Digital Seva (CSC) centre operator', titleTe: 'డిజిటల్ సేవా (CSC) కేంద్ర నిర్వాహకుడు',
          whyEn: 'Run government services in your own village with basic computer skills — income plus a useful role.',
          whyTe: 'ప్రాథమిక కంప్యూటర్ నైపుణ్యంతో మీ గ్రామంలోనే ప్రభుత్వ సేవలు అందించండి — ఆదాయంతో పాటు ఉపయోగకరమైన పాత్ర.',
          fromLevel: '10th',
          officialName: 'CSC registration', officialUrl: 'https://register.csc.gov.in'
        },
        {
          titleEn: 'Retail and delivery work', titleTe: 'రిటైల్ మరియు డెలివరీ ఉద్యోగాలు',
          whyEn: 'Hires almost immediately, often with no exam. Useful while you prepare for something else.',
          whyTe: 'దాదాపు వెంటనే నియమిస్తారు, తరచూ పరీక్ష లేకుండానే. మరో దానికి సిద్ధమవుతున్నప్పుడు ఉపయోగకరం.',
          fromLevel: '10th',
          officialName: 'National Career Service', officialUrl: 'https://www.ncs.gov.in'
        }
      ]
    },

    // ───────────────────────────────────────────────────────────────────────
    {
      id: 'own-business',
      icon: 'storefront',
      track: 'business',
      titleEn: 'Start your own small business',
      titleTe: 'సొంత చిన్న వ్యాపారం ప్రారంభించండి',
      summaryEn: 'A shop, dairy, tailoring unit or service business, funded by MUDRA or PMEGP.',
      summaryTe: 'ముద్రా లేదా PMEGP నిధులతో దుకాణం, పాడి, టైలరింగ్ యూనిట్ లేదా సేవా వ్యాపారం.',
      realityEn: 'No qualification is required, which makes this reachable for anyone. But it is not easier than a job — you carry the risk yourself. Do the training before the loan, start smaller than you think you should, and do not borrow from a private lender when a government scheme will lend to you at a far lower rate.',
      realityTe: 'ఎలాంటి అర్హత అవసరం లేదు, కాబట్టి ఇది ఎవరికైనా అందుబాటులో ఉంటుంది. కానీ ఇది ఉద్యోగం కంటే సులభం కాదు — నష్టభయం మీదే. రుణం కంటే ముందు శిక్షణ తీసుకోండి, మీరు అనుకున్నదాని కంటే చిన్నగా మొదలుపెట్టండి, ప్రభుత్వ పథకం తక్కువ వడ్డీకి ఇస్తున్నప్పుడు ప్రైవేట్ వడ్డీ వ్యాపారి దగ్గర అప్పు తీసుకోవద్దు.',
      steps: [
        {
          id: 's1', fromLevel: 'below10',
          titleEn: 'Choose a business your village actually needs',
          titleTe: 'మీ గ్రామానికి నిజంగా అవసరమైన వ్యాపారం ఎంచుకోండి',
          durationEn: '2 – 4 weeks', durationTe: '2 – 4 వారాలు',
          whatEn: 'The most common reason small businesses fail is choosing something the area already has enough of. Spend a few weeks looking before you spend any money.',
          whatTe: 'చిన్న వ్యాపారాలు విఫలమవడానికి అత్యంత సాధారణ కారణం — ఆ ప్రాంతంలో ఇప్పటికే సరిపడా ఉన్నదాన్నే ఎంచుకోవడం. డబ్బు ఖర్చు చేసే ముందు కొన్ని వారాలు గమనించండి.',
          howEn: [
            'Count what already exists in your village: how many kirana shops, how many tailors.',
            'Ask ten neighbours what they travel to town to buy — that gap is your business.',
            'Consider dairy, poultry, tailoring, food processing, mobile repair or a Digital Seva centre.'
          ],
          howTe: [
            'మీ గ్రామంలో ఇప్పటికే ఏమున్నాయో లెక్కించండి: ఎన్ని కిరాణా దుకాణాలు, ఎంతమంది టైలర్లు.',
            'పదిమంది పొరుగువారిని అడగండి — ఏమి కొనడానికి పట్టణానికి వెళ్తున్నారని. ఆ ఖాళీయే మీ వ్యాపారం.',
            'పాడి, కోళ్ల పెంపకం, టైలరింగ్, ఆహార ప్రాసెసింగ్, మొబైల్ రిపేర్ లేదా డిజిటల్ సేవా కేంద్రం పరిశీలించండి.'
          ],
          costEn: 'Free. This step is only your time.',
          costTe: 'ఉచితం. ఈ దశకు మీ సమయం మాత్రమే.',
          officialName: 'MUDRA — business ideas and schemes',
          officialUrl: 'https://www.mudra.org.in',
          verifyEn: 'Scheme eligibility differs by activity. Confirm yours qualifies before planning the loan.',
          verifyTe: 'కార్యకలాపాన్ని బట్టి పథక అర్హత మారుతుంది. రుణ ప్రణాళికకు ముందు మీది అర్హమైనదో నిర్ధారించుకోండి.'
        },
        {
          id: 's2', fromLevel: 'below10',
          titleEn: 'Take the free training first',
          titleTe: 'ముందుగా ఉచిత శిక్షణ తీసుకోండి',
          durationEn: '1 – 6 months depending on trade', durationTe: 'వృత్తిని బట్టి 1 – 6 నెలలు',
          whatEn: 'RSETI and NABARD run free residential training for rural entrepreneurs, and completing it also strengthens your loan application.',
          whatTe: 'RSETI, NABARD గ్రామీణ పారిశ్రామికవేత్తలకు ఉచిత వసతితో కూడిన శిక్షణ నిర్వహిస్తాయి; దీన్ని పూర్తి చేయడం మీ రుణ దరఖాస్తుకూ బలం చేకూరుస్తుంది.',
          howEn: [
            'Find your district RSETI — training, food and stay are usually free.',
            'For tailoring or similar trades, PMKVY courses are free and certified.',
            'Learn basic record keeping. A business without records cannot get a second loan.'
          ],
          howTe: [
            'మీ జిల్లా RSETIని కనుక్కోండి — శిక్షణ, భోజనం, వసతి సాధారణంగా ఉచితం.',
            'టైలరింగ్ వంటి వృత్తులకు PMKVY కోర్సులు ఉచితం, సర్టిఫికెట్‌తో ఉంటాయి.',
            'ప్రాథమిక లెక్కలు రాయడం నేర్చుకోండి. రికార్డులు లేని వ్యాపారానికి రెండో రుణం రాదు.'
          ],
          costEn: 'Free at RSETI and under PMKVY.',
          costTe: 'RSETIలో, PMKVY కింద ఉచితం.',
          officialName: 'NABARD',
          officialUrl: 'https://www.nabard.org',
          verifyEn: 'Confirm the training centre is an official RSETI or PMKVY partner.',
          verifyTe: 'ఆ శిక్షణ కేంద్రం అధికారిక RSETI లేదా PMKVY భాగస్వామి అవునో కాదో నిర్ధారించుకోండి.'
        },
        {
          id: 's3', fromLevel: 'below10',
          titleEn: 'Apply for a government-backed loan',
          titleTe: 'ప్రభుత్వ మద్దతు ఉన్న రుణానికి దరఖాస్తు చేయండి',
          durationEn: '1 – 3 months', durationTe: '1 – 3 నెలలు',
          whatEn: 'MUDRA lends to small businesses without collateral in its smallest category. PMEGP adds a government subsidy, which is higher for rural applicants.',
          whatTe: 'ముద్రా తన అతి చిన్న కేటగిరీలో పూచీకత్తు లేకుండా చిన్న వ్యాపారాలకు రుణం ఇస్తుంది. PMEGP ప్రభుత్వ సబ్సిడీని జోడిస్తుంది, గ్రామీణ దరఖాస్తుదారులకు ఇది ఎక్కువ.',
          howEn: [
            'Write a simple project plan: what you will sell, to whom, and your expected monthly costs and income.',
            'Apply at any bank branch — MUDRA is not a separate office.',
            'Carry Aadhaar, bank passbook, quotations for equipment and your training certificate.',
            'If a bank refuses, try another. Refusal at one branch is not the end.'
          ],
          howTe: [
            'సాధారణ ప్రాజెక్ట్ ప్రణాళిక రాయండి: ఏమి అమ్ముతారు, ఎవరికి, నెలవారీ ఖర్చు, ఆదాయం ఎంత.',
            'ఏ బ్యాంక్ శాఖలోనైనా దరఖాస్తు చేయండి — ముద్రాకు ప్రత్యేక కార్యాలయం లేదు.',
            'ఆధార్, బ్యాంక్ పాస్‌బుక్, పరికరాల కొటేషన్లు, శిక్షణ సర్టిఫికెట్ తీసుకెళ్లండి.',
            'ఒక బ్యాంక్ నిరాకరిస్తే మరొకటి ప్రయత్నించండి. ఒక శాఖలో తిరస్కరణ అంతిమం కాదు.'
          ],
          costEn: 'No fee to apply. Never pay an agent to arrange a government loan.',
          costTe: 'దరఖాస్తుకు రుసుము లేదు. ప్రభుత్వ రుణం ఇప్పిస్తానని చెప్పే ఏజెంట్‌కు డబ్బు ఇవ్వకండి.',
          officialName: 'PMEGP / KVIC',
          officialUrl: 'https://www.kviconline.gov.in/pmegpeportal',
          verifyEn: 'Loan limits and subsidy rates are revised periodically. Confirm the current figures at the bank.',
          verifyTe: 'రుణ పరిమితులు, సబ్సిడీ రేట్లు ఎప్పటికప్పుడు మారుతాయి. ప్రస్తుత సంఖ్యలను బ్యాంకులో నిర్ధారించుకోండి.'
        },
        {
          id: 's4', fromLevel: 'below10',
          titleEn: 'Start small and keep records',
          titleTe: 'చిన్నగా మొదలుపెట్టి లెక్కలు రాయండి',
          durationEn: 'Ongoing', durationTe: 'నిరంతరం',
          whatEn: 'Begin at a scale you could survive losing. Keep a daily record of money in and out — this is what lets you grow and what the bank will want to see next time.',
          whatTe: 'నష్టపోయినా తట్టుకోగలిగే స్థాయిలో మొదలుపెట్టండి. రోజువారీ వచ్చిన, పోయిన డబ్బు లెక్క రాయండి — ఎదగడానికి ఇదే ఆధారం, తదుపరిసారి బ్యాంకు చూసేదీ ఇదే.',
          howEn: [
            'A simple notebook is enough. Write every rupee in and out, daily.',
            'Keep business money separate from household money.',
            'Repay the loan on time — it is what gets you a larger one later.'
          ],
          howTe: [
            'ఒక సాధారణ నోట్‌బుక్ చాలు. ప్రతిరోజూ వచ్చిన, పోయిన ప్రతి రూపాయి రాయండి.',
            'వ్యాపార డబ్బును ఇంటి ఖర్చుల డబ్బు నుంచి వేరుగా ఉంచండి.',
            'రుణాన్ని సకాలంలో చెల్లించండి — తర్వాత పెద్ద రుణం రావడానికి అదే కారణం.'
          ],
          costEn: 'A notebook.',
          costTe: 'ఒక నోట్‌బుక్.',
          officialName: 'MUDRA',
          officialUrl: 'https://www.mudra.org.in',
          verifyEn: 'Ask your bank about the Shishu / Kishor / Tarun stages for your next, larger loan.',
          verifyTe: 'తదుపరి పెద్ద రుణం కోసం శిశు / కిశోర్ / తరుణ్ దశల గురించి మీ బ్యాంకును అడగండి.'
        }
      ],
      alternatives: [
        {
          titleEn: 'Dairy or poultry with NABARD support', titleTe: 'NABARD మద్దతుతో పాడి లేదా కోళ్ల పెంపకం',
          whyEn: 'Suits households that already have land or sheds; NABARD schemes support the capital cost.',
          whyTe: 'ఇప్పటికే భూమి లేదా షెడ్లు ఉన్న కుటుంబాలకు అనుకూలం; NABARD పథకాలు పెట్టుబడి ఖర్చుకు మద్దతిస్తాయి.',
          fromLevel: 'below10',
          officialName: 'NABARD', officialUrl: 'https://www.nabard.org'
        },
        {
          titleEn: 'Food processing unit (PMFME)', titleTe: 'ఆహార ప్రాసెసింగ్ యూనిట్ (PMFME)',
          whyEn: 'A scheme built specifically for micro food enterprises, with subsidy and training.',
          whyTe: 'సూక్ష్మ ఆహార సంస్థల కోసమే రూపొందిన పథకం; సబ్సిడీ, శిక్షణతో.',
          fromLevel: 'below10',
          officialName: 'PM FME', officialUrl: 'https://pmfme.mofpi.gov.in'
        },
        {
          titleEn: 'Join a self-help group first', titleTe: 'ముందుగా స్వయం సహాయక సంఘంలో చేరండి',
          whyEn: 'Lower risk than borrowing alone, and SHG members often get better loan terms.',
          whyTe: 'ఒంటరిగా అప్పు తీసుకోవడం కంటే తక్కువ నష్టభయం; SHG సభ్యులకు తరచూ మెరుగైన రుణ షరతులు లభిస్తాయి.',
          fromLevel: 'below10',
          officialName: 'DAY-NRLM', officialUrl: 'https://aajeevika.gov.in'
        }
      ]
    }
  ]
};
