import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { AppContext } from '../context/AppContext'
import { UserAuthContext } from '../context/UserAuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const JobApplication = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [jobData, setJobData] = useState(null)
  const { jobs, backendUrl } = useContext(AppContext)
  const { user: traditionalUser, userToken } = useContext(UserAuthContext)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    panNumber: '',
    experience: '',
    currentRole: '',
    coverLetter: ''
  })
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [submissionDetails, setSubmissionDetails] = useState(null)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasExistingResume, setHasExistingResume] = useState(false)
  const acceptedResumeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf'
  ]

  useEffect(() => {
    if (!traditionalUser || !userToken) {
      toast.error('Please login to apply for jobs')
      navigate('/')
      return
    }

    // Pre-fill user data
    if (traditionalUser) {
      setFormData(prev => ({
        ...prev,
        fullName: traditionalUser.name || '',
        email: traditionalUser.email || ''
      }))
      setHasExistingResume(!!traditionalUser.resume)
    }

    // Get job data
    if (jobs.length > 0) {
      const job = jobs.find(j => j._id === jobId)
      if (job) {
        setJobData(job)
      }
    }
  }, [jobId, jobs, traditionalUser, userToken, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResumeChange = (e) => {
    setResume(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const normalizedPan = formData.panNumber.toUpperCase().trim()
    const normalizedPhone = formData.phone.replace(/\D/g, '')

    if (!formData.fullName || !formData.email || !normalizedPhone || !normalizedPan) {
      toast.error('Please fill in all required fields, including PAN Card Number')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(normalizedPhone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    // PAN validation (10 alphanumeric characters)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(normalizedPan)) {
      toast.error('Please enter a valid PAN number (format: AAAAA0000A)')
      return
    }

    if (!resume && !hasExistingResume) {
      toast.error('Please upload your resume')
      return
    }

    if (resume) {
      const normalizedResumeName = resume.name.toLowerCase()
      const isAcceptedResume = acceptedResumeTypes.includes(resume.type) ||
        ['.pdf', '.doc', '.docx', '.rtf'].some(ext => normalizedResumeName.endsWith(ext))

      if (!isAcceptedResume) {
        toast.error('Please upload a resume in PDF, DOC, DOCX, or RTF format')
        return
      }
    }

    setFormData(prev => ({ ...prev, panNumber: normalizedPan, phone: normalizedPhone }))
    setLoading(true)

    try {
      // Step 1: Upload Resume (only if new resume selected)
      if (resume) {
        const resumeFormData = new FormData()
        resumeFormData.append('resume', resume)

        const resumeResponse = await axios.post(
          backendUrl + '/api/users/upload-resume',
          resumeFormData,
          {
            headers: {
              'Authorization': `Bearer ${userToken}`
            }
          }
        )

        if (!resumeResponse.data.success) {
          toast.error('Failed to upload resume')
          setLoading(false)
          return
        }
      }

      // Step 2: Apply for Job
      const applyResponse = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        }
      )

      if (applyResponse.data.success) {
        toast.success('✅ Application submitted successfully!')
        setApplicationSubmitted(true)
        setSubmissionDetails({
          applicationId: applyResponse.data.applicationId || 'APP-' + Date.now(),
          submittedAt: new Date().toLocaleString(),
          nextSteps: [
            '📧 Check your email for application confirmation',
            '📧 Email will include: Application ID, Job details, Company contact info, Next steps timeline',
            '⏰ Application review typically takes 2-3 business days',
            '📞 You may receive a call for initial screening from HR/recruiter',
            '📋 Keep your resume and documents ready for next steps',
            '🔄 Track your application status in the Applications dashboard'
          ],
          contactInfo: 'For any queries, contact: support@jobportal.com',
          emailDetails: 'Your email confirmation will contain: Application reference number, Job position details, Expected response timeline, and contact information for follow-up.'
        })

        // Navigate quickly so the user immediately sees the applied jobs screen
        setTimeout(() => {
          navigate('/applications')
        }, 1200)
      } else {
        toast.error(applyResponse.data.message || 'Failed to apply')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error submitting application')
    } finally {
      setLoading(false)
    }
  }

  if (!jobData) {
    return (
      <>
        <Navbar />
        <div className='container px-4 2xl:px-20 mx-auto py-20 text-center'>
          <p className='text-gray-500'>Loading job details...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='container px-4 2xl:px-20 mx-auto py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {/* Left Side - Job Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6 sticky top-10'>
              <div className='flex items-center gap-3 mb-4'>
                <img className='h-12 bg-white p-2 rounded border' src={jobData.companyId?.image} alt="" />
                <div>
                  <h3 className='font-bold text-gray-900'>{jobData.companyId?.name}</h3>
                  <p className='text-sm text-gray-600'>{jobData.location}</p>
                </div>
              </div>

              <div className='border-t border-blue-200 pt-4'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>{jobData.title}</h2>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-600'>💰 Salary:</span>
                    <p className='font-semibold text-green-600'>₹{jobData.salary?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>📊 Level:</span>
                    <p className='font-semibold'>{jobData.level}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>🏷️ Category:</span>
                    <p className='font-semibold'>{jobData.category}</p>
                  </div>
                </div>

                {jobData.skills && jobData.skills.length > 0 && (
                  <div className='mt-4 border-t border-blue-200 pt-4'>
                    <p className='text-sm font-semibold text-gray-700 mb-2'>Required Skills:</p>
                    <div className='flex flex-wrap gap-2'>
                      {jobData.skills.map((skill, idx) => (
                        <span key={idx} className='bg-blue-600 text-white text-xs px-2 py-1 rounded-full'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h1 className='text-3xl font-bold mb-2 text-gray-900'>Apply for this Job</h1>
              <p className='text-gray-600 mb-8'>Fill in your details to apply</p>

              <form noValidate onSubmit={handleSubmit} className='space-y-6'>
                
                {/* Personal Details Section */}
                <div className='border-b-2 border-gray-200 pb-6'>
                  <h2 className='text-xl font-bold mb-4 text-gray-900'>📋 Personal Details</h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Full Name */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                        placeholder='Enter your full name'
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Email *
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition bg-gray-50'
                        disabled
                        placeholder='your@email.com'
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                        placeholder='Enter your phone number'
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        City
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                        placeholder='Enter your city'
                      />
                    </div>

                    {/* PAN Card */}
                    <div>
                      <label className='block text-sm font-semibold text-indigo-700 mb-2'>
                        PAN Card Number *
                      </label>
                      <input
                        type='text'
                        name='panNumber'
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none transition bg-gradient-to-r from-white via-white to-white'
                        placeholder='ABCDE1234F'
                      />
                      <p className='text-xs text-indigo-600 mt-1'>
                        Enter your PAN for faster verification and mandatory application support.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div className='border-b-2 border-gray-200 pb-6'>
                  <h2 className='text-xl font-bold mb-4 text-gray-900'>💼 Experience</h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Years of Experience */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Years of Experience
                      </label>
                      <select
                        name='experience'
                        value={formData.experience}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                      >
                        <option value=''>Select experience level</option>
                        <option value='0-1'>Fresher (0-1 years)</option>
                        <option value='1-3'>1-3 years</option>
                        <option value='3-5'>3-5 years</option>
                        <option value='5-7'>5-7 years</option>
                        <option value='7+'>7+ years</option>
                      </select>
                    </div>

                    {/* Current Role */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Current Role
                      </label>
                      <input
                        type='text'
                        name='currentRole'
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                        placeholder='e.g., Software Developer'
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter Section */}
                <div className='border-b-2 border-gray-200 pb-6'>
                  <h2 className='text-xl font-bold mb-4 text-gray-900'>📝 Additional Information</h2>

                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Cover Letter
                  </label>
                  <textarea
                    name='coverLetter'
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows='5'
                    className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition'
                    placeholder='Tell us why you are a good fit for this role...'
                  />
                </div>

                {/* Resume Upload Section */}
                <div className='bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8'>
                  <h2 className='text-xl font-bold mb-4 text-gray-900'>📄 Resume Upload</h2>
                  
                  {hasExistingResume && !resume && (
                    <div className='bg-green-100 border border-green-300 rounded-lg p-4 mb-4'>
                      <p className='text-sm text-green-700 font-semibold'>
                        ✓ You have an existing resume on file. You can upload a new one if needed.
                      </p>
                    </div>
                  )}
                  
                  <label htmlFor='resume-upload' className='cursor-pointer block'>
                    <div className='text-center'>
                      <svg 
                        className='mx-auto h-12 w-12 text-blue-500 mb-3' 
                        stroke='currentColor' 
                        fill='none' 
                        viewBox='0 0 48 48'
                      >
                        <path 
                          d='M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-12l-6-6m0 0l-6 6m6-6v24' 
                          strokeWidth='2' 
                          strokeLinecap='round' 
                          strokeLinejoin='round' 
                        />
                      </svg>
                      <p className='text-sm font-semibold text-gray-700'>
                        {hasExistingResume ? 'Upload a new resume (optional)' : 'Click to upload or drag and drop'}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        PDF, DOC, DOCX, RTF (Max 10MB)
                      </p>
                      {resume && (
                        <p className='text-sm text-green-600 mt-3 font-semibold'>
                          ✓ {resume.name}
                        </p>
                      )}
                    </div>
                    <input
                      id='resume-upload'
                      name='resume'
                      type='file'
                      hidden
                      onChange={handleResumeChange}
                      accept='.pdf,.doc,.docx,.rtf'
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <div className='flex gap-4 pt-4'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? '⏳ Submitting Application...' : '✅ Submit Application'}
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate(-1)}
                    className='flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition'
                  >
                    Cancel
                  </button>
                </div>

                <p className='text-xs text-gray-500 text-center mt-4'>
                  By submitting, you agree to the terms and conditions
                </p>
              </form>

              {/* Success Message */}
              {applicationSubmitted && submissionDetails && (
                <div className='mt-8'>
                  {/* Main Success Banner */}
                  <div className='bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-8 shadow-lg'>
                    <div className='flex items-start gap-4 mb-6'>
                      <div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg'>
                        <span className='text-4xl'>📬</span>
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-green-800'>Application Submitted Successfully</h3>
                        <p className='text-green-700 font-semibold'>Application ID: {submissionDetails.applicationId}</p>
                        <p className='text-sm text-green-600'>Submitted on: {submissionDetails.submittedAt}</p>
                        <p className='text-sm text-slate-600 mt-2'>A confirmation email has been sent to your registered inbox with application details and next steps.</p>
                      </div>
                    </div>

                    {/* Email Details Section */}
                    {submissionDetails.emailDetails && (
                      <div className='mt-6 bg-white border-l-4 border-blue-500 rounded-lg p-5 mb-6 shadow-sm'>
                        <div className='flex items-start gap-3'>
                          <span className='text-2xl mt-1'>📧</span>
                          <div className='flex-1'>
                            <h5 className='font-bold text-blue-900 mb-3 text-lg'>Email Confirmation - What You'll Receive</h5>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='bg-blue-50 p-4 rounded-lg'>
                                <p className='text-sm font-semibold text-blue-800 mb-2'>📌 Application Details</p>
                                <ul className='text-sm text-blue-700 space-y-1'>
                                  <li>✓ Application reference number</li>
                                  <li>✓ Confirmation timestamp</li>
                                  <li>✓ Job position information</li>
                                </ul>
                              </div>
                              <div className='bg-indigo-50 p-4 rounded-lg'>
                                <p className='text-sm font-semibold text-indigo-800 mb-2'>🏢 Company Details</p>
                                <ul className='text-sm text-indigo-700 space-y-1'>
                                  <li>✓ Company name & logo</li>
                                  <li>✓ HR contact information</li>
                                  <li>✓ Department contact details</li>
                                </ul>
                              </div>
                              <div className='bg-purple-50 p-4 rounded-lg'>
                                <p className='text-sm font-semibold text-purple-800 mb-2'>⏰ Timeline</p>
                                <ul className='text-sm text-purple-700 space-y-1'>
                                  <li>✓ Review timeline (2-3 business days)</li>
                                  <li>✓ Next steps notification schedule</li>
                                  <li>✓ Interview if shortlisted</li>
                                </ul>
                              </div>
                              <div className='bg-pink-50 p-4 rounded-lg'>
                                <p className='text-sm font-semibold text-pink-800 mb-2'>📎 Additional Info</p>
                                <ul className='text-sm text-pink-700 space-y-1'>
                                  <li>✓ Your submitted resume copy</li>
                                  <li>✓ Application tracking link</li>
                                  <li>✓ FAQ & support resources</li>
                                </ul>
                              </div>
                            </div>
                            <p className='text-xs text-gray-600 mt-3 italic'>💡 Check spam folder if you don't see the email within 5 minutes</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Next Steps Section */}
                    <div className='bg-white rounded-lg p-6 mb-6 shadow-sm'>
                      <h4 className='font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg'>
                        <span className='bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center'>👉</span>
                        What Happens Next?
                      </h4>
                      <div className='space-y-3'>
                        {submissionDetails.nextSteps.map((step, index) => (
                          <div key={index} className='flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0'>
                            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0'>
                              {index + 1}
                            </div>
                            <p className='text-gray-700 pt-1'>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Support Info */}
                    <div className='bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3'>
                      <span className='text-2xl'>🤝</span>
                      <div>
                        <p className='font-semibold text-amber-900 mb-1'>Need Help?</p>
                        <p className='text-sm text-amber-800'>{submissionDetails.contactInfo}</p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600 mb-4'>You'll be redirected to your applications dashboard shortly...</p>
                    <div className='flex justify-center gap-3'>
                      <button
                        onClick={() => navigate('/applications')}
                        className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition'
                      >
                        View Applications Now
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className='bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition'
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobApplication
