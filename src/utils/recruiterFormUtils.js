// Validation and helpers for the recruiter Company Profile and Settings pages.
// Each validator returns { field: message }; an empty object means valid.
import { COMPLETENESS_FIELDS } from '../data/companyProfile.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s()-]{8,20}$/
// GSTIN: 2-digit state code, 10-character PAN, entity number, "Z", checksum.
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
// CIN: listing status, industry code, state, year, company type, registration number.
const CIN_PATTERN = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/

export const MIN_PASSWORD_LENGTH = 8

export function isValidUrl(value) {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
  } catch {
    return false
  }
}

const isBlank = (value) => (Array.isArray(value) ? value.length === 0 : !value || String(value).trim() === '')

export function validateCompanyProfile(profile) {
  const errors = {}
  const currentYear = new Date().getFullYear()

  if (isBlank(profile.name)) errors.name = 'Company name is required.'
  if (isBlank(profile.overview)) errors.overview = 'Tell candidates what your company does.'
  else if (profile.overview.trim().length < 50) errors.overview = 'Write at least 50 characters.'
  if (isBlank(profile.website)) errors.website = 'Official website is required.'
  else if (!isValidUrl(profile.website)) errors.website = 'Enter a full URL starting with https://'
  if (isBlank(profile.hrEmail)) errors.hrEmail = 'HR email is required.'
  else if (!EMAIL_PATTERN.test(profile.hrEmail.trim())) errors.hrEmail = 'Enter a valid email address.'
  if (isBlank(profile.headquarters)) errors.headquarters = 'Headquarters is required.'
  if (profile.phone && !PHONE_PATTERN.test(profile.phone.trim())) errors.phone = 'Enter a valid phone number.'
  if (profile.founded) {
    const year = Number(profile.founded)
    if (!Number.isInteger(year) || year < 1800 || year > currentYear) errors.founded = `Enter a year between 1800 and ${currentYear}.`
  }
  if (profile.workModes.length === 0) errors.workModes = 'Choose at least one work mode.'
  if (profile.gstin && !GSTIN_PATTERN.test(profile.gstin.trim().toUpperCase())) errors.gstin = 'GSTIN must be 15 characters, e.g. 29ABCDE1234F1Z5.'
  if (profile.cin && !CIN_PATTERN.test(profile.cin.trim().toUpperCase())) errors.cin = 'CIN must be 21 characters, e.g. U72200KA2016PTC123456.'
  return errors
}

// Percentage of optional "nice to have" fields that are filled, plus the labels still missing.
export function profileCompleteness(profile) {
  const missing = COMPLETENESS_FIELDS.filter(([key]) => isBlank(profile[key])).map(([, label]) => label)
  const percent = Math.round(((COMPLETENESS_FIELDS.length - missing.length) / COMPLETENESS_FIELDS.length) * 100)
  return { percent, missing }
}

export function validateAccount(account) {
  const errors = {}
  if (isBlank(account.name)) errors.name = 'Full name is required.'
  if (isBlank(account.email)) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(account.email.trim())) errors.email = 'Enter a valid email address.'
  if (account.phone && !PHONE_PATTERN.test(account.phone.trim())) errors.phone = 'Enter a valid phone number.'
  return errors
}

export function validatePasswordChange({ current, next, confirm }) {
  const errors = {}
  if (!current) errors.current = 'Enter your current password.'
  if (!next) errors.next = 'Enter a new password.'
  else if (next.length < MIN_PASSWORD_LENGTH) errors.next = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  else if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) errors.next = 'Use at least one letter and one number.'
  else if (next === current) errors.next = 'The new password must be different from the current one.'
  if (next && confirm !== next) errors.confirm = 'Passwords do not match.'
  return errors
}

export function validateInvite({ name, email, role }, team) {
  const errors = {}
  if (isBlank(name)) errors.name = 'Enter their name.'
  if (isBlank(email)) errors.email = 'Enter their work email.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'
  else if (team.some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) {
    errors.email = 'This person is already on your team.'
  }
  if (!role) errors.role = 'Choose a role.'
  return errors
}

export const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

// Saves `data` as a JSON file in the browser (no server involved).
export function downloadJson(data, fileName) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
