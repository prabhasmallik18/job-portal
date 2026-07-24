import React, { useContext, useState } from 'react'
import { UserAuthContext } from '../context/UserAuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'

const UploadResume = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)

  const { user, userToken, uploadResume, backendUrl } = useContext(UserAuthContext)

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict file type validation
    const allowed = ['pdf', 'doc', 'docx', 'rtf'];
    const disallowed = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf'];

    // Must have an extension and it must not be a known image extension
    if (!extension || disallowed.includes(extension)) {
      toast.error('❌ No images (JPEG, PNG, GIF, etc.) are allowed; upload PDF, DOC, DOCX, or RTF.');
      setResume(null);
      e.target.value = '';
      return;
    }

    if (!allowed.includes(extension)) {
      toast.error('❌ Only PDF, DOC, DOCX, or RTF files are allowed.');
      setResume(null);
      e.target.value = '';
      return;
    }

    // Explicit image MIME block and allowed PDF/DOC MIME acceptance
    if (file.type.startsWith('image/')) {
      toast.error('❌ Image file types are not permitted. Upload a PDF, DOC, or DOCX file.');
      setResume(null);
      e.target.value = '';
      return;
    }

    if (file.type && !mimeTypes.includes(file.type) && !file.type.startsWith('application')) {
      toast.error('❌ Unsupported MIME type. Upload PDF, DOC, or DOCX only.');
      setResume(null);
      e.target.value = '';
      return;
    }

    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error('⚠️ File too large. Max 10MB.');
      setResume(null);
      e.target.value = '';
      return;
    }

    setResume(file);
  }

  const handleUploadAndApply = async (e) => {
    e.preventDefault()

    if (!resume) {
      toast.error('Please select a resume file')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', resume)

      const result = await uploadResume(formData)

      if (result.success) {
        toast.success('Resume uploaded successfully')
        
        // Now apply for the job if jobId present
        if (jobId) {
          try {
            const response = await fetch(`${backendUrl}/api/users/apply`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ jobId })
            })

            const data = await response.json()

            if (data.success) {
              toast.success('Applied successfully!')
              navigate('/applications')
            } else {
              toast.error(data.message)
            }
          } catch (err) {
            console.error('Error:', err)
            toast.error('Failed to apply for job')
          }
        } else {
          toast.success('Resume updated successfully')
          navigate(-1)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className='container px-4 2xl:px-20 mx-auto py-20 text-center'>
          <h1 className='text-2xl font-semibold mb-4'>Please login first</h1>
          <button 
            onClick={() => navigate('/')} 
            className='bg-blue-600 text-white px-8 py-2 rounded'
          >
            Go Home
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='container px-4 2xl:px-20 mx-auto py-10'>
        <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow'>
          <h1 className='text-3xl font-semibold mb-2'>Upload Your Resume</h1>
          <p className='text-gray-600 mb-8'>
            {jobId ? 'Upload your resume to apply for this job' : 'Update your resume'}
          </p>

          <form noValidate onSubmit={handleUploadAndApply} className='space-y-6'>
            {/* File Input */}
            <div className='border-2 border-dashed border-blue-300 rounded-lg p-8'>
              <label htmlFor='resume-upload' className='cursor-pointer'>
                <div className='text-center'>
                  <svg 
                    className='mx-auto h-12 w-12 text-gray-400 mb-3' 
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
                  <p className='text-sm text-gray-600'>
                    Click to upload or drag and drop
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
                  type='file'
                  hidden
                  onChange={handleResumeChange}
                  accept='.pdf,.doc,.docx,.rtf'
                />
              </label>
            </div>

            {/* Buttons */}
            <div className='flex gap-4'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? 'Uploading...' : (jobId ? 'Upload & Apply' : 'Upload Resume')}
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400'
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Help text */}
          <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
            <h3 className='font-semibold text-blue-900 mb-2'>Resume Tips:</h3>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>• Keep your resume up-to-date and relevant</li>
              <li>• Use a clear, professional format</li>
              <li>• Include your contact information</li>
              <li>• Highlight your skills and experience</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadResume
