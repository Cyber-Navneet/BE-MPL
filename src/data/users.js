// Fictional demo students for the profile, AI match and apply flow. Not real people.
// `preferences` feed the AI match (preferred workplace types and cities).

// The default profile. CI/CD, Testing Library and Accessibility are included so that the
// Frontend Engineer (TechFlow) match works out to 92 from the formula in utils/matchScore.js.
export const CURRENT_USER = {
  id: 'student-001',
  name: 'Aarav Sharma',
  role: 'Student',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  avatarInitials: 'AS',
  university: 'Bengaluru Institute of Technology',
  degree: 'B.Tech in Computer Science',
  graduationYear: 2026,
  experienceLevel: 'Fresher',
  skills: [
    'React',
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'Git',
    'REST APIs',
    'CI/CD',
    'Testing Library',
    'Accessibility',
  ],
  resume: { fileName: 'Aarav_Sharma_Resume.pdf', uploaded: true },
  preferences: { workplaceTypes: ['Remote', 'Hybrid'], locations: ['Bengaluru, India'] },
}

// Alternative profiles that can be loaded from My Profile to see different match scores.
export const DEMO_STUDENTS = [
  CURRENT_USER,
  {
    id: 'student-002',
    name: 'Diya Patel',
    role: 'Student',
    email: 'diya.patel@example.com',
    phone: '+91 91234 56780',
    location: 'Pune, India',
    avatarInitials: 'DP',
    university: 'Pune College of Engineering',
    degree: 'B.E. in Information Technology',
    graduationYear: 2025,
    experienceLevel: 'Fresher',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git', 'Data Structures & Algorithms'],
    resume: { fileName: 'Diya_Patel_Resume.pdf', uploaded: true },
    preferences: { workplaceTypes: ['On-site', 'Hybrid'], locations: ['Pune, India', 'Mumbai, India'] },
  },
  {
    id: 'student-003',
    name: 'Kabir Singh',
    role: 'Student',
    email: 'kabir.singh@example.com',
    phone: '+91 99887 76655',
    location: 'Delhi NCR, India',
    avatarInitials: 'KS',
    university: 'Delhi School of Applied Sciences',
    degree: 'B.Sc. in Statistics',
    graduationYear: 2026,
    experienceLevel: 'Fresher',
    skills: ['Python', 'SQL', 'Pandas', 'Excel', 'Power BI'],
    resume: { fileName: 'Kabir_Singh_Resume.pdf', uploaded: true },
    preferences: { workplaceTypes: ['Remote'], locations: ['Delhi NCR, India'] },
  },
  {
    id: 'student-004',
    name: 'Meera Nair',
    role: 'Student',
    email: 'meera.nair@example.com',
    phone: '+91 90000 11223',
    location: 'Chennai, India',
    avatarInitials: 'MN',
    university: 'Chennai Institute of Technology',
    degree: 'B.Tech in Electronics',
    graduationYear: 2027,
    experienceLevel: 'Fresher',
    skills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    resume: { fileName: '', uploaded: false },
    preferences: { workplaceTypes: ['Remote', 'Hybrid'], locations: ['Chennai, India'] },
  },
]

export const EXPERIENCE_LEVELS = ['Fresher', '0–1 years', '1–3 years', '3+ years']
export const WORKPLACE_TYPES = ['Remote', 'Hybrid', 'On-site']
