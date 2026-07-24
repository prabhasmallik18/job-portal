import mongoose from "mongoose";

const applicationTrackerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    // 🔹 Core Tracking
    applicationDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['applied', 'viewed', 'shortlisted', 'interview_scheduled', 'interview_completed', 'rejected', 'offer_received', 'offer_accepted', 'offer_declined'],
        default: 'applied'
    },
    
    // 🔹 Timeline Events
    timeline: [{
        event: String, // e.g., "Shortlisted", "Interview Scheduled"
        date: Date,
        notes: String,
        status: String
    }],
    
    // 🔹 Interview Details
    interviewDetails: {
        scheduledDate: Date,
        interviewType: { type: String, enum: ['phone', 'video', 'in_person', 'coding'], default: 'phone' },
        interviewerName: String,
        interviewerEmail: String,
        links: [String], // Zoom/Meet links
        notes: String,
        feedback: String,
        rating: { type: Number, min: 1, max: 5 }
    },
    
    // 🔹 Offer Details
    offerDetails: {
        offerDate: Date,
        basesalary: Number,
        currency: { type: String, default: 'USD' },
        benefits: [String], // Health, PF, etc
        bonusPercentage: Number,
        ctc: Number, // Cost to Company
        noticePeriod: Number, // in days
        department: String,
        reportingManager: String,
        offerLetter: String // URL to document
    },
    
    // 🔹 Rejection Details
    rejectionReason: String,
    rejectionDate: Date,
    
    // 🔹 Communications
    messages: [{
        date: Date,
        sender: String, // company/user
        content: String
    }],
    
    // 🔹 Documents
    submittedResume: String,
    submittedCoverLetter: String,
    portfolioLink: String,
    
    // 🔹 Analytics
    responseTime: Number, // days between application and first response
    daysSinceApplication: { type: Number, default: 0 },
    
    // 🔹 Score & Priority
    applicationScore: { type: Number, default: 0 }, // 0-100
    priority: { type: String, enum: ['low', 'medium', 'high', 'very_high'], default: 'medium' },
}, { timestamps: true });

const ApplicationTracker = mongoose.model('ApplicationTracker', applicationTrackerSchema);
export default ApplicationTracker;
