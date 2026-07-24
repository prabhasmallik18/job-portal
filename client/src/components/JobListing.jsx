import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { UserAuthContext } from '../context/UserAuthContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import axios from 'axios'

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs, backendUrl } = useContext(AppContext)
    const { userToken } = useContext(UserAuthContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [appliedJobs, setAppliedJobs] = useState([])
    const [roleStats, setRoleStats] = useState({ total: 0, byRole: [] })

    // Fetch applied jobs
    const fetchAppliedJobs = async () => {
        if (!userToken) return
        try {
            const { data } = await axios.get(
                backendUrl + '/api/users/applications',
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            )
            if (data.success && data.applications) {
                const appliedJobIds = data.applications.map(app => {
                    const jobId = app.jobId?._id || app.jobId;
                    return jobId;
                });
                setAppliedJobs(appliedJobIds)
            }
        } catch (error) {
            console.error('Error fetching applied jobs:', error)
        }
    }

    useEffect(() => {
        if (userToken) {
            fetchAppliedJobs()
        }
    }, [userToken, backendUrl])

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

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(prev => 
            prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
        )
    }

    useEffect(() => {
        if (jobs && Array.isArray(jobs) && jobs.length > 0) {
            
            // 1. Ensure all jobs are included (no dedupe by title/companyId)
            const allJobsList = [...jobs]

            // 2. SEARCH & CATEGORY FILTERS
            const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job?.category)
            const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job?.location)
            
            const matchesSearch = job => {
                const searchTitle = searchFilter?.title?.toLowerCase() || ""
                const searchLoc = searchFilter?.location?.toLowerCase() || ""
                const titleMatch = searchTitle === "" || job?.title?.toLowerCase().includes(searchTitle)
                const locationMatch = searchLoc === "" || job?.location?.toLowerCase().includes(searchLoc)
                return titleMatch && locationMatch
            }

            // Reverse for 'Latest Jobs' and apply filters
            const result = allJobsList.reverse().filter(
                job => job && matchesCategory(job) && matchesLocation(job) && matchesSearch(job)
            )
            
            setFilteredJobs(result)
            setCurrentPage(1) 
        } else {
            setFilteredJobs([])
        }
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row py-8'>
            {/* Sidebar Filters */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                <div className='mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-100 via-cyan-100 to-pink-100 border border-purple-200'>
                    <h3 className='text-xl font-bold text-purple-700 mb-2'>Job Summary</h3>
                    <p className='text-sm text-purple-600 mb-3'>Total jobs count and role-wise distribution summary.</p>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium'>Total Openings</span>
                        <span className='text-lg font-bold text-indigo-700'>{roleStats.total}</span>
                    </div>
                    <div className='space-y-1 max-h-48 overflow-y-auto pr-1'>
                        {roleStats.byRole.slice(0, 8).map((item, index) => (
                            <div key={`${item.role}-${index}`} className='flex items-center justify-between text-sm text-gray-700'>
                                <span className='truncate'>{item.role}</span>
                                <span className='text-blue-600 font-semibold'>{item.count}</span>
                            </div>
                        ))}
                        {roleStats.byRole.length === 0 && <p className='text-gray-500 text-sm'>No jobs available yet.</p>}
                    </div>
                </div>

                {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                    <div className='mb-6'>
                        <h3 className='font-medium text-lg mb-2'>Current Search</h3>
                        <div className='flex flex-wrap gap-2'>
                            {searchFilter.title && <span className='bg-blue-100 border border-blue-200 px-3 py-1 rounded text-sm'>{searchFilter.title}</span>}
                            {searchFilter.location && <span className='bg-red-100 border border-red-200 px-3 py-1 rounded text-sm'>{searchFilter.location}</span>}
                            <button onClick={() => setSearchFilter({title: '', location: ''})} className='text-gray-500 text-sm underline ml-2'>Clear All</button>
                        </div>
                    </div>
                )}

                <div className='mb-8'>
                    <h4 className='font-medium text-lg mb-4'>Search by Categories</h4>
                    <ul className='space-y-3'>
                        {JobCategories.map((category, index) => (
                            <li key={index} className='flex items-center gap-3'>
                                <input className='scale-125' type="checkbox" onChange={() => handleCategoryChange(category)} checked={selectedCategories.includes(category)} />
                                <span className='text-gray-600'>{category}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='mb-8'>
                    <h4 className='font-medium text-lg mb-4'>Search by Location</h4>
                    <ul className='space-y-3'>
                        {JobLocations.map((location, index) => (
                            <li key={index} className='flex items-center gap-3'>
                                <input className='scale-125' type="checkbox" onChange={() => handleLocationChange(location)} checked={selectedLocations.includes(location)} />
                                <span className='text-gray-600'>{location}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Job Listings Section */}
            <section className='w-full lg:w-3/4 text-gray-800 px-4'>
                {/* Latest Jobs Header with Icon */}
                <div className='mb-8'>
                    <div className='flex items-center gap-4 mb-2'>
                        <div className='w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg'>
                            <img className='w-8 h-8' src={assets.latest_jobs_icon} alt="Latest Jobs" />
                        </div>
                        <div>
                            <h3 className='font-bold text-3xl bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent'>Latest Jobs</h3>
                            <p className='text-sm text-gray-500 mt-1'>🔥 Hot opportunities posted today!</p>
                        </div>
                    </div>
                    <div className='h-1 w-24 bg-gradient-to-r from-red-600 to-yellow-400 rounded-full'></div>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8'>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job) => (
                            <JobCard key={job._id} job={job} isApplied={appliedJobs.includes(job._id)} />
                        ))
                    ) : (
                        <div className='col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl'>
                             <p className='text-gray-500 text-lg'>No jobs found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredJobs.length > 6 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <img onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} src={assets.left_arrow_icon} alt="Prev" className='cursor-pointer p-2 hover:bg-gray-100 rounded' />
                        {[...Array(Math.ceil(filteredJobs.length / 6))].map((_, index) => (
                            <button key={index} onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                                {index + 1}
                            </button>
                        ))}
                        <img onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="Next" className='cursor-pointer p-2 hover:bg-gray-100 rounded' />
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing;