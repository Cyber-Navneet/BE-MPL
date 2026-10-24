// Deterministic profile-to-job match used by Job Discovery and the job details page.
// Same profile + same job always gives the same score; nothing is random or fetched.

import { canonicalSkill } from './skillDetector.js'

export const MATCH_WEIGHTS = { required: 60, preferred: 25, education: 10, preferences: 5 }

const RELEVANT_DEGREE = /computer|information technology|\bit\b|software|electronics|data|engineering/i

const normalize = (skill) => canonicalSkill(skill.trim()).toLowerCase()

function compareSkills(jobSkills, owned) {
  return jobSkills.map((skill) => ({ skill, matched: owned.has(normalize(skill)) }))
}

const ratio = (items) => (items.length === 0 ? 0 : items.filter((item) => item.matched).length / items.length)

// Returns the score (0–100), a per-part breakdown and the skill-by-skill comparison.
export function analyzeMatch(profile, job) {
  const owned = new Set(profile.skills.map(normalize))
  const required = compareSkills(job.skills, owned)
  const preferred = compareSkills(job.preferredSkills ?? [], owned)

  const requiredPoints = ratio(required) * MATCH_WEIGHTS.required
  // Jobs without nice-to-haves score that share on their required skills instead.
  const preferredPoints = (preferred.length > 0 ? ratio(preferred) : ratio(required)) * MATCH_WEIGHTS.preferred
  const educationPoints = !profile.degree?.trim()
    ? 0
    : RELEVANT_DEGREE.test(profile.degree)
      ? MATCH_WEIGHTS.education
      : MATCH_WEIGHTS.education / 2
  const prefersWorkplace = profile.preferences.workplaceTypes.includes(job.locationType)
  const prefersLocation = profile.preferences.locations.includes(job.location)
  const preferencePoints = prefersWorkplace || prefersLocation ? MATCH_WEIGHTS.preferences : 0

  return {
    score: Math.min(100, Math.round(requiredPoints + preferredPoints + educationPoints + preferencePoints)),
    breakdown: {
      required: Math.round(requiredPoints),
      preferred: Math.round(preferredPoints),
      education: Math.round(educationPoints),
      preferences: preferencePoints,
    },
    required,
    preferred,
    prefersWorkplace,
    prefersLocation,
  }
}

// Rows for "Why This Matches You": matched skills first (required before preferred), then gaps.
// Each row: { skill, kind: 'required' | 'preferred', matched }.
export function matchReasons(analysis) {
  const rows = [
    ...analysis.required.map((item) => ({ ...item, kind: 'required' })),
    ...analysis.preferred.map((item) => ({ ...item, kind: 'preferred' })),
  ]
  return [...rows.filter((row) => row.matched), ...rows.filter((row) => !row.matched)]
}
