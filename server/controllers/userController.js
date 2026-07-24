import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'

// 🔹 User Registration
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            image: '' // Default empty, user can update later
        })

        res.json({
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            },
            token: generateToken(user._id)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// 🔹 User Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    resume: user.resume
                },
                token: generateToken(user._id)
            })
        } else {
            res.json({ success: false, message: "Invalid email or password" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.body.userId || req.auth?.userId
        let user
        
        if (req.body.userId) {
            // Traditional auth
            user = await User.findById(userId)
        } else {
            // Clerk auth
            user = await User.findOne({ clerkId: userId })
        }

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Apply for a job (with resume check) - OPTIMIZED
export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.body.userId || req.auth?.userId
    
    try {
        let userData
        
        if (req.body.userId) {
            // Traditional auth
            userData = await User.findById(userId)
        } else {
            // Clerk auth
            userData = await User.findOne({ clerkId: userId })
        }

        if (!userData) {
            return res.json({ success: false, message: 'User not found', resumeRequired: false })
        }
        
        // 🔹 OPTIMIZED: Parallel fetch of job data and existing application check
        const [jobData, isAlreadyApplied] = await Promise.all([
            Job.findById(jobId),
            JobApplication.findOne({ jobId, userId: userData._id })
        ])

        if (!jobData) {
            return res.json({ success: false, message: 'Job Not Found' })
        }

        if (isAlreadyApplied) {
            return res.json({ success: false, message: 'Already Applied' })
        }

        // 🔹 Save application with user data snapshot
        const application = await JobApplication.create({
            userId: userData._id,
            companyId: jobData.companyId,
            jobId,
            userName: userData.name,
            userEmail: userData.email,
            userResume: userData.resume,
            userImage: userData.image,
            date: Date.now()
        })

        res.json({ 
            success: true, 
            message: 'Applied Successfully',
            applicationId: application._id 
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get user applied applications - OPTIMIZED
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.body.userId || req.auth?.userId
        let userData
        
        if (req.body.userId) {
            // Traditional auth
            userData = await User.findById(userId)
        } else {
            // Clerk auth
            userData = await User.findOne({ clerkId: userId })
        }

        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        // 🔹 Get applications with populated job and company data
        const applications = await JobApplication.find({ userId: userData._id })
            .sort({ date: -1 })
            .limit(100)
            .populate('companyId', 'name image')
            .populate('jobId', 'title location category level salary')
            .exec()

        res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update user profile (resume) - OPTIMIZED
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.body.userId || req.auth?.userId
        const resumeFile = req.file
        
        if (!resumeFile) {
            return res.json({ success: false, message: 'No file uploaded' })
        }

        // Validate resume type and file size
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf'
        ]
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.rtf']
        const fileExtension = resumeFile.originalname
            .toLowerCase()
            .slice(resumeFile.originalname.lastIndexOf('.'))

        if (!allowedTypes.includes(resumeFile.mimetype) && !allowedExtensions.includes(fileExtension)) {
            return res.json({ success: false, message: 'Resume must be PDF, DOC, DOCX, or RTF format' })
        }

        // Check file size (10MB limit)
        const MAX_FILE_SIZE = 10 * 1024 * 1024
        if (resumeFile.size > MAX_FILE_SIZE) {
            return res.json({ success: false, message: 'File size exceeds 10MB limit' })
        }

        let userData
        
        if (req.body.userId) {
            // Traditional auth
            userData = await User.findById(userId)
        } else {
            // Clerk auth
            userData = await User.findOne({ clerkId: userId })
        }

        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        // 🔹 Upload with timeout (30 seconds)
        const uploadPromise = cloudinary.uploader.upload(resumeFile.path, {
            resource_type: 'raw',
            timeout: 30000
        })

        const resumeUpload = await Promise.race([
            uploadPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Upload timeout')), 35000)
            )
        ])

        await User.findByIdAndUpdate(userData._id, { resume: resumeUpload.secure_url })
        
        res.json({ success: true, message: 'Resume Updated', resume: resumeUpload.secure_url })
    } catch (error) {
        console.error('Resume upload error:', error)
        res.json({ success: false, message: error.message || 'Resume upload failed' })
    }
}