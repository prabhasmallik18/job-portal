import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job, isApplied = false }) => {
  const navigate = useNavigate()

  // Function to determine color scheme and icon based on job title/category
  const getJobStyle = () => {
    // Pleasant cool color palette - consistent across all jobs
    return {
      borderColor: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-600',
      bgColor: 'from-cyan-400 to-blue-500',
      borderGradient: 'from-cyan-500 to-blue-400',
      hoverColor: 'hover:text-cyan-600',
      icon: null
    }
  }

  const style = getJobStyle()
  const customLogo = style.icon

  return (
    <div className='group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
      {/* Gradient Top Border */}
      <div className={`h-1 bg-gradient-to-r ${style.borderGradient}`}></div>

      <div className='p-4'>
        {/* Header Section with Logo and Company Info */}
        <div className='flex items-center gap-3 mb-3 pb-3 border-b border-gray-100'>
          {/* Company/Job Logo */}
          <div className='relative'>
            <div className={`w-10 h-10 bg-gradient-to-br ${style.bgColor} rounded-lg flex items-center justify-center border-2 border-opacity-30 shadow-md group-hover:scale-105 transition duration-300`}>
              <img 
                className='h-7 w-7 object-contain' 
                src={customLogo || job?.companyId?.image || assets.default_company_logo} 
                alt="Logo" 
                onError={(e) => {e.target.src = assets.default_company_logo}}
              />
            </div>
          </div>

          {/* Company Info */}
          <div className='flex-1'>
            <p className={`text-xs font-semibold ${style.textColor} uppercase tracking-wide`}>🎯 Job</p>
            <p className='font-bold text-gray-900 text-xs line-clamp-1'>{job?.companyId?.name || 'Company'}</p>
          </div>
        </div>

        {/* Job Title */}
        <h3 className={`font-bold text-base text-gray-900 mb-2 line-clamp-2 ${style.hoverColor} transition`}>{job.title}</h3>

        {/* Job Details with Icons */}
        <div className='space-y-2 mb-3 text-xs'>
          {/* Location */}
          <div className='flex items-center gap-2'>
            <img src={assets.location_icon} alt="Location" className='w-3.5 h-3.5 text-gray-500' />
            <span className='text-gray-700 font-medium'>{job.location}</span>
          </div>

          {/* Level */}
          <div className='flex items-center gap-2'>
            <img src={assets.suitcase_icon} alt="Level" className='w-3.5 h-3.5 text-gray-500' />
            <span className='text-gray-700 font-medium'>{job.level}</span>
          </div>

          {/* Salary */}
          <div className='flex items-center gap-2'>
            <img src={assets.money_icon} alt="Salary" className='w-3.5 h-3.5 text-gray-500' />
            <span className='font-bold text-green-600'>₹{job.salary?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className='mb-3 pb-3 border-b border-gray-100'>
            <p className='text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>Skills</p>
            <div className='flex flex-wrap gap-1.5'>
              {job.skills.slice(0, 2).map((skill, index) => (
                <span key={index} className='bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded text-xs font-medium'>
                  {skill}
                </span>
              ))}
              {job.skills.length > 2 && (
                <span className='bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium'>
                  +{job.skills.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Badge Pills */}
        <div className='flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-gray-100'>
          <span className={`bg-gradient-to-r ${style.bgColor} bg-opacity-10 text-opacity-100 px-2.5 py-1 rounded-full text-xs font-semibold border border-opacity-20`} style={{color: style.textColor.replace('text-', '')}}>📍 {job.location}</span>
          {isApplied ? (
            <span className={`bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold`}>✅ Already Applied</span>
          ) : (
            <span className={`bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold`}>✨ Hot</span>
          )}
        </div>

        {/* Job Description */}
        <p className='text-gray-600 text-xs mb-4 line-clamp-1 leading-relaxed' dangerouslySetInnerHTML={{ __html: job.description.slice(0, 80) }}></p>

        {/* Action Buttons */}
        <div className='grid grid-cols-2 gap-2'>
          <button 
            onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} 
            className={`${isApplied ? 'bg-indigo-500 hover:bg-indigo-600' : `bg-gradient-to-r ${style.bgColor}`} text-white px-3 py-1.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 text-xs`}
            disabled={isApplied}
          >
            {isApplied ? 'Already Applied' : 'Apply'}
          </button>
          <button 
            onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} 
            className={`${style.textColor} border-2 px-3 py-1.5 rounded-lg font-semibold hover:bg-opacity-5 transition duration-300 text-xs`}
            style={{borderColor: style.textColor.replace('text-', '')}}
          >
            Details
          </button>
        </div>
      </div>

      {/* Hover Effect Badge */}
      <div className='absolute top-3 right-3 bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-300'>
        NEW
      </div>
    </div>
  )
}

export default JobCard