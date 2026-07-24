import React, { useState } from 'react'
// Line remove chesa: import Navbar from '../components/Navbar' (App.jsx lo undi kabatti avasaram ledu)
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'

const Applications = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  return (
    <>
      {/* FIX: Ikkada unna <Navbar /> ni teesesa. Ippudu okkasare kanipisthundi */}
      
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isEdit
              ? <>
                <label className='flex items-center' htmlFor="resumeUpload">
                  <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button onClick={e => setIsEdit(false)} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
              </>
              : <div className='flex gap-2'>
                <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href="">
                  Resume
                </a>
                <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                  Edit
                </button>
              </div>
          }
        </div>

        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
        <table className='min-w-full bg-white border rounded-lg'>
          <thead>
            <tr className='border-b'>
              <th className='py-4 px-4 text-left'>Company</th>
              <th className='py-4 px-4 text-left'>Job Title</th>
              <th className='py-4 px-4 text-left'>Location</th>
              <th className='py-4 px-4 text-left'>Date</th>
              <th className='py-4 px-4 text-left'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {jobsApplied.map((job, index) => (
              <tr key={index} className='border-b'>
                <td className='py-3 px-4 flex items-center gap-2'>
                  <img className='h-8 w-8' src={job.logo} alt="" />
                  {job.company}
                </td>
                <td className='py-2 px-4'>{job.title}</td>
                <td className='py-2 px-4'>{job.location}</td>
                <td className='py-2 px-4'>{moment(job.date).format('ll')}</td>
                <td className='py-2 px-4'>
                  <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  )
}

export default Applications