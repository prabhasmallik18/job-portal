import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto my-20'>
      <div className='relative bg-gradient-to-r from-blue-50 to-indigo-50 p-12 sm:p-24 lg:p-32 rounded-lg flex flex-col md:flex-row items-center justify-between overflow-hidden'>
        <div>
          <h1 className='text-2xl sm:text-4xl font-bold mb-8 max-w-md leading-tight'>
            Download Mobile App For Better Experience
          </h1>
          <div className='flex gap-4'>
            <img className='h-12 cursor-pointer' src={assets.play_store} alt="" />
            <img className='h-12 cursor-pointer' src={assets.app_store} alt="" />
          </div>
        </div>
        <img className='w-80 md:w-auto md:max-w-md mt-10 md:mt-0' src={assets.app_main_img} alt="" />
      </div>
    </div>
  )
}

export default AppDownload