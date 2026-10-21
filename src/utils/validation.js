const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

// Each validator returns an object of field -> message; empty means valid.

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateSignup({ name, email, password }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required.'
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  return errors
}
