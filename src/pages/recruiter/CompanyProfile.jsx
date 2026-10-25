import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { BadgeCheck, Building2, Gift, Link2, MapPin, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import SectionCard from '../../components/recruiterForms/SectionCard.jsx'
import SaveBar from '../../components/recruiterForms/SaveBar.jsx'
import TagInput from '../../components/recruiterForms/TagInput.jsx'
import ChipGroup from '../../components/recruiterForms/ChipGroup.jsx'
import SelectInput from '../../components/recruiterForms/SelectInput.jsx'
import Field from '../../components/recruiter/Field.jsx'
import LogoUploader from '../../components/companyProfile/LogoUploader.jsx'
import CompanyPreviewCard from '../../components/companyProfile/CompanyPreviewCard.jsx'
import {
  BENEFITS,
  COMPANY_SIZES,
  COMPANY_TYPES,
  INDUSTRIES,
  WORK_MODES,
  createDefaultCompanyProfile,
} from '../../data/companyProfile.js'
import { useStoredState } from '../../hooks/useStoredState.js'
import { profileCompleteness, validateCompanyProfile } from '../../utils/recruiterFormUtils.js'

const STORAGE_KEY = 'talentforge.recruiter.companyProfile'
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
// Older or partial saved data is filled in from the defaults.
const withDefaults = () => createDefaultCompanyProfile()

const trimProfile = (profile) =>
  Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))

// Recruiter Company Profile at /recruiter/company-profile. Saved in this browser only (demo).
export default function CompanyProfile() {
  const { notify } = useOutletContext()
  const [saved, setSaved] = useStoredState(STORAGE_KEY, withDefaults, isObject)
  const savedProfile = { ...createDefaultCompanyProfile(), ...saved }
  const [draft, setDraft] = useState(savedProfile)
  const [errors, setErrors] = useState({})

  const isDirty = JSON.stringify(draft) !== JSON.stringify(savedProfile)
  const { percent, missing } = profileCompleteness(draft)
  const industryOptions = INDUSTRIES.includes(draft.industry) ? INDUSTRIES : [draft.industry, ...INDUSTRIES]

  const set = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }
  const input = (field) => ({ value: draft[field], onChange: (event) => set(field)(event.target.value), error: errors[field] })

  const save = () => {
    const nextErrors = validateCompanyProfile(draft)
    setErrors(nextErrors)
    const count = Object.keys(nextErrors).length
    if (count > 0) {
      notify(`Fix ${count} ${count === 1 ? 'field' : 'fields'} before saving.`)
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    const clean = trimProfile({ ...draft, gstin: draft.gstin.toUpperCase(), cin: draft.cin.toUpperCase() })
    setSaved(clean)
    setDraft(clean)
    notify('Company profile saved. Candidates will see the updated details (demo).', 'success')
  }

  const discard = () => {
    setDraft(savedProfile)
    setErrors({})
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-[32px]">Company Profile</h1>
        <p className="mt-2 text-[15px] text-secondary sm:text-lg">
          Tell candidates who you are, what you build and why they should join your team.
        </p>
      </header>

      <section
        aria-label="Profile summary"
        className="mt-6 flex flex-col gap-5 rounded-2xl bg-linear-to-b from-home-gradient-from to-primary p-5 text-white shadow-[0_8px_24px_rgba(36,99,245,0.18)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-xl font-bold text-home-blue">
            {savedProfile.logo ? (
              <img src={savedProfile.logo} alt="" className="h-full w-full object-contain" />
            ) : (
              savedProfile.name.slice(0, 2).toUpperCase()
            )}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-xl font-bold sm:text-2xl">
              {savedProfile.name}
              {savedProfile.gstin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-deep">
                  <BadgeCheck size={14} aria-hidden="true" /> GSTIN on file
                </span>
              )}
            </p>
            <p className="mt-0.5 text-white/85">{savedProfile.tagline || 'Add a tagline to introduce your company.'}</p>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <p className="flex justify-between text-sm text-white/85">
            <span>Profile completeness</span>
            <span className="font-semibold text-white">{percent}%</span>
          </p>
          <div
            role="progressbar"
            aria-label="Profile completeness"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 overflow-hidden rounded-full bg-white/25"
          >
            <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/80">
            {missing.length === 0 ? 'Your profile is complete.' : `Add: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`}
          </p>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-6">
          <SectionCard icon={Building2} title="Basic information" description="The essentials candidates see first.">
            <LogoUploader logo={draft.logo} companyName={draft.name} onChange={set('logo')} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Company name" {...input('name')} maxLength={80} />
              <Field label="Tagline" optional {...input('tagline')} maxLength={100} placeholder="One line about what you do" />
              <SelectInput label="Industry" value={draft.industry} onChange={set('industry')} options={industryOptions} />
              <SelectInput label="Company size" value={draft.size} onChange={set('size')} options={COMPANY_SIZES} />
              <SelectInput label="Company type" value={draft.type} onChange={set('type')} options={COMPANY_TYPES} />
              <Field label="Founded" optional type="number" inputMode="numeric" placeholder="e.g. 2016" {...input('founded')} />
            </div>
          </SectionCard>

          <SectionCard icon={Sparkles} title="About the company" description="Your story, mission and values.">
            <div className="space-y-4">
              <div>
                <Field label="Overview" multiline rows={5} maxLength={1500} {...input('overview')} placeholder="What does your company do, and for whom?" />
                <p className="mt-1 text-right text-xs text-home-muted">{draft.overview.length}/1500</p>
              </div>
              <Field label="Mission" optional multiline maxLength={300} {...input('mission')} />
              <TagInput label="Company values" values={draft.values} onChange={set('values')} placeholder="e.g. Ownership" max={8} />
            </div>
          </SectionCard>

          <SectionCard icon={MapPin} title="Contact & locations" description="How candidates can reach your hiring team.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="HR / careers email" type="email" {...input('hrEmail')} />
              <Field label="Phone" optional type="tel" {...input('phone')} />
              <Field label="Headquarters" placeholder="City, Country" {...input('headquarters')} />
              <Field label="Office address" optional multiline className="sm:col-span-2" {...input('address')} />
              <div className="sm:col-span-2">
                <TagInput label="Other office locations" values={draft.offices} onChange={set('offices')} placeholder="e.g. Pune, India" max={10} />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Link2} title="Online presence" description="Your official website, shown on your job posts.">
            <Field label="Official website" type="url" placeholder="https://" className="sm:max-w-md" {...input('website')} />
          </SectionCard>

          <SectionCard icon={Gift} title="Benefits & work culture" description="Perks and ways of working you offer.">
            <div className="space-y-5">
              <ChipGroup label="Benefits & perks" options={BENEFITS} value={draft.benefits} onChange={set('benefits')} />
              <ChipGroup label="Work modes offered" options={WORK_MODES} value={draft.workModes} onChange={set('workModes')} error={errors.workModes} />
            </div>
          </SectionCard>

          <SectionCard icon={Workflow} title="Hiring information" description="Helps candidates prepare before they apply.">
            <div className="space-y-4">
              <TagInput label="Tech stack" values={draft.techStack} onChange={set('techStack')} placeholder="e.g. React" />
              <TagInput label="Hiring departments" values={draft.departments} onChange={set('departments')} placeholder="e.g. Engineering" max={10} />
              <Field label="Interview process" optional multiline maxLength={500} {...input('interviewProcess')} placeholder="e.g. Application review → Assessment → Interview → Offer" />
            </div>
          </SectionCard>

          <SectionCard icon={ShieldCheck} title="Verification" description="Optional registration details. Format-checked only; nothing is verified with any authority.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="GSTIN" optional placeholder="29ABCDE1234F1Z5" maxLength={15} {...input('gstin')} />
              <Field label="CIN" optional placeholder="U72200KA2016PTC123456" maxLength={21} {...input('cin')} />
            </div>
          </SectionCard>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <CompanyPreviewCard profile={savedProfile} />
          <p className="rounded-xl bg-white px-4 py-3 text-xs text-home-muted ring-1 ring-home-border">
            Demo data: this profile is saved in your browser only and is not shared with any real candidate.
          </p>
        </aside>
      </div>

      {isDirty && <SaveBar onDiscard={discard} onSave={save} />}
    </div>
  )
}
