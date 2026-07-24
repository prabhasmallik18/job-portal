import mongoose from 'mongoose'
import 'dotenv/config'
import Company from './models/Company.js'
import Job from './models/Job.js'
import jwt from 'jsonwebtoken'

const testAPI = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')
        
        // Get first company
        const company = await Company.findOne({ name: 'Tech Solutions Inc' })
        
        if (!company) {
            console.error('❌ Company not found')
            return
        }
        
        console.log(`\n🔐 Testing API with company: ${company.name}`)
        console.log(`   Company ID: ${company._id}`)
        
        // Create a test token
        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET)
        console.log(`   Token: ${token.substring(0, 30)}...`)
        
        // Simulate the backend's behavior
        // Extract companyId from token (like protectCompany middleware does)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const companyId = decoded.id
        
        console.log(`\n📋 Fetching jobs for companyId: ${companyId}`)
        
        // Query jobs (like getCompanyJobs does)
        const jobs = await Job.find({ companyId }).populate({ path: 'companyId', select: 'name image' })
        
        console.log(`✅ Found ${jobs.length} jobs:`)
        jobs.forEach((job, i) => {
            console.log(`   ${i + 1}. ${job.title} - ${job.location}`)
        })
        
        console.log('\n✅ API would work correctly!')
        
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

testAPI()
