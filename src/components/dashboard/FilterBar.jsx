import SearchInput from './SearchInput.jsx'
import SelectField from '../jobs/SelectField.jsx'

// Compact search box plus a responsive row of selects. `selects` is [{ label, value, onChange, options }].
export default function FilterBar({ searchLabel, searchPlaceholder, query, onQueryChange, selects }) {
  return (
    <div className="space-y-3 rounded-2xl border border-home-border bg-white p-3 sm:p-4">
      <SearchInput label={searchLabel} placeholder={searchPlaceholder} value={query} onChange={onQueryChange} />
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-5">
        {selects.map((select) => (
          <SelectField
            key={select.label}
            label={select.label}
            value={select.value}
            onChange={select.onChange}
            options={select.options}
            selectClassName="h-10 border-home-border pl-3 text-sm text-home-ink"
          />
        ))}
      </div>
    </div>
  )
}
