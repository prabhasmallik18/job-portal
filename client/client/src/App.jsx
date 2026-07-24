import React, { useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom' // useLocation add chesam
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import Navbar from './components/Navbar' 
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext)
  
  // Ikkada current page path ni check chesthunnam
  const location = useLocation();

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      
      {/* Condition: Dashboard page lo lenappude Navbar chupinchu */}
      {!location.pathname.startsWith('/dashboard') && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />} />
          <Route path='manage-jobs' element={<ManageJobs />} />
          <Route path='view-applications' element={<ViewApplications />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App