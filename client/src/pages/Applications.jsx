import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import { AppContext } from '../context/AppContext'
import { UserAuthContext } from '../context/UserAuthContext'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Applications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { backendUrl } = useContext(AppContext)
  const { user: clerkUser } = useUser()
  const { getToken } = useAuth()
  const { user: traditionalUser, userToken } = useContext(UserAuthContext)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let token = null;
      let userId = null;

      // Check for traditional auth first
      if (traditionalUser && userToken) {
        token = userToken;
        userId = traditionalUser._id;
      }
      // Check for Clerk auth
      else if (clerkUser) {
        token = await getToken();
        userId = clerkUser.id;
      }

      if (!token || !userId) {
        console.log('⚠️ No auth found, showing temporary applications')
        setLoading(false)
        return
      }

      console.log('🔍 Fetching real applications...')

      const { data } = await axios.get(
        backendUrl + '/api/users/applications',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications)
        if (data.applications.length > 0) {
          console.log('✔️ Real applications loaded. Count:', data.applications.length)
          console.log('Application statuses:', data.applications.map(app => app.status))
        } else {
          console.log('⚠️ No real applications found for this user yet')
          setError('No applications found yet.')
        }
      } else {
        console.log('⚠️ Applications API returned no data or failed')
        setApplications([])
        setError(data.message || 'No applications found yet.')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch applications'
      console.error('❌ Error fetching applications:', errorMsg)
      setError('Failed to load applications: ' + errorMsg)
      toast.error('⚠️ Could not load applications, showing temporary data')
    } finally {
      setLoading(false)
    }
  }, [traditionalUser, userToken, clerkUser, backendUrl, getToken])

  useEffect(() => {
    if ((traditionalUser && userToken) || clerkUser) {
      fetchApplications()
    }
  }, [traditionalUser, userToken, clerkUser, fetchApplications])

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Applied Jobs</h2>
        
        <table className='min-w-full bg-white border rounded-lg mt-4'>
            <thead>
              <tr className='border-b text-left text-gray-700'>
                <th className='py-2 px-4'>Company</th>
                <th className='py-2 px-4'>Job Title</th>
                <th className='py-2 px-4'>Location</th>
                <th className='py-2 px-4'>Date</th>
                <th className='py-2 px-4'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications && applications.length > 0 ? (
                applications
                  .filter(job => job.companyId?.name && job.jobId?.title && job.jobId?.location && job.date && job.status)
                  .map((job, index) => (
                  <tr key={index} className='border-b'>
                    <td className='py-3 px-4 flex items-center gap-2'>
                      <div className='w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden'>
                        <img 
                          className='w-8 h-8 rounded object-cover' 
                          src={job.companyId?.image && job.companyId.image !== 'placeholder' ? job.companyId.image : assets.company_icon} 
                          alt={job.companyId?.name || 'Company'} 
                          onError={(e) => { e.target.onerror = null; e.target.src = assets.company_icon; }}
                        />
                      </div>
                      <span className='font-medium'>{job.companyId?.name}</span>
                    </td>
                    <td className='py-2 px-4'>{job.jobId?.title}</td>
                    <td className='py-2 px-4'>{job.jobId?.location}</td>
                    <td className='py-2 px-4'>{moment(job.date).format('ll')}</td>
                    <td className='py-2 px-4'>
                      <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='text-center py-10 text-gray-500'>No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </>
  )
}

export default Applications
