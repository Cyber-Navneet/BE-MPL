// Fictional demo data for the student home dashboard — not real companies, people, jobs or conversations.
// Dates are relative to when the demo data is first created in a browser.

export const APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Offer Received',
  'Rejected',
]

const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const daysAgo = (days) => new Date(Date.now() - days * DAY_MS).toISOString()
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR_MS).toISOString()

// Six of eight fields filled, so the profile is 75% complete.
export const DEMO_PROFILE = {
  name: 'Aarav Sharma',
  fields: [
    { label: 'Full name', value: 'Alex Morgan' },
    { label: 'Email', value: 'alex.morgan@example.com' },
    { label: 'Phone', value: '+91 90000 12345' },
    { label: 'Education', value: 'B.Tech in Computer Science, 2026' },
    { label: 'Location', value: 'Bengaluru, India' },
    { label: 'Skills', value: 'React, JavaScript, CSS, Git' },
    { label: 'Work experience', value: '' },
    { label: 'Resume', value: '' },
  ],
}

// `needsAttention` assessments are not finished yet.
export const DEMO_ASSESSMENTS = [
  { id: 'as-1', title: 'JavaScript Fundamentals', status: 'Not started', due: 'Due in 2 days', score: null },
  { id: 'as-2', title: 'React Essentials', status: 'In progress', due: 'Due in 5 days', score: null },
  { id: 'as-3', title: 'HTML & CSS Layouts', status: 'Completed', due: 'Completed 6 days ago', score: 86 },
  { id: 'as-4', title: 'SQL Basics', status: 'Completed', due: 'Completed 9 days ago', score: 78 },
  { id: 'as-5', title: 'Data Structures I', status: 'Completed', due: 'Completed 2 weeks ago', score: 72 },
  { id: 'as-6', title: 'Aptitude & Reasoning', status: 'Completed', due: 'Completed 3 weeks ago', score: 90 },
]

const SEED_APPLICATIONS = [
  ['app-1', 'Frontend Engineer', 'TechFlow Inc.', 'TF', '₹12–18 LPA', 'Bengaluru, India', 'Full-time', 'Remote', ['React', 'TypeScript', 'CSS', 'REST APIs'], 'Under Review', 1],
  ['app-2', 'Data Analyst Intern', 'DataSphere', 'DS', '₹30K–40K/month', 'Hyderabad, India', 'Internship', 'Hybrid', ['SQL', 'Python', 'Power BI', 'Excel'], 'Shortlisted', 4],
  ['app-3', 'Cloud Engineer Trainee', 'CloudNova', 'CN', '₹6–9 LPA', 'Pune, India', 'Full-time', 'On-site', ['AWS', 'Linux', 'Docker', 'Networking'], 'Applied', 2],
  ['app-4', 'UI/UX Designer', 'PixelWorks', 'PW', '₹8–12 LPA', 'Mumbai, India', 'Full-time', 'Hybrid', ['Figma', 'Prototyping', 'User Research', 'CSS'], 'Interview Scheduled', 6],
  ['app-5', 'Backend Developer', 'ByteForge', 'BF', '₹10–15 LPA', 'Bengaluru, India', 'Full-time', 'On-site', ['Node.js', 'Express', 'MongoDB', 'REST APIs'], 'Applied', 3],
  ['app-6', 'Machine Learning Intern', 'Orbit Analytics', 'OA', '₹35K–50K/month', 'Chennai, India', 'Internship', 'Remote', ['Python', 'scikit-learn', 'Pandas', 'Statistics'], 'Under Review', 8],
  ['app-7', 'React Native Developer', 'NimbusPay', 'NP', '₹9–14 LPA', 'Gurugram, India', 'Full-time', 'Hybrid', ['React Native', 'JavaScript', 'Redux', 'REST APIs'], 'Rejected', 15],
  ['app-8', 'DevOps Intern', 'CloudNova', 'CN', '₹25K–35K/month', 'Noida, India', 'Internship', 'Remote', ['CI/CD', 'Docker', 'Kubernetes', 'Bash'], 'Offer Received', 20],
  ['app-9', 'Business Analyst', 'FinEdge', 'FE', '₹7–10 LPA', 'Mumbai, India', 'Full-time', 'On-site', ['SQL', 'Excel', 'Tableau', 'Communication'], 'Applied', 5],
  ['app-10', 'QA Engineer', 'MediCore Labs', 'ML', '₹6–8 LPA', 'Hyderabad, India', 'Full-time', 'Hybrid', ['Selenium', 'Java', 'Test Planning', 'Jira'], 'Under Review', 10],
]

export function createSeedApplications() {
  return SEED_APPLICATIONS.map(
    ([id, title, company, initials, salary, location, employmentType, workMode, skills, status, appliedDaysAgo]) => ({
      id,
      jobId: null,
      title,
      company,
      initials,
      salary,
      location,
      employmentType,
      workMode,
      skills,
      status,
      appliedOn: daysAgo(appliedDaysAgo),
    }),
  )
}

// [from, text, hoursAgo, read]; unread recruiter messages drive the "new messages" count.
const SEED_CONVERSATIONS = {
  'app-1': [
    ['recruiter', 'Hi! Thanks for applying to the Frontend Engineer role at TechFlow Inc.', 30, true],
    ['student', 'Thank you! I am excited about the role. Is there anything else you need from me?', 29, true],
    ['recruiter', 'Could you share a link to a recent React project you built?', 3, false],
  ],
  'app-2': [
    ['recruiter', 'Congratulations, you have been shortlisted for the Data Analyst Intern role.', 50, true],
    ['student', 'That is great news, thank you! What are the next steps?', 48, true],
    ['recruiter', 'We will send a short SQL case study this week.', 47, true],
  ],
  'app-4': [
    ['recruiter', 'Your portfolio review went well. Are you free for an interview on Friday at 11 AM?', 20, true],
    ['student', 'Yes, Friday at 11 AM works for me.', 19, true],
    ['recruiter', 'Great — the calendar invite is on its way. Please bring two case studies to discuss.', 2, false],
  ],
  'app-6': [['recruiter', 'Thanks for applying! Our team is reviewing applications this week.', 70, true]],
  'app-8': [
    ['recruiter', 'We are happy to offer you the DevOps Intern position at CloudNova!', 26, true],
    ['student', 'Thank you so much! I will review the offer letter and get back to you.', 25, true],
  ],
}

export function createSeedConversations() {
  return Object.fromEntries(
    Object.entries(SEED_CONVERSATIONS).map(([applicationId, messages]) => [
      applicationId,
      messages.map(([from, text, hours, read], index) => ({
        id: `${applicationId}-m${index + 1}`,
        from,
        text,
        sentAt: hoursAgo(hours),
        read,
      })),
    ]),
  )
}

export const RECOMMENDATIONS = [
  { id: 'rec-1', title: 'Software Intern', company: 'TechFlow Inc.', initials: 'TF', matchScore: 94, salary: '₹12–18 LPA', location: 'Bengaluru, India', employmentType: 'Full-time', workMode: 'Remote', postedDaysAgo: 2, applicants: 247, skills: ['React', 'JavaScript', 'Git', 'REST APIs'] },
  { id: 'rec-2', title: 'Frontend Developer', company: 'PixelWorks', initials: 'PW', matchScore: 91, salary: '₹8–12 LPA', location: 'Mumbai, India', employmentType: 'Full-time', workMode: 'Hybrid', postedDaysAgo: 1, applicants: 132, skills: ['React', 'Tailwind CSS', 'Figma', 'JavaScript'] },
  { id: 'rec-3', title: 'Junior Data Analyst', company: 'DataSphere', initials: 'DS', matchScore: 86, salary: '₹6–9 LPA', location: 'Hyderabad, India', employmentType: 'Full-time', workMode: 'On-site', postedDaysAgo: 3, applicants: 189, skills: ['SQL', 'Python', 'Power BI'] },
  { id: 'rec-4', title: 'Cloud Support Intern', company: 'CloudNova', initials: 'CN', matchScore: 82, salary: '₹25K–35K/month', location: 'Pune, India', employmentType: 'Internship', workMode: 'Remote', postedDaysAgo: 5, applicants: 96, skills: ['AWS', 'Linux', 'Networking'] },
  { id: 'rec-5', title: 'Full Stack Developer', company: 'ByteForge', initials: 'BF', matchScore: 79, salary: '₹10–14 LPA', location: 'Bengaluru, India', employmentType: 'Full-time', workMode: 'On-site', postedDaysAgo: 4, applicants: 210, skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'] },
  { id: 'rec-6', title: 'QA Automation Intern', company: 'MediCore Labs', initials: 'ML', matchScore: 74, salary: '₹20K–30K/month', location: 'Chennai, India', employmentType: 'Internship', workMode: 'Hybrid', postedDaysAgo: 6, applicants: 58, skills: ['Selenium', 'Java', 'Jest'] },
  { id: 'rec-7', title: 'UI Engineer (Part-time)', company: 'NimbusPay', initials: 'NP', matchScore: 71, salary: '₹30K–45K/month', location: 'Gurugram, India', employmentType: 'Part-time', workMode: 'Remote', postedDaysAgo: 7, applicants: 44, skills: ['CSS', 'JavaScript', 'Accessibility'] },
  { id: 'rec-8', title: 'Backend Intern', company: 'FinEdge', initials: 'FE', matchScore: 68, salary: '₹30K–40K/month', location: 'Mumbai, India', employmentType: 'Internship', workMode: 'On-site', postedDaysAgo: 9, applicants: 77, skills: ['Java', 'Spring Boot', 'SQL'] },
]

// Skills a Frontend Engineer resume is expected to show; anything not detected is a "missing skill".
export const TARGET_ROLE = 'Frontend Engineer'
export const TARGET_SKILLS = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'REST APIs', 'Git', 'Tailwind CSS', 'Redux', 'Jest']

// Fictional sample resumes for the Analyze resume demo. They run through the same ATS analyzer as uploads.
export const SAMPLE_RESUMES = [
  {
    id: 'frontend',
    fileName: 'Alex_Frontend_Resume.txt',
    summary: 'React projects and a front-end internship.',
    text: `Alex Morgan
alex.morgan@example.com | +91 90000 12345 | github.com/alex-demo

Education
B.Tech in Computer Science, Demo Institute of Technology, 2026 — CGPA 8.4

Experience
Frontend Intern, Demo Studio (Jan 2025 - Jun 2025)
• Built responsive React components for a web dashboard
• Improved page performance by 30% by lazy loading images
• Integrated REST APIs and handled loading and error states

Projects
• Task Board — React, JavaScript, CSS; live demo on vercel.app
• Weather App — HTML, CSS, JavaScript with a public weather API

Skills
React, JavaScript, HTML, CSS, Git, Tailwind CSS, Figma`,
  },
  {
    id: 'basic',
    fileName: 'Alex_Basic_Resume.txt',
    summary: 'A first-draft resume with fewer sections.',
    text: `Alex Morgan
alex.morgan@example.com

Objective
Hard-working student looking for a software role where I can learn and grow.

Education
B.Tech in Computer Science, 2026

Skills
Java, HTML, CSS, basic JavaScript, MS Office

Hobbies
Reading, cricket and travelling.`,
  },
]

// One tip per ATS rule that did not earn full marks. Keys match the rule labels in atsAnalyzer.js.
export const RESUME_TIPS = {
  'Technical skills': 'List more of your technical skills in a dedicated Skills section.',
  'Contact information': 'Put your email, phone and a LinkedIn or GitHub link at the top.',
  Education: 'Add an Education heading with degree, college and graduation year or CGPA.',
  'Experience / internships': 'Add internships with dates, and start bullet points with action verbs such as built or improved.',
  Projects: 'Add a Projects section with GitHub or live demo links.',
  Certifications: 'Add a Certifications section for relevant online courses.',
  'Role keywords': 'Use keywords from frontend job posts, e.g. responsive, accessibility, performance.',
  'Measurable results': 'Quantify your impact, e.g. "cut page load time by 30%".',
  'Readability & structure': 'Use clear section headings and bullet points, and keep it to one or two pages.',
}
