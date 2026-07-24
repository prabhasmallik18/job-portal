import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto py-10 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <img width={160} src={assets.logo} alt="" />
        <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
          Copyright @Annapurna.dev | All right reserved.
        </p>
      </div>
      <div className='flex gap-2.5'>
          <img width={32} src={assets.facebook_icon} alt="" />
          <img width={32} src={assets.twitter_icon} alt="" />
          <img width={32} src={assets.instagram_icon} alt="" />
      </div>
    </div>
  )
}

export default Footer