// Fictional candidates for the recruiter's Candidate Applications board — not real people or companies.
// Timestamps are relative to when the demo data is first created in a browser.

// Pipeline columns, left to right. Rejected candidates leave the board but stay in the data.
export const STAGES = [
  { id: 'applied', label: 'Applied', dot: 'bg-blue-600' },
  { id: 'assessment', label: 'Assessments', dot: 'bg-yellow-400' },
  { id: 'interview', label: 'Tech. Interview', dot: 'bg-orange-500' },
  { id: 'offer', label: 'Offer', dot: 'bg-purple-500' },
  { id: 'hired', label: 'Hired', dot: 'bg-green-500' },
]
export const REJECTED_STAGE = { id: 'rejected', label: 'Rejected', dot: 'bg-red-500' }

export const OFFER_STATUSES = {
  Accepted: { text: 'The candidate has accepted the offer.', className: 'text-green-600' },
  Declined: { text: 'The candidate has declined the offer.', className: 'text-red-500' },
  Pending: { text: 'The candidate’s decision is pending.', className: 'text-yellow-600' },
}

export const INTERVIEW_TYPES = ['Video', 'Phone', 'In Person']

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR_MS).toISOString()
// Calendar date `days` from today as YYYY-MM-DD (local time), for date inputs.
const dateFromToday = (days) => {
  const date = new Date(Date.now() + days * DAY_MS)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// [id, name, role, currentCompany, location, skills, stage, matchScore, assessmentScore, hoursInStage, extra]
const SEED = [
  ['c-1', 'Ananya Deshmukh', 'Senior Full-Stack Engineer', 'TechFlow Inc.', 'Pune, India', ['React', 'Node.js', 'PostgreSQL', 'AWS'], 'applied', 96, null, 2],
  ['c-2', 'Rohan Mehta', 'Frontend Engineer', 'PixelWorks', 'Mumbai, India', ['React', 'TypeScript', 'Tailwind CSS'], 'applied', 91, null, 5],
  ['c-3', 'Sara Khan', 'Data Analyst', 'DataSphere', 'Hyderabad, India', ['SQL', 'Python', 'Power BI'], 'applied', 88, null, 9],
  ['c-4', 'Vikram Iyer', 'Backend Engineer', 'ByteForge', 'Bengaluru, India', ['Java', 'Spring Boot', 'MySQL'], 'applied', 84, null, 20],
  ['c-5', 'Meera Nair', 'Software Intern', 'Student, Demo Institute', 'Kochi, India', ['JavaScript', 'HTML', 'CSS'], 'applied', 79, null, 30],
  ['c-6', 'Arjun Patel', 'Software Engineer', 'CloudNova', 'Ahmedabad, India', ['Go', 'Docker', 'Kubernetes'], 'applied', 74, null, 52],
  ['c-7', 'Ishita Rao', 'Frontend Engineer', 'NimbusPay', 'Bengaluru, India', ['Vue', 'JavaScript', 'Figma'], 'applied', 68, null, 75],
  ['c-8', 'Kabir Singh', 'Senior Full-Stack Engineer', 'FinEdge', 'Gurugram, India', ['Next.js', 'GraphQL', 'MongoDB'], 'assessment', 92, 85, 24],
  ['c-9', 'Priya Sharma', 'Backend Engineer', 'Orbit Analytics', 'Chennai, India', ['Python', 'Django', 'PostgreSQL'], 'assessment', 87, 78, 28],
  ['c-10', 'Aditya Joshi', 'Software Engineer', 'MediCore Labs', 'Pune, India', ['C++', 'Data Structures & Algorithms', 'Linux'], 'assessment', 83, 91, 33],
  ['c-11', 'Neha Gupta', 'Data Analyst', 'DataSphere', 'Noida, India', ['SQL', 'Excel', 'Tableau'], 'assessment', 80, 66, 48],
  ['c-12', 'Siddharth Rao', 'Software Intern', 'Student, Demo College', 'Indore, India', ['Java', 'SQL', 'Git'], 'assessment', 77, 72, 60],
  ['c-13', 'Tanvi Kulkarni', 'Frontend Engineer', 'PixelWorks', 'Mumbai, India', ['React', 'Redux', 'Jest'], 'interview', 90, 88, 15, { interview: { date: dateFromToday(2), time: '15:00', type: 'Video', interviewer: 'Rahul Verma', notes: 'Focus on React performance.' } }],
  ['c-14', 'Rahul Bansal', 'Backend Engineer', 'ByteForge', 'Bengaluru, India', ['Node.js', 'Express', 'Redis'], 'interview', 86, 82, 18],
  ['c-15', 'Pooja Menon', 'Senior Full-Stack Engineer', 'CloudNova', 'Kochi, India', ['React', 'Java', 'AWS'], 'interview', 85, 79, 26, { interview: { date: dateFromToday(4), time: '11:30', type: 'In Person', interviewer: 'Sneha Pillai', notes: '' } }],
  ['c-16', 'Karan Malhotra', 'Software Engineer', 'NimbusPay', 'Delhi, India', ['Python', 'Microservices', 'Docker'], 'interview', 81, 75, 40],
  ['c-17', 'Diya Reddy', 'Data Analyst', 'Orbit Analytics', 'Hyderabad, India', ['Python', 'Pandas', 'SQL'], 'interview', 78, 84, 55],
  ['c-18', 'Nikhil Verma', 'Frontend Engineer', 'TechFlow Inc.', 'Pune, India', ['React', 'TypeScript', 'Testing Library'], 'offer', 89, 87, 1, { offer: { status: 'Accepted', salary: 1600000, joiningDate: dateFromToday(30), notes: '' } }],
  ['c-19', 'Riya Kapoor', 'Backend Engineer', 'FinEdge', 'Mumbai, India', ['Java', 'Spring Boot', 'Kafka'], 'offer', 84, 81, 1, { offer: { status: 'Declined', salary: 1400000, joiningDate: dateFromToday(21), notes: '' } }],
  ['c-20', 'Aman Chauhan', 'Software Engineer', 'MediCore Labs', 'Jaipur, India', ['Go', 'PostgreSQL', 'AWS'], 'offer', 82, 80, 3, { offer: { status: 'Pending', salary: 1500000, joiningDate: dateFromToday(25), notes: '' } }],
  ['c-21', 'Sneha Pillai', 'Software Intern', 'Student, Demo University', 'Chennai, India', ['React', 'JavaScript', 'Git'], 'offer', 80, 86, 6, { offer: { status: 'Accepted', salary: 480000, joiningDate: dateFromToday(14), notes: 'Six-month internship.' } }],
  ['c-22', 'Varun Desai', 'Senior Full-Stack Engineer', 'TechFlow Inc.', 'Bengaluru, India', ['React', 'Node.js', 'AWS'], 'hired', 93, 90, 1, { salaryLabel: '₹12–18 LPA' }],
  ['c-23', 'Ira Banerjee', 'Data Analyst', 'DataSphere', 'Kolkata, India', ['SQL', 'Power BI', 'Python'], 'hired', 88, 89, 4, { salaryLabel: '₹8–11 LPA' }],
  ['c-24', 'Manav Shah', 'Backend Engineer', 'ByteForge', 'Ahmedabad, India', ['Java', 'Spring Boot', 'Docker'], 'hired', 86, 83, 30, { salaryLabel: '₹10–14 LPA' }],
]

export function createSeedCandidates() {
  return SEED.map(([id, name, role, company, location, skills, stage, matchScore, assessmentScore, hours, extra = {}]) => ({
    id,
    name,
    role,
    company,
    location,
    skills,
    stage,
    matchScore,
    assessmentScore,
    stageUpdatedAt: hoursAgo(hours),
    interview: null,
    offer: null,
    salaryLabel: null,
    rejection: null,
    ...extra,
  }))
}

// Simulated chat with hired candidates. [from, text, hoursAgo]
const SEED_CHATS = {
  'c-22': [
    ['recruiter', 'Welcome aboard, Varun! Your onboarding starts next Monday.', 20],
    ['candidate', 'Thank you! Looking forward to it. Should I bring any documents?', 19],
  ],
  'c-23': [['candidate', 'Hi! I have signed and returned the offer letter.', 6]],
  'c-24': [['recruiter', 'Congratulations, Manav! HR will share your laptop setup details soon.', 28]],
}

export function createSeedChats() {
  return Object.fromEntries(
    Object.entries(SEED_CHATS).map(([candidateId, messages]) => [
      candidateId,
      messages.map(([from, text, hours], index) => ({ id: `${candidateId}-m${index + 1}`, from, text, sentAt: hoursAgo(hours) })),
    ]),
  )
}

// Assessment sections; each candidate's section scores are offsets around their overall score.
export const ASSESSMENT_SECTIONS = [
  { name: 'JavaScript', offset: 4 },
  { name: 'React', offset: 2 },
  { name: 'SQL', offset: -6 },
  { name: 'Problem solving', offset: 0 },
  { name: 'Communication', offset: -3 },
]

export const SAMPLE_ANSWERS = [
  {
    question: 'Explain the difference between `let`, `const` and `var`.',
    answer: '`let` and `const` are block-scoped; `const` cannot be reassigned. `var` is function-scoped and hoisted.',
  },
  {
    question: 'Write a SQL query to find the second-highest salary.',
    answer: 'SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);',
  },
  {
    question: 'How would you prevent unnecessary re-renders in React?',
    answer: 'Memoise expensive children with React.memo, stabilise callbacks with useCallback and keep state close to where it is used.',
  },
]
