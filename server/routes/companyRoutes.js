import express from 'express'
import { postJob, getCompanyJobs, getCompanyJobApplicants } from '../controllers/jobController.js'
import { protectCompany } from '../middleware/authMiddleware.js'
import { loginCompany, registerCompany, getCompanyData } from '../controllers/companyController.js'
import { getAiResponse } from '../controllers/aiController.js'
import Company from '../models/Company.js'
import Job from '../models/job.js'
import multer from 'multer'

const companyRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

// Auth
companyRouter.post('/register', upload.single('image'), registerCompany)
companyRouter.post('/login', loginCompany)
companyRouter.get('/data', protectCompany, getCompanyData)

// Job Management
companyRouter.post('/post-job', protectCompany, postJob)
companyRouter.get('/list-jobs', protectCompany, getCompanyJobs)
companyRouter.get('/applicants', protectCompany, getCompanyJobApplicants)

// AI Career Assistant Route - Public/Open access
companyRouter.post('/ai-chat', getAiResponse)

// Diagnostic endpoint (for testing only)
companyRouter.get('/debug/stats', async (req, res) => {
    try {
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const jobsByCompany = await Job.aggregate([
            { $group: { _id: '$companyId', count: { $sum: 1 } } },
            { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } }
        ]);
        
        const companies = await Company.find().select('_id name email');
        
        res.json({
            success: true,
            totalCompanies,
            totalJobs,
            companies: companies.map(c => ({
                id: c._id,
                name: c.name,
                email: c.email
            })),
            jobsByCompany: jobsByCompany.map(jc => ({
                companyId: jc._id,
                companyName: jc.company[0]?.name || 'Unknown',
                jobCount: jc.count
            }))
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
})

companyRouter.get('/debug/all-jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('companyId', 'name email').select('title location category companyId');
        res.json({ success: true, totalJobs: jobs.length, jobs });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
})

export default companyRouter