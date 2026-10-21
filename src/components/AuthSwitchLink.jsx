import { Link } from 'react-router-dom'

export default function AuthSwitchLink({ prompt, label, to, role }) {
  return (
    <p className="mt-7 text-center text-base text-secondary">
      {prompt}{' '}
      <Link
        to={{ pathname: to, search: `?role=${role}` }}
        className="ml-1 rounded text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {label}
      </Link>
    </p>
  )
}
