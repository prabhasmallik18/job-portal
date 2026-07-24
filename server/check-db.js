import mongoose from 'mongoose'
import 'dotenv/config'
import Company from './models/Company.js'
import Job from './models/job.js'

const checkDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')
        
        const companies = await Company.find()
        const jobs = await Job.find()
        
        console.log('\n📊 Database Statistics:')
        console.log(`Total Companies: ${companies.length}`)
        console.log(`Total Jobs: ${jobs.length}`)
        
        console.log('\n👥 Jobs per Company:')
        for (let company of companies) {
            const companyJobs = jobs.filter(j => j.companyId.toString() === company._id.toString())
            console.log(`  • ${company.name}: ${companyJobs.length} jobs`)
        }
        
        console.log('\n✅ Database is properly configured!')
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

checkDatabase()
