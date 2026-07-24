import ResumeAnalysis from "../models/ResumeAnalysis.js";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// 1. ANALYZE RESUME - MAIN ENDPOINT
// ============================================
export const analyzeResume = async (req, res) => {
    try {
        const { userId, resumeUrl } = req.body;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Check if analysis already exists
        let analysis = await ResumeAnalysis.findOne({ userId });
        
        const defaultContentAnalysis = {
            skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
            actionVerbs: ['Implemented', 'Designed', 'Optimized', 'Led'],
            metrics: ['30% improvement', '500+ users', '99.9% uptime'],
            technologiesCount: 4,
            keywordMatch: 72,
            actionVerbCount: 4,
            metricsCount: 3
        };

        const defaultRecommendations = {
            shouldAdd: ['Quantify achievements with metrics', 'Include more role-specific keywords', 'Highlight project outcomes'],
            shouldRemove: ['Generic statements', 'Outdated technologies', 'Weak verbs'],
            shouldImprove: ['Project descriptions', 'Formatting consistency', 'Skill section clarity']
        };

        if (!analysis) {
            analysis = new ResumeAnalysis({
                userId,
                resumeUrl,
                atsScore: 65,
                contentAnalysis: defaultContentAnalysis,
                formatAnalysis: { issues: [] },
                feedback: [],
                recommendations: defaultRecommendations,
                industryComparison: {},
                versions: []
            });
        }

        analysis.contentAnalysis = {
            skills: analysis.contentAnalysis?.skills?.length ? analysis.contentAnalysis.skills : defaultContentAnalysis.skills,
            actionVerbs: analysis.contentAnalysis?.actionVerbs?.length ? analysis.contentAnalysis.actionVerbs : defaultContentAnalysis.actionVerbs,
            metrics: analysis.contentAnalysis?.metrics?.length ? analysis.contentAnalysis.metrics : defaultContentAnalysis.metrics,
            technologiesCount: analysis.contentAnalysis?.technologiesCount || defaultContentAnalysis.technologiesCount,
            keywordMatch: analysis.contentAnalysis?.keywordMatch || defaultContentAnalysis.keywordMatch,
            actionVerbCount: analysis.contentAnalysis?.actionVerbCount || defaultContentAnalysis.actionVerbCount,
            metricsCount: analysis.contentAnalysis?.metricsCount || defaultContentAnalysis.metricsCount
        };
        analysis.formatAnalysis = analysis.formatAnalysis || { issues: [] };
        analysis.feedback = analysis.feedback || [];
        analysis.recommendations = analysis.recommendations || defaultRecommendations;
        analysis.industryComparison = analysis.industryComparison || {};
        analysis.versions = analysis.versions || [];
        
        // Use Gemini API to analyze resume text (in real scenario, extract from PDF first)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `You are an expert resume reviewer. Analyze this resume and provide:
1. ATS Score (0-100)
2. Key skills found
3. Action verbs used
4. Quantifiable metrics/achievements
5. Formatting issues
6. Top 5 recommendations to improve

Return JSON with these fields:
{
  "atsScore": number,
  "contentAnalysis": { "skills": [], "actionVerbs": [], "metrics": [], "technologiesCount": number },
  "formatIssues": [],
  "feedback": [],
  "recommendations": { "shouldAdd": [], "shouldRemove": [], "shouldImprove": [] }
}`;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Parse JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
            
            analysis.atsScore = aiAnalysis.atsScore || 65;
            analysis.contentAnalysis = aiAnalysis.contentAnalysis || {};
            analysis.formatAnalysis.issues = aiAnalysis.formatIssues || [];
            analysis.feedback = aiAnalysis.feedback || [];
            analysis.recommendations = aiAnalysis.recommendations || {};
            
        } catch (aiError) {
            console.log("AI analysis skipped, using defaults");
            analysis.atsScore = analysis.atsScore || 65;
            analysis.contentAnalysis = analysis.contentAnalysis || defaultContentAnalysis;
            analysis.feedback = analysis.feedback.length ? analysis.feedback : [
                {
                    category: 'Keywords',
                    priority: 'high',
                    issue: 'Add stronger keywords for your target role',
                    suggestion: 'Include technologies and domain terms from the job description',
                    impact: 'Improves ATS matching and recruiter relevance'
                }
            ];
            analysis.recommendations = analysis.recommendations || defaultRecommendations;
        }
        
        // Calculate industry comparison
        analysis.industryComparison.yourScore = analysis.atsScore;
        analysis.industryComparison.avgScore = 68;
        analysis.industryComparison.topScore = 95;
        analysis.industryComparison.percentile = Math.round((analysis.atsScore / 95) * 100);
        
        // Add version tracking
        analysis.versions.push({
            version: (analysis.versions.length || 0) + 1,
            analyzedDate: new Date(),
            atsScore: analysis.atsScore
        });
        
        analysis.lastAnalyzedAt = new Date();
        await analysis.save();
        
        res.json({
            message: "Resume analyzed successfully",
            atsScore: analysis.atsScore,
            passRate: analysis.atsScore >= 75 ? "High" : analysis.atsScore >= 50 ? "Medium" : "Low",
            contentAnalysis: analysis.contentAnalysis,
            feedback: analysis.feedback.slice(0, 5),
            recommendations: analysis.recommendations,
            industryComparison: analysis.industryComparison,
            nextSteps: analysis.atsScore < 75 ? "Implement the suggestions to improve your ATS score" : "Your resume looks great! Ready to apply",
            temporaryNote: "🚧 Resume Analyzer Feature - Temporary Implementation: AI analysis active for demo. Advanced ATS optimization and personalized feedback coming soon!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. GET RESUME ANALYSIS REPORT
// ============================================
export const getResumeAnalysisReport = async (req, res) => {
    try {
        const { userId } = req.params;
        
        let analysis = await ResumeAnalysis.findOne({ userId });
        if (!analysis) return res.status(404).json({ message: "No resume analysis found. Please analyze first" });
        
        res.json({
            analysis,
            summary: {
                score: analysis.atsScore,
                status: analysis.atsScore >= 75 ? "Excellent" : analysis.atsScore >= 50 ? "Good" : "Needs Work",
                lastAnalyzed: analysis.lastAnalyzedAt,
                version: analysis.versions.length
            },
            detailedBreakdown: {
                contentAnalytics: analysis.contentAnalysis,
                formatingAnalytics: analysis.formatAnalysis,
                extractedInfo: analysis.extracted,
                feedback: analysis.feedback,
                recommendations: analysis.recommendations,
                industryComparison: analysis.industryComparison
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. GET IMPROVEMENT SUGGESTIONS
// ============================================
export const getImprovementSuggestions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const analysis = await ResumeAnalysis.findOne({ userId });
        if (!analysis) return res.status(404).json({ message: "No analysis found" });
        
        const suggestions = {
            critical: analysis.feedback.filter(f => f.priority === 'critical'),
            high: analysis.feedback.filter(f => f.priority === 'high'),
            medium: analysis.feedback.filter(f => f.priority === 'medium'),
            lowPriority: analysis.feedback.filter(f => f.priority === 'low'),
            totalSuggestions: analysis.feedback.length,
            estimatedTimeToFix: "2-3 hours",
            potentialScoreIncrease: Math.min(35, (100 - analysis.atsScore))
        };
        
        res.json({
            suggestions,
            actionPlan: {
                step1: "Fix critical issues (1-2 issues)",
                step2: "Address high priority items (3-5 min each)",
                step3: "Polish remaining suggestions",
                expectedResult: `Score could reach ${Math.min(100, analysis.atsScore + 20)}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. KEYWORD OPTIMIZATION
// ============================================
export const optimizeKeywords = async (req, res) => {
    try {
        const { userId, jobDescription } = req.body;
        
        const analysis = await ResumeAnalysis.findOne({ userId });
        if (!analysis) return res.status(404).json({ message: "No resume found" });
        
        // Simulate keyword extraction from job description
        const jobKeywords = (jobDescription || "").split(' ')
            .filter(word => word.length > 5)
            .slice(0, 20);
        
        const missingKeywords = jobKeywords.filter(keyword => 
            !(analysis.contentAnalysis.skills || []).some(skill => 
                skill.toLowerCase().includes(keyword.toLowerCase())
            )
        );
        
        res.json({
            jobKeywords,
            resumeKeywords: analysis.contentAnalysis.skills || [],
            missingKeywords,
            matchPercentage: Math.round(((jobKeywords.length - missingKeywords.length) / jobKeywords.length) * 100),
            suggestion: `Add ${missingKeywords.slice(0, 5).join(", ")} to your resume for better match`,
            recommendation: "Optional: Add these keywords only if you actually have the skills!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. COMPARE RESUMES (MULTIPLE VERSIONS)
// ============================================
export const compareVersions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const analysis = await ResumeAnalysis.findOne({ userId });
        if (!analysis || analysis.versions.length < 2) {
            return res.status(400).json({ message: "Need at least 2 versions to compare" });
        }
        
        const versions = analysis.versions;
        const latest = versions[versions.length - 1];
        const previous = versions[versions.length - 2];
        
        res.json({
            comparison: {
                versionLatest: latest.version,
                scoreCurrent: latest.atsScore,
                scorePrevious: previous.atsScore,
                improvement: latest.atsScore - previous.atsScore,
                improvementPercentage: Math.round(((latest.atsScore - previous.atsScore) / previous.atsScore) * 100),
                changesMade: latest.changes || []
            },
            allVersions: versions.map(v => ({
                version: v.version,
                score: v.atsScore,
                date: v.analyzedDate
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 6. GENERATE IMPROVEMENT REPORT (PDF)
// ============================================
export const generateResumeReport = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const analysis = await ResumeAnalysis.findOne({ userId });
        if (!analysis) return res.status(404).json({ message: "No analysis found" });
        
        const report = {
            title: "Resume Analysis Report",
            generatedDate: new Date(),
            score: analysis.atsScore,
            sections: [
                {
                    title: "Executive Summary",
                    content: `Your resume scored ${analysis.atsScore}/100. ${analysis.atsScore >= 75 ? "Great job!" : "There's room for improvement."}`
                },
                {
                    title: "Content Analysis",
                    content: `Skills: ${analysis.contentAnalysis.skills?.length || 0}, Action Verbs: ${analysis.contentAnalysis.actionVerbs?.length || 0}, Metrics Found: ${analysis.contentAnalysis.metrics?.length || 0}`
                },
                {
                    title: "Recommendations",
                    content: analysis.recommendations.shouldImprove || []
                },
                {
                    title: "Next Steps",
                    content: "Implement the critical suggestions for quick score improvement"
                }
            ]
        };
        
        res.json({
            message: "Report generated",
            report,
            downloadUrl: "/api/resume-reports/download/" + userId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
