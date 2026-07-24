import User from "../models/User.js";
import Job from "../models/job.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// 1. PROFILE STRENGTH INDICATOR
// ============================================
export const calculateProfileStrength = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // TEMPORARY: Profile strength feature is under development.
        // Currently showing basic calculations. Advanced AI-powered profile analysis coming soon!
        const tempMessage = "🚧 Profile Strength Feature - Temporary Implementation: Basic profile completeness check. AI-powered optimization suggestions and industry benchmarking coming soon!";
        
        let strength = 0;
        const checks = {};

        // Check each profile component
        checks.name = user.name ? 20 : 0;
        checks.email = user.email ? 10 : 0;
        checks.image = user.image ? 10 : 0;
        checks.bio = user.bio && user.bio.length > 20 ? 10 : 0;
        checks.skills = user.skills && user.skills.length >= 3 ? 15 : 0;
        checks.experience = user.experience > 0 ? 10 : 0;
        checks.education = user.education ? 10 : 0;
        checks.specialization = user.specialization ? 5 : 0;

        strength = Object.values(checks).reduce((a, b) => a + b, 0);

        // Update user profile strength
        user.profileStrength = strength;
        await user.save();

        res.json({
            profileStrength: strength,
            breakdown: checks,
            message: strength >= 80 ? "Profile looks great! ⭐" : "Add more info to strengthen your profile 💪",
            temporaryNote: tempMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. SMART JOB RECOMMENDATIONS
// ============================================
export const getJobRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // TEMPORARY: Job recommendations feature is under development.
        // Currently showing basic matching. AI-powered personalized recommendations coming soon!
        const tempMessage = "🚧 Job Recommendations Feature - Temporary Implementation: Basic skill matching active. Advanced AI recommendations with career path insights coming soon!";
        
        // Get all available jobs
        let jobs = await Job.find({ visible: true }).populate("companyId");

        // Calculate match score for each job
        const recommendations = jobs.map(job => {
            let matchScore = 0;
            let reasons = [];

            // 1. Skill Match (40 points max)
            if (user.skills && user.skills.length > 0) {
                const skillMatches = (job.skills || []).filter(skill =>
                    user.skills.some(userSkill => 
                        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                    )
                );
                matchScore += (skillMatches.length / Math.max(job.skills.length, 1)) * 40;
                if (skillMatches.length > 0) reasons.push(`${skillMatches.length} skill match`);
            }

            // 2. Experience Match (30 points max)
            const requiredExp = parseInt(job.level) || 0;
            if (user.experience >= requiredExp) {
                matchScore += Math.min(30, (user.experience / 5) * 10);
                reasons.push("Experience level matches");
            }

            // 3. Specialization Match (20 points max)
            if (user.specialization && job.title.toLowerCase().includes(user.specialization.toLowerCase())) {
                matchScore += 20;
                reasons.push("Specialization matches");
            }

            // 4. Location Preference (10 points max)
            if (user.preferredLocation && user.preferredLocation.length > 0) {
                if (user.preferredLocation.some(loc => 
                    job.location.toLowerCase().includes(loc.toLowerCase())
                )) {
                    matchScore += 10;
                    reasons.push("Location preference matches");
                }
            }

            return {
                jobId: job._id,
                title: job.title,
                company: job.companyId?.name || "Unknown",
                location: job.location,
                salary: job.salary,
                skills: job.skills,
                matchScore: Math.min(100, Math.round(matchScore)),
                matchReasons: reasons.length > 0 ? reasons : ["Worth exploring!"],
                appliedStatus: user.appliedJobs?.some(app => app.jobId?.toString() === job._id.toString()) ? "Applied" : "Not Applied"
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        res.json({
            recommendations: recommendations.slice(0, 10), // Top 10 recommendations
            totalMatches: recommendations.length,
            userProfile: {
                skills: user.skills,
                experience: `${user.experience} years`,
                specialization: user.specialization,
                profileStrength: user.profileStrength
            },
            temporaryNote: tempMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. SKILL GAP ANALYZER
// ============================================
export const getSkillGap = async (req, res) => {
    try {
        const { userId, jobId } = req.params;
        const user = await User.findById(userId);
        const job = await Job.findById(jobId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!job) return res.status(404).json({ message: "Job not found" });

        const requiredSkills = job.skills || [];
        const userSkills = user.skills || [];

        // Analyze gaps
        const matchedSkills = requiredSkills.filter(skill =>
            userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );

        const missingSkills = requiredSkills.filter(skill =>
            !userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );

        const skillGapPercentage = Math.round((missingSkills.length / Math.max(requiredSkills.length, 1)) * 100);
        const readinessPercentage = 100 - skillGapPercentage;

        res.json({
            jobTitle: job.title,
            readinessPercentage,
            skillGapPercentage,
            matchedSkills,
            missingSkills,
            totalRequired: requiredSkills.length,
            totalMatched: matchedSkills.length,
            suggestion: readinessPercentage >= 70 ? 
                "You're well-prepared for this role! Apply now! 🚀" : 
                `You need to learn ${missingSkills.length} more skill(s). Start with the most relevant ones! 📚`,
            temporaryNote: "🚧 Skill Gap Analyzer Feature - Temporary Implementation: Basic skill matching active. Advanced learning paths and certification recommendations coming soon!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. APPLICATION ANALYTICS
// ============================================
export const getApplicationAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("appliedJobs.jobId");

        if (!user) return res.status(404).json({ message: "User not found" });

        const applications = user.appliedJobs || [];

        // Calculate stats
        const stats = {
            totalApplications: applications.length,
            applied: applications.filter(a => a.status === "applied").length,
            shortlisted: applications.filter(a => a.status === "shortlisted").length,
            rejected: applications.filter(a => a.status === "rejected").length,
            offered: applications.filter(a => a.status === "offer").length,
            successRate: applications.length > 0 ? 
                Math.round(((applications.filter(a => a.status === "offer").length) / applications.length) * 100) : 0,
            successMessage: `You've successfully secured ${applications.filter(a => a.status === "offer").length} offer(s)! 🎉`
        };

        // Timeline data (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentApplications = applications.filter(a => new Date(a.applicationDate) > thirtyDaysAgo).length;

        // Status breakdown
        const statusBreakdown = {
            applied: stats.applied,
            shortlisted: stats.shortlisted,
            rejected: stats.rejected,
            offered: stats.offered
        };

        res.json({
            stats,
            recentApplications30Days: recentApplications,
            statusBreakdown,
            trend: recentApplications > 5 ? "You're actively applying! Keep it up! 📈" : "Consider applying to more jobs 💪",
            temporaryNote: "🚧 Application Analytics Feature - Temporary Implementation: Basic tracking active. Advanced analytics with success predictions and optimization tips coming soon!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. INTERVIEW PREP - AI GENERATED QUESTIONS
// ============================================
export const generateInterviewQuestions = async (req, res) => {
    try {
        const { userId, jobId } = req.params;
        const user = await User.findById(userId);
        const job = await Job.findById(jobId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!job) return res.status(404).json({ message: "Job not found" });

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Generate 5 technical interview questions for a ${job.title} position at a company. 
            The candidate has these skills: ${user.skills?.join(", ") || "Not specified"} 
            and ${user.experience} years of experience.
            
            Format your response as a JSON array with objects containing:
            - question: the interview question
            - difficulty: easy/medium/hard
            - topic: the topic area
            - tip: a tip for answering
            
            Return ONLY valid JSON, no other text.`;

            const result = await model.generateContent(prompt);
            let questionsText = result.response.text();
            
            // Extract JSON from response
            const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error("Invalid JSON response");
            }
            const questions = JSON.parse(jsonMatch[0]);

            // Update interview count
            user.interviewsPracticed = (user.interviewsPracticed || 0) + 1;
            await user.save();

            res.json({
                jobTitle: job.title,
                questions,
                message: "Good luck with your interview prep! 🎤",
                temporaryNote: "🚧 Interview Questions Feature - Temporary Implementation: AI-generated questions active. Personalized mock interviews and feedback coming soon!"
            });
        } catch (apiError) {
            // Fallback: Provide standard interview questions
            const standardQuestions = [
                {
                    question: "Tell me about a challenging project you worked on.",
                    difficulty: "medium",
                    topic: "Experience",
                    tip: "Use STAR method: Situation, Task, Action, Result"
                },
                {
                    question: `How would you approach ${job.title} responsibilities?`,
                    difficulty: "medium",
                    topic: "Role-Specific",
                    tip: "Relate your skills to the job requirements"
                },
                {
                    question: "What's your experience with our tech stack?",
                    difficulty: "hard",
                    topic: "Technical",
                    tip: `Mention these skills: ${job.skills?.slice(0, 3).join(", ") || "relevant technologies"}`
                },
                {
                    question: "Where do you see yourself in 5 years?",
                    difficulty: "easy",
                    topic: "Career Goals",
                    tip: "Align your goals with the company's growth"
                },
                {
                    question: "Why do you want to work with us?",
                    difficulty: "medium",
                    topic: "Motivation",
                    tip: "Research the company and mention specific reasons"
                }
            ];

            user.interviewsPracticed = (user.interviewsPracticed || 0) + 1;
            await user.save();

            res.json({
                jobTitle: job.title,
                questions: standardQuestions,
                message: "Here are common interview questions for this role. Good luck! 🎤",
                temporaryNote: "🚧 Interview Questions Feature - Temporary Implementation: AI-generated questions active. Personalized mock interviews and feedback coming soon!"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 6. UPDATE USER PROFILE WITH SKILLS
// ============================================
export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { skills, experience, education, specialization, bio, targetRole, preferredLocation, salaryExpectation } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                skills: skills || [],
                experience: experience || 0,
                education: education || "",
                specialization: specialization || "",
                bio: bio || "",
                targetRole: targetRole || "",
                preferredLocation: preferredLocation || [],
                salaryExpectation: salaryExpectation || 0
            },
            { new: true }
        );

        res.json({
            message: "Profile updated successfully! 🎯",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
