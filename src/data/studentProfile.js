// Demo student shown before a resume is analysed. Nothing here is derived from an uploaded file.
export const STUDENT_PROFILE = {
  name: 'Aarav Sharma',
  role: 'Student',
  degree: 'BE Electronics and Telecommunication Engineering',
  targetRole: 'Frontend Developer',
  skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'REST APIs', 'Git', 'UI/UX', 'State Management'],
}

// Words a Frontend Developer resume is expected to mention; used by the "role keywords" rule.
export const TARGET_ROLE_KEYWORDS = [
  'frontend',
  'front-end',
  'web',
  'responsive',
  'component',
  'ui',
  'accessibility',
  'performance',
  'api',
  'browser',
  'design',
  'testing',
]

// Fixed demo preview so the page looks complete before an upload. Clearly labelled as demo in the UI.
export const DEMO_ANALYSIS = {
  score: 84,
  skills: STUDENT_PROFILE.skills,
  summary: 'Sample result for the demo profile. Upload your resume and click Check ATS Score to see your own.',
}
