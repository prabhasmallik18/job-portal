import React, { useContext, useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import JobApplication from './pages/JobApplication'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import UploadResume from './pages/UploadResume'
import AiAssistant from './components/AiAssistant'
import ApplicationTracker from './components/ApplicationTracker'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import InterviewPrep from './components/InterviewPrep'
import SalaryNegotiator from './components/SalaryNegotiator'
import Gamification from './components/Gamification'
import Splash from './components/Splash'
import ErrorBoundary from './components/ErrorBoundary'
import { AppContext } from './context/AppContext'
import { UserAuthContext } from './context/UserAuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const { showRecruiterLogin } = useContext(AppContext)
  const { user } = useContext(UserAuthContext)

  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <Splash />
  }

  return (
    <ErrorBoundary>
      <div>
        {showRecruiterLogin && <RecruiterLogin />}

        <ToastContainer />

        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/job-application/:jobId' element={<JobApplication />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/upload-resume/:jobId' element={<UploadResume />} />

        {/* Advanced Features Routes */}
        <Route path='/application-tracker' element={<ApplicationTracker userId={user?._id} />} />
        <Route path='/resume-analyzer' element={<ResumeAnalyzer userId={user?._id} />} />
        <Route path='/interview-prep' element={<InterviewPrep userId={user?._id} />} />
        <Route path='/salary-negotiator' element={<SalaryNegotiator userId={user?._id} />} />
        <Route path='/gamification' element={<Gamification userId={user?._id} />} />

        {/* Recruiter Dashboard */}
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />} />
          <Route path='manage-jobs' element={<ManageJobs />} />
          <Route path='view-applications' element={<ViewApplications />} />
        </Route>
      </Routes>

      <AiAssistant />
    </div>
    </ErrorBoundary>
  )
}

export default App