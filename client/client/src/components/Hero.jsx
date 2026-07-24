import React, { useRef, useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {
  // Use Context to share the search results with the rest of the app
  const { jobs, setSearchFilter, setIsSearched } = useContext(AppContext)

  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const [titleSuggestions, setTitleSuggestions] = useState([])
  const [locationSuggestions, setLocationSuggestions] = useState([])

  // 1. Handle Title Suggestions (Using global jobs data to ensure images work)
  const handleTitleChange = (e) => {
    const value = e.target.value
    if (!value) return setTitleSuggestions([])

    const filtered = [...new Set(
      jobs
        .map(job => job.title)
        .filter(title => title.toLowerCase().includes(value.toLowerCase()))
    )]
    setTitleSuggestions(filtered)
  }

  // 2. Handle Location Suggestions
  const handleLocationChange = (e) => {
    const value = e.target.value
    if (!value) return setLocationSuggestions([])

    const filtered = [...new Set(
      jobs
        .map(job => job.location)
        .filter(location => location.toLowerCase().includes(value.toLowerCase()))
    )]
    setLocationSuggestions(filtered)
  }

  // 3. Optimized Search Function
  const onSearch = () => {
    const title = titleRef.current.value
    const location = locationRef.current.value

    // Update Global Context so JobListing.jsx updates its display
    setSearchFilter({ title, location })
    setIsSearched(true)

    // Clear suggestions
    setTitleSuggestions([])
    setLocationSuggestions([])
  }

  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      {/* HERO SECTION */}
      <div className='bg-gradient-to-r from-blue-800 to-blue-950 text-white py-16 text-center mx-2 rounded-xl px-5'>
        <h2 className='text-2xl md:text-4xl font-medium mb-4'>Over 10,000+ jobs to apply</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light'>
          Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities!
        </p>

        <div className='flex flex-col sm:flex-row items-center bg-white rounded text-gray-600 max-w-2xl mx-auto px-2 shadow-lg'>
          
          {/* Search Input with Suggestions */}
          <div className='relative flex items-center p-2 w-full'>
            <img className='h-4 mr-2' src={assets.search_icon} alt="" />
            <input
              type='text'
              placeholder='Search for jobs'
              ref={titleRef}
              onChange={handleTitleChange}
              className='p-2 outline-none w-full text-sm'
            />
            {titleSuggestions.length > 0 && (
              <ul className='absolute top-full left-0 bg-white text-black w-full shadow-xl rounded-b-md z-20 border-t'>
                {titleSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className='px-4 py-2 hover:bg-blue-50 cursor-pointer text-left text-sm border-b last:border-none'
                    onClick={() => {
                      titleRef.current.value = item
                      setTitleSuggestions([])
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Location Input with Suggestions */}
          <div className='relative flex items-center p-2 w-full border-t sm:border-t-0 sm:border-l border-gray-200'>
            <img className='h-4 mr-2' src={assets.location_icon} alt="" />
            <input
              type='text'
              placeholder='Location'
              ref={locationRef}
              onChange={handleLocationChange}
              className='p-2 outline-none w-full text-sm'
            />
            {locationSuggestions.length > 0 && (
              <ul className='absolute top-full left-0 bg-white text-black w-full shadow-xl rounded-b-md z-20 border-t'>
                {locationSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className='px-4 py-2 hover:bg-blue-50 cursor-pointer text-left text-sm border-b last:border-none'
                    onClick={() => {
                      locationRef.current.value = item
                      setLocationSuggestions([])
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onSearch}
            className='bg-blue-600 px-8 py-2.5 text-white rounded m-2 w-full sm:w-auto hover:bg-blue-700 transition duration-300'
          >
            Search
          </button>
        </div>
      </div>

      {/* TRUSTED BY SECTION (Images will show here) */}
      <div className='border border-gray-200 shadow-sm mx-2 mt-8 p-6 rounded-lg bg-white'>
        <div className='flex justify-center items-center gap-8 lg:gap-16 flex-wrap opacity-70'>
          <p className='font-semibold text-gray-500'>Trusted by</p>
          <img className='h-5 md:h-7' src={assets.microsoft_logo} alt="Microsoft" />
          <img className='h-5 md:h-7' src={assets.walmart_logo} alt="Walmart" />
          <img className='h-5 md:h-7' src={assets.accenture_logo} alt="Accenture" />
          <img className='h-5 md:h-7' src={assets.samsung_logo} alt="Samsung" />
          <img className='h-5 md:h-7' src={assets.amazon_logo} alt="Amazon" />
          <img className='h-5 md:h-7' src={assets.adobe_logo} alt="Adobe" />
        </div>
      </div>
    </div>
  )
}

export default Hero