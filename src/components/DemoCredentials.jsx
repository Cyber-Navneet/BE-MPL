import { getDemoCredentials } from '../utils/mockAuth.js'

export default function DemoCredentials({ role, onUse }) {
  const { email, password } = getDemoCredentials(role)

  return (
    <details className="group mt-6 text-sm text-secondary">
      <summary className="mx-auto w-fit cursor-pointer list-none rounded-md px-2 py-1 hover:text-heading focus-visible:outline-2 focus-visible:outline-primary">
        <span className="underline decoration-dotted underline-offset-4">Demo credentials</span>
        <span className="ml-1 inline-block transition-transform group-open:rotate-180" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-segment px-4 py-3">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt>Email</dt>
          <dd className="font-medium break-all text-heading">{email}</dd>
          <dt>Password</dt>
          <dd className="font-medium text-heading">{password}</dd>
        </dl>
        <button
          type="button"
          onClick={() => onUse({ email, password })}
          className="rounded-lg border border-field bg-white px-3 py-1.5 font-medium text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary"
        >
          Use these
        </button>
      </div>
      <p className="mt-2 text-center text-xs">For demo only — sign-in is simulated in the browser.</p>
    </details>
  )
}
