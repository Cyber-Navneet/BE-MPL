// The demo student's editable profile and app settings, persisted in localStorage.

import { CURRENT_USER } from '../data/users.js'
import { createLocalStore } from './localStore.js'

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const stringList = (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : null)

// Fills any missing or malformed field from the default profile, so older saved data keeps working.
function parseProfile(value) {
  if (!isObject(value)) return CURRENT_USER
  const pick = (field, check) => (check(value[field]) ? value[field] : CURRENT_USER[field])
  const isText = (item) => typeof item === 'string'
  const resume = isObject(value.resume) ? value.resume : {}
  const preferences = isObject(value.preferences) ? value.preferences : {}

  return {
    ...CURRENT_USER,
    id: pick('id', isText),
    name: pick('name', (item) => isText(item) && item.trim() !== ''),
    email: pick('email', isText),
    phone: pick('phone', isText),
    location: pick('location', isText),
    university: pick('university', isText),
    degree: pick('degree', isText),
    graduationYear: pick('graduationYear', Number.isInteger),
    experienceLevel: pick('experienceLevel', isText),
    skills: stringList(value.skills) ?? CURRENT_USER.skills,
    resume: {
      fileName: typeof resume.fileName === 'string' ? resume.fileName : CURRENT_USER.resume.fileName,
      uploaded: typeof resume.uploaded === 'boolean' ? resume.uploaded : CURRENT_USER.resume.uploaded,
    },
    preferences: {
      workplaceTypes: stringList(preferences.workplaceTypes) ?? CURRENT_USER.preferences.workplaceTypes,
      locations: stringList(preferences.locations) ?? CURRENT_USER.preferences.locations,
    },
  }
}

export const profileStore = createLocalStore('talentforge.profile', {
  fallback: () => CURRENT_USER,
  parse: parseProfile,
})

export const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

export const hasResume = (profile) => profile.resume.uploaded && profile.resume.fileName.trim() !== ''

export const DEFAULT_SETTINGS = {
  applicationUpdates: true,
  assessmentReminders: true,
  jobAlerts: true,
  jobAlertFrequency: 'weekly',
  profileVisibleToRecruiters: true,
}

export const settingsStore = createLocalStore('talentforge.settings', {
  fallback: () => DEFAULT_SETTINGS,
  parse: (value) =>
    isObject(value)
      ? Object.fromEntries(
          Object.entries(DEFAULT_SETTINGS).map(([key, fallback]) => [
            key,
            typeof value[key] === typeof fallback ? value[key] : fallback,
          ]),
        )
      : DEFAULT_SETTINGS,
})
