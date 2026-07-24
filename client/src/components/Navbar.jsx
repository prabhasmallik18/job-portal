import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { UserAuthContext } from '../context/UserAuthContext'
import UserLogin from './UserLogin'

const Navbar = () => {
  const [toolkitOpen, setToolkitOpen] = useState(false)
  const toolkitRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolkitRef.current && !toolkitRef.current.contains(event.target)) {
        setToolkitOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const { openSignIn } = useClerk()
  const { user: clerkUser } = useUser()
  const navigate = useNavigate()
  const [showUserLogin, setShowUserLogin] = useState(false)

  const { setShowRecruiterLogin, companyToken, setCompanyToken, setCompanyData } = useContext(AppContext)
  const { user, userToken, logout: userLogout } = useContext(UserAuthContext)
  const location = useLocation()

  const logoutRecruiter = () => {
    localStorage.removeItem("companyToken")
    setCompanyToken(null)
    setCompanyData(null)
    navigate("/")
  }

  const handleUserLogout = () => {
    userLogout()
    navigate("/")
  }

  return (
    <>
      <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>

          <img onClick={() => navigate('/')} className='cursor-pointer' src={assets.logo} alt="" />

{/* 👇 CLERK USER (Google Login) - View Only */}
        {clerkUser && !user ? (
          <div className='flex items-center gap-3'>
            <p className='text-xs text-gray-600'>Viewing mode only</p>
            <p>|</p>
            <p className='max-sm:hidden'>
              Hi, {clerkUser.firstName}
              </p>
              <UserButton />
            </div>
          )
          
          /* 👇 TRADITIONAL USER (Email/Password) */
          : user && userToken ? (
            <div className='flex items-center gap-3'>
              {location.pathname !== '/' && (
                <Link to={'/'} className='bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition'>Home</Link>
              )}
              <Link to={'/applications'} className='text-slate-700 font-medium hover:text-blue-700 transition'>Applied Jobs</Link>
              <div className='relative' ref={toolkitRef}>
                <button
                  type='button'
                  onClick={() => setToolkitOpen((prev) => !prev)}
                  className='bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 flex items-center gap-2'
                >
                  Advanced Toolkit
                  <span className='text-sm'>{toolkitOpen ? '▲' : '▼'}</span>
                </button>

                <div className={`absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-xl py-2 min-w-[220px] z-50 border border-slate-200 transition-opacity duration-200 ${toolkitOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <Link to={'/application-tracker'} className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-700'>📊 Application Tracker</Link>
                  <Link to={'/resume-analyzer'} className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-700'>📄 Resume Analyzer</Link>
                  <Link to={'/interview-prep'} className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-700'>🎤 Interview Prep</Link>
                  <Link to={'/salary-negotiator'} className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-700'>💰 Salary Negotiator</Link>
                  <Link to={'/gamification'} className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-700'>🎮 Gamification</Link>
                </div>
              </div>
              <p className='text-slate-300'>|</p>
              <p className='max-sm:hidden'>
                Hi, {user.name}
              </p>
              <button 
                onClick={handleUserLogout}
                className='text-red-500 text-sm'
              >
                Logout
              </button>
            </div>
          )

          /* 👇 RECRUITER */
          : companyToken ? (
            <div className='flex items-center gap-4'>
              <button onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button onClick={logoutRecruiter} className='text-red-500'>
                Logout
              </button>
            </div>
          )

          /* 👇 NOT LOGGED IN */
          : (
            <div className='flex gap-3 max-sm:gap-2 max-sm:text-xs'>
              <button 
                onClick={() => setShowRecruiterLogin(true)} 
                className='px-4 sm:px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition duration-300'
              >
                Recruiter Login
              </button>

              <button 
                onClick={() => setShowUserLogin(true)} 
                className='bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300'
              >
                User Login
              </button>
            </div>
          )}

        </div>
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={showUserLogin} onClose={() => setShowUserLogin(false)} />
    </>
  )
}

export default Navbar
