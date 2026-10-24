// Builds a skill-based assessment for one application. Fully deterministic: the same
// application, job and candidate skills always produce the same questions in the same order.

import { SKILLS } from '../data/skills.js'
import { BANK_SKILLS, BANK_SKILL_ALIASES, GENERAL_SKILLS, QUESTION_BANK } from '../data/questionBank.js'
import { canonicalSkill } from './skillDetector.js'

const MAX_SKILLS = 6
const SHORT_ANSWER_SHARE = 0.15
const MINUTES_PER_MCQ = 1.25
const MINUTES_PER_SHORT_ANSWER = 3
export const PASSING_SCORE = 60
export const START_WINDOW_DAYS = 7

const CATEGORY_OF = new Map(SKILLS.map((skill) => [skill.name, skill.category]))

const toBankSkill = (skill) => BANK_SKILL_ALIASES[skill] ?? (BANK_SKILLS.includes(skill) ? skill : null)

// Small string hash + seeded PRNG, so "random-looking" picks are reproducible.
function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededShuffle(items, seedText) {
  let seed = hashString(seedText)
  const random = () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Weight per bank skill: required by the job and on the candidate's resume/profile = 3,
// required by the job only = 2, candidate skill in the job's main field = 1.
export function selectAssessmentSkills(jobSkillLabels, candidateSkills) {
  const jobSkills = [...new Set(jobSkillLabels.map(canonicalSkill))]
  const candidate = new Set(candidateSkills)
  const candidateBank = new Set(candidateSkills.map(toBankSkill).filter(Boolean))
  const weights = new Map()

  jobSkills.forEach((skill) => {
    const bankSkill = toBankSkill(skill)
    if (!bankSkill) return
    const weight = candidate.has(skill) || candidateBank.has(bankSkill) ? 3 : 2
    weights.set(bankSkill, Math.max(weights.get(bankSkill) ?? 0, weight))
  })

  // Only the job's main field(s) — the categories holding most of its skills — can pull in extra
  // candidate skills, so a Java resume doesn't add Java questions to a frontend job.
  const categoryCounts = new Map()
  jobSkills.forEach((skill) => {
    const category = CATEGORY_OF.get(skill)
    if (category) categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
  })
  const topCount = Math.max(0, ...categoryCounts.values())
  const jobCategories = new Set([...categoryCounts].filter(([, n]) => n === topCount).map(([category]) => category))
  candidateSkills.forEach((skill) => {
    const bankSkill = toBankSkill(skill)
    if (bankSkill && !weights.has(bankSkill) && jobCategories.has(CATEGORY_OF.get(skill))) weights.set(bankSkill, 1)
  })

  if (weights.size === 0) {
    return { general: true, skills: GENERAL_SKILLS.map((skill) => ({ skill, weight: 1 })) }
  }
  const skills = [...weights.entries()]
    .map(([skill, weight]) => ({ skill, weight }))
    .sort((a, b) => b.weight - a.weight) // stable: keeps job order within a weight
    .slice(0, MAX_SKILLS)
  return { general: false, skills }
}

// Splits `total` across skills in proportion to weight (largest remainder), never exceeding
// what each skill has available; leftovers go to skills that still have questions.
function allocate(total, skills, available) {
  const weightSum = skills.reduce((sum, { weight }) => sum + weight, 0)
  const shares = skills.map(({ skill, weight }) => {
    const exact = (total * weight) / weightSum
    return { skill, count: Math.min(Math.floor(exact), available[skill]), remainder: exact % 1 }
  })
  let remaining = total - shares.reduce((sum, share) => sum + share.count, 0)
  const byRemainder = [...shares].sort((a, b) => b.remainder - a.remainder)
  while (remaining > 0) {
    const next = byRemainder.find((share) => share.count < available[share.skill])
    if (!next) break
    next.count += 1
    remaining -= 1
    byRemainder.push(byRemainder.splice(byRemainder.indexOf(next), 1)[0])
  }
  return Object.fromEntries(shares.map(({ skill, count }) => [skill, count]))
}

export function questionCountFor(skillCount) {
  if (skillCount <= 2) return 10
  if (skillCount <= 4) return 15
  return 20
}

// Typing questions take longer than MCQs; round to the nearest 5 minutes (minimum 10).
export function durationFor(mcqCount, shortAnswerCount) {
  const minutes = mcqCount * MINUTES_PER_MCQ + shortAnswerCount * MINUTES_PER_SHORT_ANSWER
  return Math.max(10, Math.round(minutes / 5) * 5)
}

// Places typing questions evenly between the MCQs.
function interleave(mcqs, shortAnswers) {
  const total = mcqs.length + shortAnswers.length
  const slots = new Set(shortAnswers.map((_, i) => Math.round(((i + 1) * total) / (shortAnswers.length + 1)) - 1))
  const result = []
  let m = 0
  let s = 0
  for (let index = 0; index < total; index += 1) {
    result.push(slots.has(index) && s < shortAnswers.length ? shortAnswers[s++] : (mcqs[m++] ?? shortAnswers[s++]))
  }
  return result
}

export function buildAssessment({ application, job, resumeSkills, profileSkills, now }) {
  const usingResume = resumeSkills.length > 0
  const candidateSkills = usingResume ? resumeSkills : profileSkills
  const { general, skills } = selectAssessmentSkills(job.skills, candidateSkills)

  const pools = Object.fromEntries(
    skills.map(({ skill }) => {
      const questions = seededShuffle(
        QUESTION_BANK.filter((question) => question.skill === skill),
        `${application.id}:${skill}`,
      )
      return [skill, { mcq: questions.filter((q) => q.type === 'mcq'), short: questions.filter((q) => q.type === 'short_answer') }]
    }),
  )
  const count = (type) => Object.fromEntries(skills.map(({ skill }) => [skill, pools[skill][type].length]))

  const targetTotal = questionCountFor(skills.length)
  const shortAnswers = allocate(Math.round(targetTotal * SHORT_ANSWER_SHARE), skills, count('short'))
  const shortCount = Object.values(shortAnswers).reduce((sum, n) => sum + n, 0)
  const mcqs = allocate(targetTotal - shortCount, skills, count('mcq'))

  const pick = (allocation, type) => skills.flatMap(({ skill }) => pools[skill][type].slice(0, allocation[skill]))
  const questions = interleave(seededShuffle(pick(mcqs, 'mcq'), `${application.id}:order`), pick(shortAnswers, 'short'))
  const mcqCount = questions.filter((q) => q.type === 'mcq').length

  return {
    id: `asm-${application.id}`,
    applicationId: application.id,
    jobId: job.id,
    title: `${job.title} Skills Assessment`,
    skills: skills.map(({ skill }) => skill),
    general,
    skillSource: usingResume ? 'resume' : 'profile',
    questionIds: questions.map((q) => q.id),
    questionCount: questions.length,
    mcqCount,
    shortAnswerCount: questions.length - mcqCount,
    // A job may fix its assessment length; otherwise it follows the question mix.
    durationMinutes: job.assessmentDurationMinutes ?? durationFor(mcqCount, questions.length - mcqCount),
    passingScore: PASSING_SCORE,
    assignedAt: now,
    startBy: now + START_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    status: 'not_started',
    startedAt: null,
    deadline: null,
    answers: {},
    submittedAt: null,
    submitReason: null,
    result: null,
  }
}
