import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageJobs = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [jobs, setJobs] = useState([
    {
      _id: 'temp1',
      title: 'Senior Full Stack Developer',
      date: new Date('2024-03-20'),
      location: 'Bangalore',
      skills: ['React', 'Node.js', 'MongoDB'],
      applicants: 12
    },
    {
      _id: 'temp2',
      title: 'Junior Data Scientist',
      date: new Date('2024-03-18'),
      location: 'Washington',
      skills: ['Python', 'Machine Learning', 'SQL'],
      applicants: 8
    },
    {
      _id: 'temp3',
      title: 'Graphic Designer',
      date: new Date('2024-03-19'),
      location: 'Hyderabad',
      skills: ['Figma', 'UI/UX', 'Adobe Creative'],
      applicants: 5
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCompanyJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!companyToken) {
        console.log('⚠️ No company token found, showing temporary jobs')
        setLoading(false)
        return
      }

      console.log('🔍 ManageJobs - Fetching real jobs with token:', companyToken.substring(0, 20) + '...')
      console.log('🔗 Backend URL:', backendUrl)
      
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', { 
        headers: { token: companyToken } 
      })
      
      console.log('✅ API Response received:', data)
      
      if (data.success && data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs)
        setError(null)
        console.log('✔️ Real jobs loaded from API. Count:', data.jobs.length)
      } else {
        console.log('⚠️ API returned empty jobs, keeping temporary jobs')
        setError('No jobs found. Take action to add new jobs.')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch jobs'
      console.error('❌ Error fetching real jobs:', errorMsg)
      setError('Failed to load jobs: ' + errorMsg)
      toast.error('⚠️ Could not load jobs, showing temporary data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📋 ManageJobs - companyToken:', companyToken ? 'Present' : 'Missing')
    fetchCompanyJobs()
  }, [companyToken])

  return (
    <div className='p-4'>
      <div className='bg-white border rounded shadow-sm overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-gray-50 border-b'>
            <tr>
              <th className='p-3 text-left'>#</th>
              <th className='p-3 text-left'>Job Title</th>
              <th className='p-3 text-left'>Date</th>
              <th className='p-3 text-left'>Location</th>
              <th className='p-3 text-left'>Required Skills</th>
              <th className='p-3 text-center'>Applicants</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.length > 0 ? [...jobs].reverse().map((job, index) => (
              <tr key={job._id || index} className='border-b hover:bg-gray-50'>
                <td className='p-3'>{index + 1}</td>
                <td className='p-3 font-semibold'>{job.title}</td>
                <td className='p-3 text-gray-500'>{new Date(job.date).toLocaleDateString()}</td>
                <td className='p-3'>{job.location}</td>
                <td className='p-3'>
                  {job.skills && job.skills.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {job.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'>
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 2 && (
                        <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded'>
                          +{job.skills.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className='text-gray-400 text-sm'>Not specified</span>
                  )}
                </td>
                <td className='p-3 text-center'>{job.applicants || 0}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <div className='text-gray-400'>
                    {error || 'No jobs found. Click "Add new job" to post!'}
                  </div>
                  {error && (
                    <div className='mt-2 text-sm text-red-500'>
                      Debug info: {error}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageJobs