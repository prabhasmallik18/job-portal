import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    
    // 🔹 User data snapshot at time of application
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userResume: { type: String }, // URL to resume
    userImage: { type: String },
    
    status: { type: String, default: 'Pending' },
    date: { type: Number, required: true }
})

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema)

export default JobApplication
