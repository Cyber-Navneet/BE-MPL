// Deterministic, rule-based ATS compatibility estimate. It is NOT an official ATS score:
// it checks for the sections, keywords and signals typical resume parsers look for.
// The same text always produces the same result.

import { detectSkills } from './skillDetector.js'
import { TARGET_ROLE_KEYWORDS } from '../data/studentProfile.js'

const SKILLS_FOR_FULL_MARKS = 10

const has = (pattern, text) => pattern.test(text)

// A section heading: the keyword on its own short line (optionally followed by ":").
const heading = (words) => new RegExp(`^\\s*(?:${words})\\s*:?\\s*$`, 'im')

const PATTERNS = {
  email: /[\w.+-]+@[\w-]+\.[\w.-]+/,
  phone: /(?:\+?\d[\s-]?){10,13}/,
  profileLink: /(linkedin\.com|github\.com|portfolio|behance\.net|[\w-]+\.(dev|io|me)\b)/i,
  educationHeading: heading('education|academic(?:s| background| details)?|qualifications?'),
  degree: /\b(b\.?\s?e\.?|b\.?\s?tech|m\.?\s?tech|bachelor|master|b\.?sc|m\.?sc|bca|mca|diploma|degree|university|college|institute)\b/i,
  gradeOrYear: /\b(cgpa|gpa|sgpa|percentage|20[0-3]\d)\b/i,
  experienceHeading: heading('(?:work |professional )?experience|internships?|employment(?: history)?|work history'),
  dateRange: /\b(?:19|20)\d{2}\s*(?:-|–|to)\s*(?:(?:19|20)\d{2}|present|current)\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}\b/i,
  actionVerbs: /\b(built|developed|designed|implemented|led|created|improved|optimi[sz]ed|reduced|increased|deployed|automated|integrated|launched)\b/gi,
  projectsHeading: heading('(?:academic |personal |key )?projects?'),
  projectLink: /(github\.com|live demo|demo link|deployed|vercel\.app|netlify\.app)/i,
  certificationsHeading: heading('certifications?|certificates?|courses|licen[cs]es(?: & certifications)?'),
  metrics: /\b\d+(?:\.\d+)?\s?(?:%|percent|x\b|k\+?|\+|users|ms|seconds|hours)/gi,
  bullets: /^\s*[•\-*▪◦●]\s+/gm,
  anyHeading: /^\s*[A-Z][A-Za-z &/]{2,40}:?\s*$/gm,
}

const ratio = (value, target) => Math.min(1, value / target)

export function analyzeResume(text) {
  const skills = detectSkills(text)
  const lower = text.toLowerCase()
  const words = text.split(/\s+/).filter(Boolean).length
  const roleKeywordHits = TARGET_ROLE_KEYWORDS.filter((keyword) => lower.includes(keyword)).length
  const actionVerbCount = new Set((text.match(PATTERNS.actionVerbs) ?? []).map((verb) => verb.toLowerCase())).size
  const metricCount = (text.match(PATTERNS.metrics) ?? []).length
  const headingCount = (text.match(PATTERNS.anyHeading) ?? []).length
  // `match` (not `test`) for global patterns, which would otherwise carry `lastIndex` between calls.
  const hasBullets = (text.match(PATTERNS.bullets) ?? []).length > 0

  const rules = [
    { label: 'Technical skills', max: 25, earned: 25 * ratio(skills.length, SKILLS_FOR_FULL_MARKS) },
    {
      label: 'Contact information',
      max: 10,
      earned: (has(PATTERNS.email, text) ? 5 : 0) + (has(PATTERNS.phone, text) ? 3 : 0) + (has(PATTERNS.profileLink, text) ? 2 : 0),
    },
    {
      label: 'Education',
      max: 12,
      earned:
        (has(PATTERNS.educationHeading, text) ? 6 : 0) +
        (has(PATTERNS.degree, text) ? 4 : 0) +
        (has(PATTERNS.gradeOrYear, text) ? 2 : 0),
    },
    {
      label: 'Experience / internships',
      max: 15,
      earned:
        (has(PATTERNS.experienceHeading, text) ? 8 : 0) +
        (has(PATTERNS.dateRange, text) ? 4 : 0) +
        3 * ratio(actionVerbCount, 4),
    },
    {
      label: 'Projects',
      max: 13,
      earned: (has(PATTERNS.projectsHeading, text) ? 9 : 0) + (has(PATTERNS.projectLink, text) ? 4 : 0),
    },
    { label: 'Certifications', max: 5, earned: has(PATTERNS.certificationsHeading, text) ? 5 : 0 },
    { label: 'Role keywords', max: 10, earned: 10 * ratio(roleKeywordHits, 6) },
    { label: 'Measurable results', max: 5, earned: 5 * ratio(metricCount, 3) },
    {
      label: 'Readability & structure',
      max: 5,
      earned: (words >= 200 && words <= 1200 ? 2 : 0) + (headingCount >= 4 ? 2 : 0) + (hasBullets ? 1 : 0),
    },
  ].map((rule) => ({ ...rule, earned: Math.round(rule.earned) }))

  const score = Math.max(0, Math.min(100, rules.reduce((sum, rule) => sum + rule.earned, 0)))
  const missing = rules.filter((rule) => rule.earned === 0).map((rule) => rule.label.toLowerCase())

  return {
    score,
    tier: tierFor(score),
    skills,
    rules,
    summary:
      missing.length === 0
        ? 'Resume parsed successfully. All key sections and signals were detected.'
        : `Resume parsed successfully. Not detected: ${missing.join(', ')}.`,
  }
}

export function tierFor(score) {
  if (score >= 80) return 'Tier-1 Ready'
  if (score >= 60) return 'Good Match'
  return 'Needs Improvement'
}
