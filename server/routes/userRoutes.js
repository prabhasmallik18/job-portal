import express from 'express'
import { protectUser } from '../middleware/authMiddleware.js'
import { 
    registerUser, 
    loginUser, 
    getUserData, 
    applyForJob, 
    getUserJobApplications,
    updateUserResume 
} from '../controllers/userController.js'
import { getAiResponse } from '../controllers/aiController.js'
import multer from 'multer'

const userRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

// 🔹 Auth Routes (No protection needed)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// 🔹 Protected Routes
userRouter.get('/user', protectUser, getUserData)
userRouter.post('/apply', protectUser, applyForJob)
userRouter.get('/applications', protectUser, getUserJobApplications)
userRouter.post('/upload-resume', protectUser, upload.single('resume'), updateUserResume)

// 🔹 AI Career Assistant Route (No protection)
userRouter.post('/ai-chat', getAiResponse) 

export default userRouter