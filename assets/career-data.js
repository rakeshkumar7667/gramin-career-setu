/* CareerBridge's local recommendation catalogue.
 * Replace this file with an API response when the SaaS backend is introduced.
 */
window.CAREER_PATHS = [
  {
    id: 'government',
    title: 'Government Careers',
    telugu: 'ప్రభుత్వ ఉద్యోగాలు',
    tagline: 'Stable public-service roles with a clear exam journey.',
    icon: '🏛️',
    interests: ['public-service', 'teaching', 'law', 'technology'],
    education: ['10th', '12th', 'degree'],
    roles: ['Police Constable', 'Village Secretariat Executive', 'Postal Assistant', 'Bank Clerk'],
    requirements: ['10th/12th or degree based on the role', 'Aadhaar, education certificates and a current photo', 'Exam preparation and a valid application before the deadline'],
    actions: ['Choose one exam instead of preparing for everything', 'Download the official notification', 'Create a weekly study plan for the syllabus', 'Solve one previous paper every week'],
    avoid: ['Paying an agent for a government job', 'Relying on WhatsApp forwards instead of the official notification', 'Waiting until the last day to apply'],
    resources: ['APPSC / TSPSC official notifications', 'India Post recruitment portal', 'National Career Service'],
    milestones: ['Choose exam', 'Build basics', 'Practice papers', 'Apply', 'Write exam', 'Track results']
  },
  {
    id: 'technology',
    title: 'Technology & Digital Jobs',
    telugu: 'టెక్నాలజీ ఉద్యోగాలు',
    tagline: 'Build practical digital skills and become job-ready.',
    icon: '💻',
    interests: ['technology', 'design', 'business'],
    education: ['10th', '12th', 'degree'],
    roles: ['Data Entry Operator', 'Junior Web Designer', 'IT Support Associate', 'Digital Marketing Assistant'],
    requirements: ['Basic computer and internet confidence', 'One practical skill with 2–3 proof-of-work projects', 'A simple resume and professional contact details'],
    actions: ['Learn typing, email and file management', 'Pick one skill: web, design, data or digital marketing', 'Build two small projects for your portfolio', 'Practice a 60-second self-introduction', 'Apply to 5 verified roles each week'],
    avoid: ['Collecting certificates without building anything', 'Sharing OTPs, passwords or money with recruiters', 'Using a copied resume for every role'],
    resources: ['Skill India Digital', 'NCS job portal', 'freeCodeCamp / Microsoft Learn'],
    milestones: ['Digital basics', 'Choose skill', 'Build projects', 'Create resume', 'Practice interview', 'Apply consistently']
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Community Service',
    telugu: 'ఆరోగ్య సేవలు',
    tagline: 'Meaningful careers that improve health in your community.',
    icon: '🩺',
    interests: ['healthcare', 'public-service', 'teaching'],
    education: ['10th', '12th', 'degree'],
    roles: ['ANM / Health Assistant', 'Pharmacy Assistant', 'Lab Technician', 'Community Health Worker'],
    requirements: ['Relevant recognised course or certification', 'Basic science and communication skills', 'Background verification and role-specific registration where required'],
    actions: ['Check recognised institutes before joining', 'Compare course duration, fees and placement record', 'Learn first aid and patient communication', 'Keep certificates and ID documents organised'],
    avoid: ['Joining an unrecognised institute because of a cheap fee', 'Practising without the required qualification', 'Giving patient advice outside your training'],
    resources: ['National Health Mission', 'Skill India training centres', 'State health department notifications'],
    milestones: ['Explore role', 'Verify course', 'Complete training', 'Practical exposure', 'Apply', 'Keep learning']
  },
  {
    id: 'skilled-trades',
    title: 'Skilled Trades & ITI',
    telugu: 'నైపుణ్య వృత్తులు',
    tagline: 'Hands-on skills that lead to local jobs and self-employment.',
    icon: '🔧',
    interests: ['hands-on', 'technology', 'business'],
    education: ['10th', '12th'],
    roles: ['Electrician', 'Fitter', 'Welder', 'Solar Technician', 'Mobile Repair Technician'],
    requirements: ['10th pass for most ITI trades', 'Practice with tools under a trained instructor', 'Safety habits and an apprenticeship or work sample'],
    actions: ['Compare nearby government ITIs', 'Choose a trade with local demand', 'Practise safety and tool maintenance', 'Ask for apprenticeship opportunities', 'Track materials, costs and earnings'],
    avoid: ['Working on live electrical systems without training', 'Buying expensive equipment before validating demand', 'Ignoring safety gear'],
    resources: ['NCVT MIS', 'Skill India', 'Apprenticeship India'],
    milestones: ['Select trade', 'Join verified course', 'Practise safely', 'Apprenticeship', 'First job', 'Grow income']
  },
  {
    id: 'business',
    title: 'Business & Self-Employment',
    telugu: 'స్వయం ఉపాధి',
    tagline: 'Start small, test demand and build a sustainable local business.',
    icon: '🚀',
    interests: ['business', 'farming', 'hands-on', 'design'],
    education: ['10th', '12th', 'degree'],
    roles: ['Digital Seva Centre', 'Tailoring Centre', 'Food Processing', 'Dairy / Poultry Enterprise'],
    requirements: ['A real customer problem and a simple business plan', 'Basic costing, record keeping and customer service', 'Only verified loans or government schemes'],
    actions: ['Interview 10 potential customers', 'Start with a small low-risk test', 'Write every cost and sale in a notebook', 'Separate personal and business money', 'Reinvest only after demand is proven'],
    avoid: ['Borrowing before testing the idea', 'Paying unknown people for scheme approval', 'Copying a business without understanding local demand'],
    resources: ['MUDRA', 'PMFME', 'NABARD', 'District Industries Centre'],
    milestones: ['Find problem', 'Validate demand', 'Plan costs', 'Pilot', 'Register / finance', 'Grow carefully']
  },
  {
    id: 'education',
    title: 'Teaching & Communication',
    telugu: 'బోధన మరియు కమ్యూనికేషన్',
    tagline: 'Use your language and people skills to help others learn.',
    icon: '📚',
    interests: ['teaching', 'public-service', 'design'],
    education: ['12th', 'degree'],
    roles: ['Tutor', 'Teaching Assistant', 'Content Creator', 'Customer Support Executive'],
    requirements: ['Strong subject basics and clear communication', 'Relevant teaching qualification for formal school roles', 'A sample lesson, explanation or communication portfolio'],
    actions: ['Choose one subject or audience', 'Teach a short lesson to a friend and record feedback', 'Improve Telugu and English communication', 'Build a sample lesson or content piece', 'Apply to verified schools and support roles'],
    avoid: ['Claiming a qualification you do not have', 'Using memorised answers without understanding', 'Ignoring child-safety and professional boundaries'],
    resources: ['NCTE', 'DIKSHA', 'NCS job portal'],
    milestones: ['Choose subject', 'Strengthen basics', 'Practise teaching', 'Build sample', 'Apply', 'Get feedback']
  }
];

window.CAREER_PROFILE_KEY = 'gcs-career-profile-v1';
