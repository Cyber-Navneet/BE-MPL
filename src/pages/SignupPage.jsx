import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { LockKeyhole, Mail, User } from 'lucide-react'
import AuthHeading from '../components/AuthHeading.jsx'
import AuthSwitchLink from '../components/AuthSwitchLink.jsx'
import FormAlert from '../components/FormAlert.jsx'
import FormInput from '../components/FormInput.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import { useCompleteAuth } from '../hooks/useCompleteAuth.js'
import { registerAccount } from '../utils/mockAuth.js'
import { validateSignup } from '../utils/validation.js'

const subtitles = {
  student: 'Create your account and start your journey',
  recruiter: 'Create your account and start hiring smarter',
}

export default function SignupPage() {
  const { role } = useOutletContext()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { isCompleting, complete } = useCompleteAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const fieldErrors = validateSignup(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    const result = registerAccount({ ...values, role })
    if (result.error) {
      setErrors({ email: result.error })
      return
    }
    complete(result.user)
  }

  return (
    <>
      <AuthHeading title={`Join as a ${role}`} subtitle={subtitles[role]} />

      <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Full Name"
          icon={User}
          name="name"
          autoComplete="name"
          placeholder="Enter your name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="Enter password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        {isCompleting && (
          <FormAlert tone="success">Demo account created for this session. Redirecting…</FormAlert>
        )}

        <SubmitButton loading={isCompleting}>Create Account</SubmitButton>
      </form>

      <AuthSwitchLink prompt="Already have an account?" label="Sign in" to="/login" role={role} />
    </>
  )
}
