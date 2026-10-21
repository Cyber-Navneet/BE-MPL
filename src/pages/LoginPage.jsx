import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import AuthHeading from '../components/AuthHeading.jsx'
import AuthSwitchLink from '../components/AuthSwitchLink.jsx'
import DemoCredentials from '../components/DemoCredentials.jsx'
import FormAlert from '../components/FormAlert.jsx'
import FormInput from '../components/FormInput.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import { useCompleteAuth } from '../hooks/useCompleteAuth.js'
import { authenticate } from '../utils/mockAuth.js'
import { validateLogin } from '../utils/validation.js'

export default function LoginPage() {
  const { role } = useOutletContext()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const { isCompleting, complete } = useCompleteAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    const fieldErrors = validateLogin(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    const user = authenticate({ ...values, role })
    if (!user) {
      setFormError('Invalid email or password.')
      setValues((prev) => ({ ...prev, password: '' }))
      return
    }
    complete(user)
  }

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Sign in to your TalentForge account." />

      <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Email"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Password"
          icon={LockKeyhole}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        {isCompleting && <FormAlert tone="success">Signed in successfully. Redirecting…</FormAlert>}

        <SubmitButton loading={isCompleting}>Sign In</SubmitButton>
      </form>

      <AuthSwitchLink prompt="Don’t have an account?" label="Sign up" to="/signup" role={role} />

      <DemoCredentials
        role={role}
        onUse={(credentials) => {
          setValues(credentials)
          setErrors({})
          setFormError('')
        }}
      />
    </>
  )
}
