import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import JobDiscovery from './pages/JobDiscovery.jsx'
import JobDetails from './pages/JobDetails.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import ResumeAnalysis from './pages/ResumeAnalysis.jsx'
import Applications from './pages/Applications.jsx'
import ApplicationDetail from './pages/ApplicationDetail.jsx'
import Assessments from './pages/Assessments.jsx'
import AssessmentPage from './pages/AssessmentPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobDiscovery />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="resume" element={<ResumeAnalysis />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:applicationId" element={<ApplicationDetail />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:assessmentId" element={<AssessmentPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
