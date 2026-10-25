import { useState } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import DialogButtons from '../recruiter/DialogButtons.jsx'
import Field from '../recruiter/Field.jsx'
import SelectInput from '../recruiterForms/SelectInput.jsx'
import { TEAM_ROLES } from '../../data/recruiterSettings.js'
import { initialsOf, validateInvite } from '../../utils/recruiterFormUtils.js'
import { cn } from '../../utils/cn.js'

const EMPTY_INVITE = { name: '', email: '', role: 'Interviewer' }

// Team members: change roles, invite by email and remove (with confirmation). Changes apply immediately.
// The signed-in recruiter cannot remove themselves, and the last Admin cannot be removed or demoted.
export default function TeamSection({ team, onChange, currentEmail, notify }) {
  const [invite, setInvite] = useState(EMPTY_INVITE)
  const [errors, setErrors] = useState({})
  const [removeId, setRemoveId] = useState(null)

  const adminCount = team.filter((member) => member.role === 'Admin').length
  const toRemove = team.find((member) => member.id === removeId)
  const isSelf = (member) => member.email.toLowerCase() === currentEmail.toLowerCase()
  const isLastAdmin = (member) => member.role === 'Admin' && adminCount === 1

  const changeRole = (member, role) => {
    if (isLastAdmin(member) && role !== 'Admin') {
      notify('Your team needs at least one Admin. Make someone else an Admin first.')
      return
    }
    onChange(team.map((item) => (item.id === member.id ? { ...item, role } : item)))
    notify(`${member.name} is now ${role === 'Admin' ? 'an' : 'a'} ${role}.`, 'success')
  }

  const sendInvite = (event) => {
    event.preventDefault()
    const nextErrors = validateInvite(invite, team)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const member = { id: `tm-${Date.now()}`, name: invite.name.trim(), email: invite.email.trim(), role: invite.role, status: 'Invited' }
    onChange([...team, member])
    setInvite(EMPTY_INVITE)
    notify(`Invite recorded for ${member.email}. Demo only — no email was sent.`, 'success')
  }

  const confirmRemove = () => {
    onChange(team.filter((member) => member.id !== toRemove.id))
    notify(`${toRemove.name} was removed from your team.`)
    setRemoveId(null)
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-home-border rounded-xl border border-home-border">
        {team.map((member) => (
          <li key={member.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:p-4">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-home-tint text-sm font-bold text-home-blue">
              {initialsOf(member.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-medium text-home-ink">
                {member.name}
                {isSelf(member) && <span className="text-xs text-home-muted">(you)</span>}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    member.status === 'Invited' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
                  )}
                >
                  {member.status}
                </span>
              </p>
              <p className="truncate text-sm text-secondary">{member.email}</p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label className="sr-only" htmlFor={`role-${member.id}`}>
                Role for {member.name}
              </label>
              <select
                id={`role-${member.id}`}
                value={member.role}
                onChange={(event) => changeRole(member, event.target.value)}
                className="h-10 flex-1 cursor-pointer rounded-lg border border-home-border bg-white px-3 text-sm text-home-ink focus-visible:border-home-blue focus-visible:outline-2 focus-visible:outline-home-blue/30 sm:w-36 sm:flex-none"
              >
                {TEAM_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRemoveId(member.id)}
                disabled={isSelf(member) || isLastAdmin(member)}
                title={isSelf(member) ? 'You cannot remove yourself' : isLastAdmin(member) ? 'The last Admin cannot be removed' : undefined}
                aria-label={`Remove ${member.name}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-home-blue disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={sendInvite} noValidate className="rounded-xl bg-home-bg p-4">
        <h3 className="text-sm font-semibold text-home-ink">Invite a teammate</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_10rem]">
          <Field label="Name" value={invite.name} onChange={(event) => setInvite((prev) => ({ ...prev, name: event.target.value }))} error={errors.name} />
          <Field
            label="Work email"
            type="email"
            value={invite.email}
            onChange={(event) => setInvite((prev) => ({ ...prev, email: event.target.value }))}
            error={errors.email}
          />
          <SelectInput label="Role" value={invite.role} onChange={(role) => setInvite((prev) => ({ ...prev, role }))} options={TEAM_ROLES} />
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-home-blue px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
        >
          <UserPlus size={16} aria-hidden="true" /> Send invite
        </button>
      </form>

      {toRemove && (
        <Modal
          title={`Remove ${toRemove.name}?`}
          subtitle={toRemove.email}
          onClose={() => setRemoveId(null)}
          size="sm"
          footer={
            <DialogButtons onCancel={() => setRemoveId(null)} confirmLabel="Remove" confirmIcon={Trash2} tone="danger" onConfirm={confirmRemove} />
          }
        >
          <p className="text-sm leading-relaxed text-body">
            They will lose access to your jobs, candidates and interviews. You can invite them again later.
          </p>
        </Modal>
      )}
    </div>
  )
}
