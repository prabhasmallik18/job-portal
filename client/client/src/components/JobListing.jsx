import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {

    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [roleStats, setRoleStats] = useState({ total: 0, byRole: [] })

    // Function to handle Category selection
    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category])
    }

    // Function to handle Location selection
    const handleLocationChange = (location) => {
        setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location])
    }

    useEffect(() => {
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1) // Reset to page 1 on filter change
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    useEffect(() => {
        if (jobs && Array.isArray(jobs)) {
            const totalJobs = jobs.length
            const counts = jobs.reduce((acc, job) => {
                const role = job.title || 'Unspecified Role'
                acc[role] = (acc[role] || 0) + 1
                return acc
            }, {})

            const byRole = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([role, count]) => ({ role, count }))

            setRoleStats({ total: totalJobs, byRole })
        } else {
            setRoleStats({ total: 0, byRole: [] })
        }
    }, [jobs])

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            
            {/* Sidebar / Filters Section */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                <div className='mb-6 p-4 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-100 to-cyan-100 border border-indigo-200'>
                    <h3 className='text-xl font-bold text-indigo-800 mb-2'>Job Counts by Role</h3>
                    <p className='text-sm text-indigo-600 mb-3'>Total jobs and each role లో ప్రస్తుత openings.</p>
                    <div className='flex items-center justify-between mb-1'>
                        <span className='text-sm font-medium'>Total Jobs</span>
                        <span className='text-lg font-bold text-blue-700'>{roleStats.total}</span>
                    </div>
                    <div className='space-y-1 max-h-48 overflow-y-auto pb-1'>
                        {roleStats.byRole.slice(0, 8).map((item, index) => (
                            <div key={`${item.role}-${index}`} className='flex items-center justify-between text-sm text-gray-800'>
                                <span className='truncate'>{item.role}</span>
                                <span className='text-blue-600 font-semibold'>{item.count}</span>
                            </div>
                        ))}
                        {roleStats.byRole.length === 0 && <p className='text-gray-500 text-sm'>No jobs available yet.</p>}
                    </div>
                </div>

                {/* Current Search Filters (Crosspills) */}
                {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                    <>
                        <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                        <div className='mb-4 text-gray-600'>
                            {searchFilter.title && (
                                <span className='inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded'>
                                    {searchFilter.title}
                                    <img onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className='ml-2 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded'>
                                    {searchFilter.location}
                                    <img onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                </span>
                            )}
                        </div>
                    </>
                )}

                <button onClick={() => setShowFilter(!showFilter)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                    {showFilter ? "Close" : "Filters"}
                </button>

                {/* Category Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobCategories.map((category, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' type="checkbox" 
                                onChange={() => handleCategoryChange(category)}
                                checked={selectedCategories.includes(category)} />
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Location Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-10'>Search by Location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobLocations.map((location, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' type="checkbox" 
                                onChange={() => handleLocationChange(location)}
                                checked={selectedLocations.includes(location)} />
                                {location}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Job Listings Section */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {/* Optional Chaining prevents 'slice' crash */}
                    {filteredJobs?.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>

                {/* Pagination Logic */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {[...Array(Math.ceil(filteredJobs.length / 6))].map((_, index) => (
                            <a key={index} href="#job-list">
                                <button onClick={() => setCurrentPage(index + 1)} 
                                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}>
                                    {index + 1}
                                </button>
                            </a>
                        ))}
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing