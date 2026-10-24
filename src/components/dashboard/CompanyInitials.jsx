export default function CompanyInitials({ initials }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-home-tint text-base font-bold text-home-blue sm:h-14 sm:w-14 sm:text-lg"
    >
      {initials}
    </span>
  )
}
