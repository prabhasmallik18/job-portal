import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AdvancedFeaturesShowcase from '../components/AdvancedFeaturesShowcase'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <JobListing />
      <AdvancedFeaturesShowcase />
      <AppDownload />
      <Footer />
    </div>
  )
}

export default Home