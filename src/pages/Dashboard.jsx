import { useCallback, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ClipboardList, Send, Sparkles, User } from 'lucide-react'
import NextStepBanner from '../components/dashboard/NextStepBanner.jsx'
import SummaryCard from '../components/dashboard/SummaryCard.jsx'
import SummaryDialog from '../components/dashboard/SummaryDialog.jsx'
import ApplicationsSection from '../components/dashboard/ApplicationsSection.jsx'
import RecommendationsSection from '../components/dashboard/RecommendationsSection.jsx'
import ChatDialog from '../components/dashboard/ChatDialog.jsx'
import ConfirmDeleteDialog from '../components/dashboard/ConfirmDeleteDialog.jsx'
import ResumeAnalysisDialog from '../components/dashboard/ResumeAnalysisDialog.jsx'
import { DEMO_PROFILE } from '../data/dashboard.js'
import { useAuth } from '../hooks/useAuth.js'
import { useHomeDashboard } from '../hooks/useHomeDashboard.js'
import RecruiterDashboard from './recruiter/RecruiterDashboard.jsx'

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// Student home. Every interaction (dialogs, filters, expand, apply) stays on this page;
// all data is fictional and saved in this browser only.
function StudentHome({ email }) {
  const { notify } = useOutletContext()
  const home = useHomeDashboard(email)
  const [dialog, setDialog] = useState(null) // { type: 'resume' | 'summary' | 'chat' | 'delete', id }

  const closeDialog = useCallback(() => setDialog(null), [])
  const activeApplication =
    dialog?.type === 'chat' || dialog?.type === 'delete' ? home.applications.find((app) => app.id === dialog.id) : null

  const changeStatus = (application, status) => {
    home.updateStatus(application.id, status)
    notify(`${application.title} at ${application.company} is now "${status}".`, 'success')
  }

  const confirmDelete = () => {
    home.remove(activeApplication.id)
    setDialog(null)
    notify(`Deleted your application for ${activeApplication.title} at ${activeApplication.company}.`)
  }

  const apply = (job) => {
    if (home.apply(job)) notify(`Applied to ${job.title} at ${job.company}. It now appears in Your applications.`, 'success')
    else notify(`You have already applied to ${job.title} at ${job.company}.`)
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-8 sm:space-y-10">
      <header className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-home-blue/30 bg-white text-home-blue">
          <Sparkles size={28} fill="currentColor" strokeWidth={1.25} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-home-ink sm:text-[32px]">
            Welcome back, {DEMO_PROFILE.name} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-[15px] text-home-muted sm:text-lg">Here&apos;s your career progress at a glance.</p>
        </div>
      </header>

      <NextStepBanner onAnalyze={() => setDialog({ type: 'resume' })} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <SummaryCard
          icon={Send}
          label="Applications"
          value={home.stats.applications}
          detail={plural(home.stats.newMessages, 'new message')}
          onOpen={() => setDialog({ type: 'summary', id: 'applications' })}
        />
        <SummaryCard
          icon={ClipboardList}
          label="Assessment"
          value={home.stats.assessments}
          detail={`${home.stats.needAttention} need${home.stats.needAttention === 1 ? 's' : ''} attention`}
          onOpen={() => setDialog({ type: 'summary', id: 'assessments' })}
        />
        <SummaryCard
          icon={User}
          label="Profile Completion"
          value={`${home.stats.profileCompletion}%`}
          progress={home.stats.profileCompletion}
          onOpen={() => setDialog({ type: 'summary', id: 'profile' })}
        />
      </div>

      <ApplicationsSection
        applications={home.applications}
        unreadByApplication={home.unreadByApplication}
        onChat={(id) => setDialog({ type: 'chat', id })}
        onDelete={(id) => setDialog({ type: 'delete', id })}
        onStatusChange={changeStatus}
      />

      <RecommendationsSection applications={home.applications} onApply={apply} />

      {dialog?.type === 'resume' && <ResumeAnalysisDialog onClose={closeDialog} notify={notify} />}
      {dialog?.type === 'summary' && (
        <SummaryDialog
          type={dialog.id}
          stats={home.stats}
          applications={home.applications}
          unreadByApplication={home.unreadByApplication}
          onOpenChat={(id) => setDialog({ type: 'chat', id })}
          onClose={closeDialog}
        />
      )}
      {dialog?.type === 'chat' && activeApplication && (
        <ChatDialog
          application={activeApplication}
          messages={home.conversations[activeApplication.id] ?? []}
          onSend={home.sendMessage}
          onMarkRead={home.markRead}
          onClose={closeDialog}
        />
      )}
      {dialog?.type === 'delete' && activeApplication && (
        <ConfirmDeleteDialog application={activeApplication} onConfirm={confirmDelete} onCancel={closeDialog} />
      )}
    </div>
  )
}

// Rendered inside AppLayout, which provides the navbar (with sign out) and sidebar.
export default function Dashboard() {
  const { user } = useAuth()
  return user.role === 'recruiter' ? <RecruiterDashboard user={user} /> : <StudentHome email={user.email} />
}
