import { SKILLS } from '../data/skills.js'

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Word-boundary match that treats "+", "#" and "." as part of a word on the left, so
// "Java" does not match inside "JavaScript" and "JS" does not match the ".js" in "Node.js".
const boundaryPattern = (alias, flags) =>
  new RegExp(`(?<![A-Za-z0-9+#.])${escapeRegExp(alias)}(?![A-Za-z0-9+#])`, flags)

const MATCHERS = SKILLS.map((skill) => ({
  name: skill.name,
  patterns: [
    ...skill.aliases.map((alias) => boundaryPattern(alias, 'i')),
    ...(skill.exact ?? []).map((alias) => boundaryPattern(alias, '')),
  ],
}))

// Returns unique skill names (dictionary order) mentioned in `text`.
export function detectSkills(text) {
  if (!text) return []
  return MATCHERS.filter(({ patterns }) => patterns.some((pattern) => pattern.test(text))).map(({ name }) => name)
}

// Maps a job's skill label (e.g. "Tailwind") to its dictionary name ("Tailwind CSS").
export function canonicalSkill(label) {
  return detectSkills(label)[0] ?? label
}
