import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState([
    {
      _id: 'app1',
      userId: {
        _id: 'user1',
        name: 'Rajesh Kumar',
        image: 'https://via.placeholder.com/40?text=RK',
        resume: 'https://example.com/resume1.pdf'
      },
      jobId: {
        _id: 'job1',
        title: 'Senior Full Stack Developer',
        location: 'Bangalore',
        companyId: {
          name: 'TechCorp India'
        }
      },
      status: 'Under Review',
      date: new Date('2024-03-25')
    },
    {
      _id: 'app2',
      userId: {
        _id: 'user2',
        name: 'Priya Sharma',
        image: 'https://via.placeholder.com/40?text=PS',
        resume: 'https://example.com/resume2.pdf'
      },
      jobId: {
        _id: 'job2',
        title: 'Junior Data Scientist',
        location: 'Washington',
        companyId: {
          name: 'DataViz Solutions'
        }
      },
      status: 'Interview Scheduled',
      date: new Date('2024-03-24')
    },
    {
      _id: 'app3',
      userId: {
        _id: 'user3',
        name: 'Amit Patel',
        image: 'https://via.placeholder.com/40?text=AP',
        resume: 'https://example.com/resume3.pdf'
      },
      jobId: {
        _id: 'job3',
        title: 'Graphic Designer',
        location: 'Hyderabad',
        companyId: {
          name: 'Creative Studios'
        }
      },
      status: 'Rejected',
      date: new Date('2024-03-23')
    },
    {
      _id: 'app4',
      userId: {
        _id: 'user4',
        name: 'Sneha Desai',
        image: 'https://via.placeholder.com/40?text=SD',
        resume: 'https://example.com/resume4.pdf'
      },
      jobId: {
        _id: 'job1',
        title: 'Senior Full Stack Developer',
        location: 'Bangalore',
        companyId: {
          name: 'TechCorp India'
        }
      },
      status: 'Selected',
      date: new Date('2024-03-22')
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCompanyApplicants = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!companyToken) {
        console.log('⚠️ No company token found, showing temporary applications')
        setLoading(false)
        return
      }

      console.log('🔍 Fetching real applications...')
      const { data } = await axios.get(backendUrl + '/api/company/applicants', { 
        headers: { token: companyToken } 
      })
      
      if (data.success && data.applications && data.applications.length > 0) {
        setApplicants(data.applications.reverse())
        console.log('✔️ Real applications loaded. Count:', data.applications.length)
      } else {
        console.log('⚠️ No real applications found, keeping temporary data')
        setError('No applications found yet.')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch applications'
      console.error('❌ Error fetching applications:', errorMsg)
      setError('Failed to load applications: ' + errorMsg)
      toast.error('⚠️ Could not load applications, showing temporary data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyApplicants()
    }
  }, [companyToken])

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', icon: '⏳' },
      'Under Review': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', icon: '👀' },
      'Interview Scheduled': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500', icon: '📅' },
      'Selected': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', icon: '✅' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', icon: '❌' }
    }
    return statusConfig[status] || statusConfig['Pending']
  }

  return (
    <div className='container mx-auto p-4'>
      {applicants && applicants.length > 0 ? (
        <div>
          <table className='w-full max-w-4xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
            <thead>
              <tr className='bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-gray-300 text-left text-gray-700 font-semibold'>
                <th className='py-3 px-4 border-b'>#</th>
                <th className='py-3 px-4 border-b'>👤 User Name</th>
                <th className='py-3 px-4 border-b'>💼 Job Title</th>
                <th className='py-3 px-4 border-b'>📍 Location</th>
                <th className='py-3 px-4 border-b'>📄 Resume</th>
                <th className='py-3 px-4 border-b'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((item, index) => (
                <tr key={index} className='text-gray-700 border-b hover:bg-gray-50 transition'>
                  <td className='py-2 px-4 font-semibold text-center'>{index + 1}</td>
                  <td className='py-2 px-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold text-gray-900'>{item.userId.name}</span>
                      <span className='text-xs text-gray-500'>{item.jobId.companyId?.name || 'Company'}</span>
                    </div>
                  </td>
                  <td className='py-2 px-4'>
                    <div className='flex items-center gap-2'>
                      <img src={assets.suitcase_icon} alt="job" className='w-4 h-4 text-gray-500' />
                      <span className='text-sm'>{item.jobId.title}</span>
                    </div>
                  </td>
                  <td className='py-2 px-4'>
                    <div className='flex items-center gap-2'>
                      <img src={assets.location_icon} alt="location" className='w-4 h-4 text-gray-500' />
                      <span className='text-sm'>{item.jobId.location}</span>
                    </div>
                  </td>
                  <td className='py-2 px-4'>
                    <a href={item.userId.resume} target='_blank' rel="noreferrer" className='text-blue-500 underline hover:text-blue-700 flex items-center gap-2 text-sm'>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M8 16.5a1 1 0 11-2 0 1 1 0 012 0z'></path>
                        <path fillRule='evenodd' d='M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm-7 4a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1zm14 0a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1z' clipRule='evenodd'></path>
                      </svg>
                      Resume
                    </a>
                  </td>
                  <td className='py-2 px-4'>
                    {(() => {
                      const statusConfig = getStatusBadge(item.status || 'Pending')
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-full text-xs font-semibold`}>
                          <span className={`w-2 h-2 ${statusConfig.dot} rounded-full`}></span>
                          {item.status || 'Pending'}
                        </span>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-xl font-medium text-gray-500'>No Applications Found</p>
        </div>
      )}
    </div>
  )
}
export default ViewApplications