import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    
    // 🔹 ATS Score & Metrics
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    passRate: { type: Number, default: 0 }, // % chance of passing ATS
    
    // 🔹 Content Analysis
    contentAnalysis: {
        totalWords: Number,
        keywordMatch: { type: Number, default: 0 }, // % match with job market keywords
        actionVerbs: [String], // Strong action verbs found
        actionVerbCount: Number,
        metrics: [String], // Quantifiable achievements found
        metricsCount: Number,
        projectsCount: Number,
        technologiesCount: Number
    },
    
    // 🔹 Structure & Formatting
    formatAnalysis: {
        isWellFormatted: Boolean,
        pageCount: Number,
        fontConsistency: Boolean,
        hasProperHeadings: Boolean,
        bulletPoints: Number,
        issues: [String] // e.g., "Inconsistent formatting", "Too many fonts"
    },
    
    // 🔹 Extracted Information
    extracted: {
        skills: [String],
        experience: [String],
        education: [String],
        certifications: [String],
        projects: [String],
        languages: [String]
    },
    
    // 🔹 AI-Powered Feedback
    feedback: [{
        category: String, // skills, experience, education, formatting, keywords
        priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
        issue: String,
        suggestion: String,
        impact: String, // Why this matters for ATS/hiring
        example: String // Example of good practice
    }],
    
    // 🔹 Improvement Recommendations
    recommendations: {
        shouldAdd: [String], // What to add to resume
        shouldRemove: [String], // What to remove
        shouldImprove: [String], // What to enhance
        priority: { type: String, enum: ['critical', 'high', 'medium'], default: 'critical' } // What to fix first
    },
    
    // 🔹 Comparison
    industryComparison: {
        yourScore: Number,
        avgScore: Number,
        topScore: Number,
        percentile: Number, // Your position vs all resumes analyzed
        matchWithJobMarket: Number // 0-100
    },
    
    // 🔹 Version Tracking
    versions: [{
        version: Number,
        analyzedDate: Date,
        atsScore: Number,
        changes: [String]
    }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastAnalyzedAt: Date
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
