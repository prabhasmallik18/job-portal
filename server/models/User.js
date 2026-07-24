import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String }, // For Clerk OAuth users (optional)
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For traditional auth (optional)
    resume: { type: String },
    image: { type: String },
    registeredAt: { type: Date, default: Date.now },
    
    // Advanced Features - Skills & Profile Data
    skills: { type: [String], default: [] },
    experience: { type: Number, default: 0 }, // in years
    education: { type: String }, // Degree/Qualification
    specialization: { type: String }, // e.g., Full Stack, Frontend, Backend
    bio: { type: String },
    
    // Analytics
    appliedJobs: [{ 
        jobId: mongoose.Schema.Types.ObjectId, 
        applicationDate: Date, 
        status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'offer'], default: 'applied' }
    }],
    savedJobs: [mongoose.Schema.Types.ObjectId],
    
    // Interview Progress
    interviewsPracticed: { type: Number, default: 0 },
    profileStrength: { type: Number, default: 0, min: 0, max: 100 },
    
    // Preferences
    targetRole: { type: String },
    preferredLocation: { type: [String], default: [] },
    salaryExpectation: { type: Number }
})

const User = mongoose.model('User', userSchema);

export default User;