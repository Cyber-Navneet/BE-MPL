import { useId, useState } from 'react'
import { ImageUp, Trash2 } from 'lucide-react'
import { LOGO_TYPES, MAX_LOGO_BYTES } from '../../data/companyProfile.js'
import { initialsOf } from '../../utils/recruiterFormUtils.js'

// Logo picker. The image is read in the browser as a data URL; it is never uploaded anywhere.
export default function LogoUploader({ logo, companyName, onChange }) {
  const id = useId()
  const [error, setError] = useState('')

  const handleFile = (file) => {
    if (!LOGO_TYPES.includes(file.type)) return setError('Upload a PNG, JPG, WebP or SVG image.')
    if (file.size > MAX_LOGO_BYTES) return setError('The logo must be 1 MB or smaller.')
    setError('')
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.onerror = () => setError('Could not read this image. Try another file.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-home-border bg-home-tint text-2xl font-bold text-home-blue">
        {logo ? <img src={logo} alt={`${companyName || 'Company'} logo`} className="h-full w-full object-contain" /> : initialsOf(companyName || '?')}
      </span>
      <div>
        <div className="flex flex-wrap gap-2">
          <input
            id={id}
            type="file"
            accept={LOGO_TYPES.join(',')}
            className="peer sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) handleFile(file)
              event.target.value = ''
            }}
          />
          <label
            htmlFor={id}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 peer-focus-visible:outline-2 peer-focus-visible:outline-home-blue"
          >
            <ImageUp size={16} aria-hidden="true" /> {logo ? 'Change logo' : 'Upload logo'}
          </label>
          {logo && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-home-blue"
            >
              <Trash2 size={16} aria-hidden="true" /> Remove
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-home-muted">PNG, JPG, WebP or SVG, up to 1 MB. Square images look best.</p>
        {error && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
