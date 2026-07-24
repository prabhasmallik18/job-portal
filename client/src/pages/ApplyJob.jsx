import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { UserAuthContext } from '../context/UserAuthContext'
import { useUser, useAuth } from '@clerk/clerk-react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import { assets } from '../assets/assets'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [JobData, setJobData] = useState(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState([])
  const { jobs, backendUrl } = useContext(AppContext)
  const { user: clerkUser } = useUser()
  const { user: traditionalUser, userToken } = useContext(UserAuthContext)

  const applyHandler = async () => {
    // 🔹 Check if user is logged in (only allows traditional auth)
    if (!traditionalUser && !clerkUser) {
      return toast.error('Please login to apply for jobs')
    }

    // 🔹 Clerk users need to use traditional auth for job applications
    if (clerkUser && !traditionalUser) {
      return toast.error('Please register with email/password to apply for jobs. Google login is for viewing only.')
    }

    // 🔹 Use traditional auth token only
    if (!userToken) {
      return toast.error('Please login again')
    }

    // 🔹 Redirect to application form
    navigate(`/job-application/${id}`)
  }

  useEffect(() => {
    if (jobs.length > 0) {
      const data = jobs.filter(job => job._id === id)
      if (data.length > 0) {
        setJobData(data[0])
      }
    }

    const checkApplied = async () => {
      if (!userToken) return

      try {
        const { data } = await axios.get(backendUrl + '/api/users/applications', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })

        if (data.success && Array.isArray(data.applications)) {
          const appliedJobIds = data.applications.map(app => {
            const appliedJobId = app.jobId?._id || app.jobId
            return appliedJobId
          })
          setAppliedJobs(appliedJobIds)
          const hasApplication = appliedJobIds.includes(id)
          setAlreadyApplied(hasApplication)
        }
      } catch (err) {
        console.error('Error checking existing application', err)
      }
    }

    checkApplied()
  }, [id, jobs, userToken, backendUrl])

  return JobData ? (
    <>
      <Navbar />
      <div className='container px-4 2xl:px-20 mx-auto py-10'>
        <div className='flex flex-col lg:flex-row justify-between items-start gap-10'>
          <div className='w-full lg:w-3/4'>
            {/* Header Section */}
            <div className='bg-sky-50 border border-sky-400 rounded-xl p-8 mb-8 flex justify-between items-center flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <img className='h-20 bg-white p-3 rounded-lg border' src={JobData.companyId.image} alt="" />
                <div>
                  <h1 className='text-2xl font-semibold'>{JobData.title}</h1>
                  <div className='flex gap-4 text-gray-600 text-sm mt-1'>
                    <span className='flex items-center gap-1'>
                      <img src={assets.suitcases_icon} alt="" /> {JobData.companyId.name}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.location_icon} alt="" /> {JobData.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <button
                  onClick={applyHandler}
                  className={`px-10 py-2.5 rounded font-semibold ${alreadyApplied ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  disabled={alreadyApplied}
                >
                  {alreadyApplied ? 'Already Applied' : 'Apply Now'}
                </button>
                <p className='text-gray-500 text-sm'>Posted {moment(JobData.date).fromNow()}</p>
                {alreadyApplied && (
                  <p className='text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded'>
                    You already applied for this job. Check status in your applications.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
              <div className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4'>
                <p className='text-gray-600 text-sm font-semibold'>💰 Salary</p>
                <p className='text-2xl font-bold text-green-600 mt-1'>₹{JobData.salary?.toLocaleString()}</p>
                <p className='text-xs text-gray-500 mt-1'>Per Year</p>
              </div>

              <div className='bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4'>
                <p className='text-gray-600 text-sm font-semibold'>📊 Experience Level</p>
                <p className='text-xl font-bold text-purple-600 mt-1'>{JobData.level}</p>
              </div>

              <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4'>
                <p className='text-gray-600 text-sm font-semibold'>📍 Location</p>
                <p className='text-xl font-bold text-blue-600 mt-1'>{JobData.location}</p>
              </div>

              <div className='bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4'>
                <p className='text-gray-600 text-sm font-semibold'>🏷️ Category</p>
                <p className='text-xl font-bold text-orange-600 mt-1'>{JobData.category}</p>
              </div>
            </div>

            {/* About the Role */}
            <div className='bg-white border border-gray-200 rounded-lg p-6 mb-8'>
              <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-500'>📋 About This Role</h2>
              <div className='rich-text text-gray-700 leading-relaxed' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
            </div>

            {/* Required Skills */}
            {JobData.skills && JobData.skills.length > 0 && (
              <div className='bg-blue-50 border border-blue-300 rounded-lg p-6 mb-8'>
                <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-500'>🛠️ Required Skills</h3>
                <div className='flex flex-wrap gap-3'>
                  {JobData.skills.map((skill, index) => (
                    <span key={index} className='bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition'>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            <div className='bg-white border border-gray-200 rounded-lg p-6 mb-8'>
              <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-500'>✅ Key Responsibilities</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 font-bold text-lg'>→</span>
                  <span className='text-gray-700'>Design and implement solutions aligned with business goals</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 font-bold text-lg'>→</span>
                  <span className='text-gray-700'>Lead cross-functional teams and mentor junior developers</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 font-bold text-lg'>→</span>
                  <span className='text-gray-700'>Conduct code reviews and ensure best practices are followed</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 font-bold text-lg'>→</span>
                  <span className='text-gray-700'>Participate in architectural discussions and technical planning</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 font-bold text-lg'>→</span>
                  <span className='text-gray-700'>Collaborate with stakeholders to understand requirements</span>
                </li>
              </ul>
            </div>

            {/* Minimum Requirements */}
            <div className='bg-orange-50 border border-orange-300 rounded-lg p-6 mb-8'>
              <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-orange-500'>⚡ Minimum Requirements</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <span className='text-orange-600 font-bold text-lg'>•</span>
                  <span className='text-gray-700'>5+ years of professional experience in the field</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-orange-600 font-bold text-lg'>•</span>
                  <span className='text-gray-700'>Strong expertise in all required skills mentioned above</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-orange-600 font-bold text-lg'>•</span>
                  <span className='text-gray-700'>Bachelor's degree in Computer Science or related field</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-orange-600 font-bold text-lg'>•</span>
                  <span className='text-gray-700'>Proven track record of successful projects</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-orange-600 font-bold text-lg'>•</span>
                  <span className='text-gray-700'>Excellent communication and leadership skills</span>
                </li>
              </ul>
            </div>

            {/* Why Join Us */}
            <div className='bg-purple-50 border border-purple-300 rounded-lg p-6 mb-8'>
              <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-purple-500'>🎁 Why Join {JobData.companyId.name}?</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>🏆</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Industry Leading Company</p>
                    <p className='text-sm text-gray-600 mt-1'>Work with cutting-edge technology and innovation</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>💰</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Competitive Compensation</p>
                    <p className='text-sm text-gray-600 mt-1'>Attractive salary and performance bonuses</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>🎓</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Career Growth</p>
                    <p className='text-sm text-gray-600 mt-1'>Continuous learning and skill development programs</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>🤝</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Great Team Culture</p>
                    <p className='text-sm text-gray-600 mt-1'>Collaborate with talented and supportive team members</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>🏥</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Benefits Package</p>
                    <p className='text-sm text-gray-600 mt-1'>Health insurance, retirement plans, and more</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>⏰</span>
                  <div>
                    <p className='font-semibold text-gray-900'>Work-Life Balance</p>
                    <p className='text-sm text-gray-600 mt-1'>Flexible working hours and remote options</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Process */}
            <div className='bg-green-50 border border-green-300 rounded-lg p-6 mb-8'>
              <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-green-500'>🎯 Application Process</h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-4'>
                  <div className='flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm'>1</div>
                  <div>
                    <p className='font-semibold text-gray-900'>Submit Your Application</p>
                    <p className='text-sm text-gray-600'>Click "Apply Now" and upload your resume</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm'>2</div>
                  <div>
                    <p className='font-semibold text-gray-900'>Initial Screening</p>
                    <p className='text-sm text-gray-600'>HR team reviews your application (2-3 days)</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm'>3</div>
                  <div>
                    <p className='font-semibold text-gray-900'>Technical Interview</p>
                    <p className='text-sm text-gray-600'>In-depth technical discussion with team lead</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm'>4</div>
                  <div>
                    <p className='font-semibold text-gray-900'>Final Round</p>
                    <p className='text-sm text-gray-600'>Meet with senior management and HR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About the Company */}
            <div className='bg-indigo-50 border border-indigo-300 rounded-lg p-6 mb-8'>
              <h3 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-indigo-500'>🏢 About {JobData.companyId.name}</h3>
              <p className='text-gray-700 leading-relaxed mb-4'>
                {JobData.companyId.name} is a leading organization in the {JobData.category} space, committed to delivering innovative solutions and exceptional value to clients worldwide. We pride ourselves on building a talented team of professionals who are passionate about their work.
              </p>
              <div className='grid grid-cols-3 gap-4 mt-6'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-indigo-600'>500+</p>
                  <p className='text-sm text-gray-600 mt-1'>Employees</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-indigo-600'>15+</p>
                  <p className='text-sm text-gray-600 mt-1'>Years</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-indigo-600'>Global</p>
                  <p className='text-sm text-gray-600 mt-1'>Presence</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center mb-8'>
              <h3 className='text-2xl font-bold mb-3'>Ready to Join Our Team?</h3>
              <p className='mb-6 text-blue-100'>Take the next step in your career now!</p>
              <button onClick={applyHandler} className='bg-white text-blue-600 px-12 py-3 rounded-lg font-bold hover:bg-blue-50 transition'>
                Apply Now
              </button>
            </div>
          </div>

          <div className='w-full lg:w-1/4'>
            <h2 className='text-xl font-semibold mb-4'>More jobs from {JobData?.companyId?.name || 'Other Companies'}</h2>
            <div className='flex flex-col gap-4'>
              {jobs?.filter(job => job?._id !== id && job?.companyId?._id === JobData?.companyId?._id)?.slice(0, 3)?.map((job, index) => (
                <JobCard key={index} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : <Loading />
}

export default ApplyJob
