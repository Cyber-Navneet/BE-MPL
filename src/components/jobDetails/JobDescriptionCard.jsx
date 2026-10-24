import { CircleCheck } from 'lucide-react'

function CheckList({ items }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
          <CircleCheck size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function JobDescriptionCard({ job }) {
  return (
    <section
      aria-labelledby="job-description-title"
      className="divide-y divide-line rounded-xl border border-line bg-white px-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:px-6"
    >
      <div className="py-5 sm:py-6">
        <h2 id="job-description-title" className="text-lg font-semibold text-navy">
          Job Description
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-body">{job.description}</p>
      </div>
      <div className="py-5 sm:py-6">
        <h3 className="text-base font-semibold text-navy">What you’ll do</h3>
        <CheckList items={job.responsibilities} />
      </div>
      <div className="py-5 sm:py-6">
        <h3 className="text-base font-semibold text-navy">Requirements</h3>
        <CheckList items={job.requirements} />
      </div>
    </section>
  )
}
