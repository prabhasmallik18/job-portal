import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import companyRouter from './routes/companyRoutes.js'
import userRouter from './routes/userRoutes.js'
import advancedFeaturesRouter from './routes/advancedFeaturesRoutes.js'
import applicationTrackerRouter from './routes/applicationTrackerRoutes.js'
import resumeAnalyzerRouter from './routes/resumeAnalyzerRoutes.js'
import interviewPrepRouter from './routes/interviewPrepRoutes.js'
import salaryNegotiationRouter from './routes/salaryNegotiationRoutes.js'
import gamificationRouter from './routes/gamificationRoutes.js'
import { getJobs } from './controllers/jobController.js'

const app = express()
app.use(express.json())
app.use(cors())

connectDB()
connectCloudinary()

// Debug endpoint to check API configuration
app.get('/api/debug/config', (req, res) => {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasGoogleKey = !!process.env.GOOGLE_API_KEY;
    
    console.log("🔍 Config Check:");
    console.log("- GEMINI_API_KEY:", hasGeminiKey ? "✅ SET" : "❌ NOT SET");
    console.log("- GOOGLE_API_KEY:", hasGoogleKey ? "✅ SET" : "❌ NOT SET");
    
    res.json({
        geminiKeySet: hasGeminiKey,
        googleKeySet: hasGoogleKey,
        environment: process.env.NODE_ENV || 'development',
        message: hasGeminiKey || hasGoogleKey ? "✅ API Key configured" : "❌ API Key missing!"
    });
});

// Public Routes
app.get('/api/jobs', getJobs)

// Advanced Features Routes (NEW)
app.use('/api/applications', applicationTrackerRouter)
app.use('/api/resume', resumeAnalyzerRouter)
app.use('/api/interview', interviewPrepRouter)
app.use('/api/salary', salaryNegotiationRouter)
app.use('/api/gamification', gamificationRouter)

// Existing Routes
app.use('/api/company', companyRouter)
app.use('/api/users', userRouter)
app.use('/api/advanced', advancedFeaturesRouter)

const PORT = process.env.PORT || 5000

// Validation on startup
const startupValidation = () => {
  console.log('\n🔍 STARTUP VALIDATION:')
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const optionalVars = ['GEMINI_API_KEY', 'GOOGLE_API_KEY'];
  
  let allValid = true;
  
  requiredVars.forEach(variable => {
    if (process.env[variable]) {
      console.log(`✅ ${variable}: SET`)
    } else {
      console.log(`❌ ${variable}: MISSING (REQUIRED)`)
      allValid = false;
    }
  });
  
  optionalVars.forEach(variable => {
    if (process.env[variable]) {
      console.log(`✅ ${variable}: SET`)
    } else {
      console.log(`⚠️ ${variable}: NOT SET (Optional - AI features will have limited functionality)`)
    }
  });
  
  if (!allValid) {
    console.log('\n⛔ ERROR: Required environment variables are missing!')
    console.log('Please check your .env file and ensure all required variables are set.\n')
    process.exit(1);
  }
  console.log('✅ All required variables validated!\n')
};

startupValidation();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`🌐 Local URL: http://localhost:${PORT}`)
  console.log('✅ Database connected')
  console.log('✅ Cloudinary configured\n')
})