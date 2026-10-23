import { canonicalSkill } from './skillDetector.js'

// Resume-to-job match: the share of the job's required skills found in the resume, as a whole percentage.
export function matchJob(job, resumeSkills) {
  const owned = new Set(resumeSkills)
  const required = job.skills.map((label) => ({ label, matched: owned.has(canonicalSkill(label)) }))
  const matchedCount = required.filter((skill) => skill.matched).length
  return {
    matchScore: Math.round((100 * matchedCount) / required.length),
    matchedSkills: required.filter((skill) => skill.matched).map((skill) => skill.label),
    missingSkills: required.filter((skill) => !skill.matched).map((skill) => skill.label),
  }
}

// Returns new job objects with `matchScore` replaced by the resume match. Source jobs are not mutated.
export function matchJobs(jobs, resumeSkills) {
  return jobs.map((job) => ({ ...job, ...matchJob(job, resumeSkills) }))
}
