import { Link } from 'react-router-dom'
import { Brain, Check } from 'lucide-react'

const benefits = [
  'AI resume analysis with ATS score',
  'Smart job matching with match reasons',
  'Automated technical assessments',
]

export default function BrandingPanel() {
  return (
    <aside className="bg-[linear-gradient(155deg,#214ac7_0%,#1d419d_50%,#18336d_100%)] px-5 py-8 text-white md:min-h-screen md:w-[49.3%] md:shrink-0 md:px-7 md:pt-12">
      <Link
        to="/"
        aria-label="TalentAtharva home"
        className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-white/15">
          <Brain size={24} aria-hidden="true" />
        </span>
        <span className="text-[1.375rem] font-bold tracking-tight">TalentAtharva</span>
      </Link>

      <div className="mt-8 md:mt-[14vh]">
        <h1 className="text-2xl leading-tight font-bold md:text-[1.75rem] lg:text-[2rem]">
          Land your dream job with AI on your side.
        </h1>
        <p className="mt-4 max-w-[41rem] text-base leading-[1.7] text-blue-100/90 md:mt-6 md:text-lg lg:text-xl">
          Get your resume scored, discover AI-matched jobs, and showcase your skills through automated assessments.
        </p>

        <ul className="mt-12 hidden space-y-3.5 md:block">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-lg text-blue-50 lg:text-xl">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-emerald-900">
                <Check size={14} strokeWidth={3} aria-hidden="true" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
