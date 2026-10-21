export default function AuthHeading({ title, subtitle }) {
  return (
    <div className="mt-6">
      <h2 className="text-[1.625rem] font-bold tracking-tight text-heading md:text-[1.8rem]">{title}</h2>
      <p className="mt-1 text-base text-secondary">{subtitle}</p>
    </div>
  )
}
