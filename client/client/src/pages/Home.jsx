import React from 'react'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='min-h-screen'>
      {/* Navbar is handled in App.jsx, so it's removed from here */}
      <Hero />
      <JobListing />
      <AppDownload />
      <Footer />
    </div>
  )
}

export default Home