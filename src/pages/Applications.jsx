import { useCallback, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { RotateCcw, SearchX } from 'lucide-react'
import ApplicationToolbar from '../components/applications/ApplicationToolbar.jsx'
import ApplicationsAIBanner from '../components/applications/ApplicationsAIBanner.jsx'
import ApplicationCard from '../components/applications/ApplicationCard.jsx'
import ApplicationFiltersPanel from '../components/applications/ApplicationFiltersPanel.jsx'
import ApplicationStatusModal from '../components/applications/ApplicationStatusModal.jsx'
import ApplicationChatPanel from '../components/applications/ApplicationChatPanel.jsx'
import DeleteApplicationDialog from '../components/applications/DeleteApplicationDialog.jsx'
import SubmittedApplications from '../components/applications/SubmittedApplications.jsx'
import { useApplications } from '../hooks/useApplications.js'

const primaryButtonClasses =
  'mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export default function Applications() {
  const { notify } = useOutletContext()
  const apps = useApplications()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [statusId, setStatusId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const findById = (id) => apps.applications.find((app) => app.id === id) ?? null
  const chatApplication = findById(chatId)
  const statusApplication = findById(statusId)
  const applicationToDelete = findById(deleteId)
  const resultCount = apps.results.length

  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const closeChat = useCallback(() => setChatId(null), [])
  const closeStatus = useCallback(() => setStatusId(null), [])
  const cancelDelete = useCallback(() => setDeleteId(null), [])

  const handleOpenChat = (id) => {
    apps.markChatRead(id)
    setChatId(id)
  }

  const handleDelete = () => {
    apps.deleteApplication(applicationToDelete.id)
    notify(`Removed your application for ${applicationToDelete.jobTitle} at ${applicationToDelete.company}.`, 'info')
    setDeleteId(null)
  }

  const handleResetDemo = () => {
    apps.resetDemoData()
    apps.clearCriteria()
    notify('Demo applications restored.', 'info')
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Applications</h1>
      <p className="mt-1.5 text-[15px] text-muted">Track your submitted applications and take the next step.</p>

      <SubmittedApplications />

      <div className="mt-6 space-y-6">
        <ApplicationToolbar
          query={apps.query}
          onQueryChange={apps.setQuery}
          type={apps.type}
          onTypeChange={apps.setType}
          activeFilterCount={apps.activeFilterCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <ApplicationsAIBanner
          topMatch={apps.topMatch}
          aiSort={apps.aiSort}
          onToggleAiSort={() => apps.setAiSort((on) => !on)}
          onOpenStatus={setStatusId}
        />

        <section aria-labelledby="applications-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 id="applications-heading" aria-live="polite" className="text-[15px] font-normal text-muted">
                {resultCount === apps.applications.length
                  ? `${resultCount} ${resultCount === 1 ? 'application' : 'applications'}`
                  : `Showing ${resultCount} of ${apps.applications.length} applications`}
              </h2>
              {apps.hasAnyCriteria && (
                <button
                  type="button"
                  onClick={apps.clearCriteria}
                  className="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Clear filters
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 rounded text-sm text-muted hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset demo data
            </button>
          </div>

          {resultCount === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pale text-primary">
                <SearchX size={24} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy">No applications found</h3>
              {apps.applications.length === 0 ? (
                <>
                  <p className="mt-1 max-w-sm text-sm text-muted">You have removed every application from this demo.</p>
                  <button type="button" onClick={handleResetDemo} className={primaryButtonClasses}>
                    <RotateCcw size={15} aria-hidden="true" />
                    Restore demo applications
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-1 max-w-sm text-sm text-muted">Try changing your search or filters.</p>
                  {apps.hasAnyCriteria && (
                    <button type="button" onClick={apps.clearCriteria} className={primaryButtonClasses}>
                      Clear filters
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <ul className="space-y-4">
              {apps.results.map((application) => (
                <li key={application.id}>
                  <ApplicationCard
                    application={application}
                    onOpenChat={() => handleOpenChat(application.id)}
                    onOpenStatus={() => setStatusId(application.id)}
                    onDelete={() => setDeleteId(application.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {filtersOpen && <ApplicationFiltersPanel filters={apps.filters} onApply={apps.setFilters} onClose={closeFilters} />}

      {chatApplication && (
        <ApplicationChatPanel
          key={chatApplication.id}
          application={chatApplication}
          onSend={(text) => apps.sendMessage(chatApplication.id, text)}
          onClose={closeChat}
        />
      )}

      {statusApplication && (
        <ApplicationStatusModal application={statusApplication} onClose={closeStatus} />
      )}

      {applicationToDelete && (
        <DeleteApplicationDialog application={applicationToDelete} onConfirm={handleDelete} onCancel={cancelDelete} />
      )}
    </div>
  )
}
