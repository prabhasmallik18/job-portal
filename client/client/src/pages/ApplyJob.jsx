import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const ApplyJob = () => { 
    const { id } = useParams();
    const [jobData, setJobData] = useState(null);
    const { jobs } = useContext(AppContext);

    const fetchJobData = async () => {
        if (jobs && jobs.length > 0) {
            const data = jobs.filter(job => job._id === id);
            if (data.length !== 0) {
                setJobData(data[0]);
            }
        }
    }

    useEffect(() => {
        fetchJobData();
    }, [id, jobs]);

    return jobData ? (
        <>
            <div className='container px-4 2xl:px-20 mx-auto min-h-screen py-10'>
                <div className='bg-white text-black p-8 rounded-xl border border-blue-100 shadow-sm'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
                        <div className='flex items-center gap-10'>
                            {/* Company Image from assets */}
                            <img className='h-24 bg-white p-4 border rounded-lg' src={jobData.companyId.image} alt="" />
                            <div className='text-left'>
                                <h1 className='text-2xl sm:text-4xl font-semibold'>{jobData.title}</h1>
                                <div className='flex flex-wrap gap-4 mt-2 text-gray-600'>
                                    <span className='flex items-center gap-1'><img src={assets.suitcase_icon} alt="" /> {jobData.companyId.name}</span>
                                    <span className='flex items-center gap-1'><img src={assets.location_icon} alt="" /> {jobData.location}</span>
                                    <span className='flex items-center gap-1'><img src={assets.person_icon} alt="" /> {jobData.level}</span>
                                    <span className='flex items-center gap-1'><img src={assets.money_icon} alt="" /> CTC: {jobData.salary}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col text-center'>
                            <button className='bg-blue-600 text-white px-10 py-2.5 rounded-lg'>Apply Now</button>
                            <p className='text-gray-500 text-sm mt-1'>Posted a month ago</p>
                        </div>
                    </div>

                    <div className='flex flex-col lg:flex-row justify-between gap-10 mt-12 text-left'>
                        <div className='lg:w-2/3'>
                            <h2 className='text-2xl font-bold mb-4'>Job description</h2>
                            <div className='rich-text text-gray-700' dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
                            <button className='bg-blue-600 text-white px-10 py-2.5 rounded-lg mt-10'>Apply now</button>
                        </div>

                        {/* Right Side: Sidebar */}
                        <div className='lg:w-1/3'>
                            <h2 className='text-xl font-bold mb-4'>More jobs from {jobData.companyId.name}</h2>
                            {jobs.filter(job => job._id !== id && job.companyId._id === jobData.companyId._id)
                                .slice(0, 3)
                                .map((job, index) => <JobCard key={index} job={job} />)}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    ) : (
        <Loading />
    )
}

export default ApplyJob;