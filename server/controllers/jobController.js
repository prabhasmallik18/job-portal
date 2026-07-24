import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Home page lo jobs kanapadalante (Already correct ga undi, but simplified)
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate({ path: 'companyId', select: '-password' });
        res.json({ success: true, jobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Company posted jobs list (IKKADA POPULATE ADD CHESHANU)
export const getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.company?._id || req.body?.companyId;
        
        console.log('📋 Fetching jobs for companyId:', companyId)
        
        if (!companyId) {
            console.log('❌ Company ID not found in request')
            return res.json({ success: false, message: 'Company ID not found in request' });
        }
        
        // Populate add cheyadam valla logo (image) field vasthundi
        const jobs = await Job.find({ companyId }).populate({ path: 'companyId', select: 'name image' });
        
        console.log(`✅ Found ${jobs.length} jobs for company ${companyId}`)
        
        res.json({ success: true, jobs: jobs || [] });
    } catch (error) {
        console.error('❌ Error in getCompanyJobs:', error.message)
        res.json({ success: false, message: error.message });
    }
}

// Job Post cheyadam
export const postJob = async (req, res) => {
    try {
        const { title, description, location, salary, level, category, skills } = req.body;
        const companyId = req.company?._id || req.body?.companyId;

        if (!companyId) {
            return res.json({ success: false, message: 'Company authentication required' });
        }

        const newJob = new Job({
            title, description, location, salary, level, category, companyId, skills: skills || [],
            date: Date.now()
        });

        await newJob.save();
        res.json({ success: true, message: "Job Posted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Applicants list view
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company?._id || req.body?.companyId;
        const applications = await JobApplication.find({ companyId })
            .populate('jobId', 'title location')
            .sort({ date: -1 });
        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}