export default function SkillTags({ skills }) {
  return (
    <ul aria-label="Skills" className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm text-home-ink">
          {skill}
        </li>
      ))}
    </ul>
  )
}
