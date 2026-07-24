import mongoose from "mongoose";

const interviewPracticeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    
    // 🔹 Interview Session
    sessionId: { type: String, unique: true },
    sessionType: { type: String, enum: ['technical', 'behavioral', 'mixed'], default: 'technical' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    topic: String, // e.g., "React Hooks", "System Design", "OOPS"
    
    // 🔹 Questions
    questions: [{
        questionId: String,
        question: String,
        topic: String,
        difficulty: String,
        userAnswer: String,
        answerDuration: Number, // seconds
        recordedVideoUrl: String,
        answerQuality: {
            clarity: { type: Number, min: 1, max: 10 }, // How clear was the answer
            completeness: { type: Number, min: 1, max: 10 }, // Did they cover all points
            confidence: { type: Number, min: 1, max: 10 }, // Confidence level
            technicalAccuracy: { type: Number, min: 1, max: 10 } // Technical correctness
        },
        aiEvaluation: {
            score: { type: Number, min: 0, max: 100 },
            feedback: String,
            strengths: [String],
            areasToImprove: [String],
            expectedAnswer: String,
            tips: String
        },
        timestamp: { type: Date, default: Date.now }
    }],
    
    // 🔹 Session Performance
    overallPerformance: {
        totalScore: { type: Number, min: 0, max: 100, default: 0 },
        averageAnswerQuality: { type: Number, min: 0, max: 100 },
        averageResponseTime: Number, // seconds
        clarity: { type: Number, min: 1, max: 10 },
        technicalKnowledge: { type: Number, min: 1, max: 10 },
        communicationSkills: { type: Number, min: 1, max: 10 },
        confidence: { type: Number, min: 1, max: 10 }
    },
    
    // 🔹 Video Analysis (AI-Powered)
    videoAnalysis: {
        eyeContact: { type: Number, min: 1, max: 10 }, // Poor to Excellent
        pacing: { type: Number, min: 1, max: 10 }, // Speaking pace
        emotion: { type: Number, min: 1, max: 10 }, // Emotional appropriateness
        gestures: { type: Number, min: 1, max: 10 }, // Hand movements, body language
        speechClarity: { type: Number, min: 1, max: 10 }, // Accent, pronunciation
        recommendations: [String]
    },
    
    // 🔹 Weak Areas Detection
    weakAreas: [{
        topic: String,
        proficiency: { type: Number, min: 1, max: 10 },
        suggestedResources: [String], // YouTube links, courses, etc.
        practiceQuestions: [String]
    }],
    
    // 🔹 Progress Tracking
    sessionNumber: { type: Number, default: 1 }, // 1st, 2nd, 3rd mock interview
    comparisonWithPrevious: {
        scoreImprovement: Number, // +5%, -2%, etc
        lessonsLearned: [String]
    },
    
    // 🔹 Metadata
    duration: Number, // Total session duration in seconds
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
    isCompleted: { type: Boolean, default: false }
});

const InterviewPractice = mongoose.model('InterviewPractice', interviewPracticeSchema);
export default InterviewPractice;
