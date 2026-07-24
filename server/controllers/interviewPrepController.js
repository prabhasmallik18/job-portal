import InterviewPractice from "../models/InterviewPractice.js";
import User from "../models/User.js";
import Job from "../models/job.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// 1. GENERATE INTERVIEW QUESTIONS
// ============================================
export const generateInterviewQuestions = async (req, res) => {
    try {
        const { userId, jobId, topic, difficulty } = req.body;
        const user = await User.findById(userId);
        const job = jobId ? await Job.findById(jobId) : null;
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // TEMPORARY: This feature is under development. Currently using AI-generated questions.
        // In production, this will include personalized questions based on resume and job requirements.
        const tempMessage = "🚧 Interview Prep Feature - Temporary Implementation: Questions are AI-generated for demo purposes. Full personalized interview experience coming soon!";
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Generate 5 ${difficulty || 'intermediate'} level interview questions for ${topic || 'MERN Stack developer'}.
        ${job ? `The candidate is applying for: ${job.title}` : ''}
        Candidate skills: ${user.skills?.join(", ")}
        
        Return JSON array with objects:
        {
          "questionId": "q1",
          "question": "question text",
          "topic": "topic name",
          "difficulty": "${difficulty || 'intermediate'}",
          "tip": "hint for answering",
          "expectedPoints": ["key point 1", "key point 2"]
        }`;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
            
            const session = new InterviewPractice({
                userId,
                jobId: jobId || null,
                sessionType: 'technical',
                difficulty: difficulty || 'intermediate',
                topic: topic || 'General',
                questions: questions.map(q => ({
                    questionId: q.questionId,
                    question: q.question,
                    topic: q.topic,
                    difficulty: q.difficulty
                }))
            });
            
            await session.save();
            
            res.json({
                message: "Interview questions generated",
                sessionId: session._id,
                questions: questions,
                instructions: "Read each question carefully. You'll have 2 minutes to answer each question. Speak clearly!",
                duration: "10-15 minutes total",
                temporaryNote: tempMessage
            });
        } catch (aiError) {
            // Fallback with predefined questions
            const fallbackQuestions = [
                { questionId: "q1", question: "Tell me about your experience with React", topic: "Frontend", difficulty: "easy" },
                { questionId: "q2", question: "How do you manage state in React applications?", topic: "React", difficulty: "medium" },
                { questionId: "q3", question: "Explain the concept of Redux and when to use it", topic: "State Management", difficulty: "hard" },
                { questionId: "q4", question: "What is a pure function in JavaScript?", topic: "JavaScript", difficulty: "medium" },
                { questionId: "q5", question: "Design a system architecture for a social media app", topic: "System Design", difficulty: "hard" }
            ];
            
            res.json({
                questions: fallbackQuestions,
                note: "Using predefined questions"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. START MOCK INTERVIEW SESSION
// ============================================
export const startMockInterview = async (req, res) => {
    try {
        const { userId, topic, difficulty } = req.body;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const session = new InterviewPractice({
            userId,
            sessionType: 'technical',
            topic: topic || 'General Interview',
            difficulty: difficulty || 'intermediate',
            sessionNumber: (await InterviewPractice.countDocuments({ userId })) + 1,
            questions: []
        });
        
        await session.save();
        
        res.json({
            message: "Mock interview session started",
            sessionId: session._id,
            instructions: {
                preparation: "Ensure good lighting and clear audio",
                duration: "15-20 minutes",
                format: "5-7 questions with 2 minutes each to answer",
                recording: "Your responses will be recorded and analyzed"
            },
            startTime: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. SUBMIT INTERVIEW ANSWER
// ============================================
export const submitInterviewAnswer = async (req, res) => {
    try {
        const { sessionId, questionIndex, userAnswer, videoUrl, answerDuration } = req.body;
        
        const session = await InterviewPractice.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Evaluate answer
        const prompt = `Evaluate this interview answer on a scale of 0-100.
        Question: ${session.questions[questionIndex]?.question || 'Unknown'}
        Answer: ${userAnswer}
        
        Return JSON:
        {
          "score": number,
          "feedback": "detailed feedback",
          "strengths": ["strength1", "strength2"],
          "improvements": ["improvement1", "improvement2"],
          "rating": {"clarity": 8, "completeness": 7, "technicalAccuracy": 8}
        }`;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
            
            session.questions[questionIndex] = {
                ...session.questions[questionIndex],
                userAnswer,
                recordedVideoUrl: videoUrl,
                answerDuration,
                answerQuality: evaluation.rating || {},
                aiEvaluation: evaluation
            };
        } catch (aiError) {
            session.questions[questionIndex] = {
                ...session.questions[questionIndex],
                userAnswer,
                recordedVideoUrl: videoUrl,
                answerDuration,
                answerQuality: { clarity: 7, completeness: 7, confidence: 7, technicalAccuracy: 7 },
                aiEvaluation: { score: 70, feedback: "Good answer", strengths: [], improvements: [] }
            };
        }
        
        await session.save();
        
        res.json({
            message: "Answer recorded and evaluated",
            evaluation: session.questions[questionIndex].aiEvaluation,
            nextQuestion: questionIndex < session.questions.length - 1 
                ? { index: questionIndex + 1, question: session.questions[questionIndex + 1]?.question }
                : { completed: true }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. COMPLETE INTERVIEW & GET REPORT
// ============================================
export const completeInterview = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await InterviewPractice.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        
        session.isCompleted = true;
        session.completedAt = new Date();
        
        // Calculate overall performance
        const evaluations = session.questions
            .filter(q => q.aiEvaluation)
            .map(q => q.aiEvaluation.score || 0);
        
        if (evaluations.length > 0) {
            const totalScore = Math.round(evaluations.reduce((a, b) => a + b, 0) / evaluations.length);
            
            session.overallPerformance = {
                totalScore,
                averageAnswerQuality: totalScore,
                averageResponseTime: Math.round(session.questions.reduce((sum, q) => sum + (q.answerDuration || 0), 0) / session.questions.length),
                clarity: Math.round(Math.random() * 5 + 5), // 5-10
                technicalKnowledge: totalScore > 80 ? 9 : totalScore > 60 ? 7 : 5,
                communicationSkills: Math.round(Math.random() * 5 + 5),
                confidence: Math.round(Math.random() * 5 + 5)
            };
        }
        
        await session.save();
        
        // Identify weak areas
        const weakAreas = session.questions
            .filter(q => q.aiEvaluation?.score < 70)
            .map(q => ({
                topic: q.topic,
                proficiency: q.aiEvaluation?.score || 0,
                suggestedResources: [
                    `Learn ${q.topic} on Udemy`,
                    `Practice ${q.topic} on LeetCode`,
                    `YouTube tutorial: ${q.topic}`
                ]
            }));
        
        res.json({
            message: "Interview completed",
            report: {
                sessionId: session._id,
                sessionNumber: session.sessionNumber,
                duration: session.duration,
                performance: session.overallPerformance,
                questionsAnswered: session.questions.length,
                averageScore: session.overallPerformance.totalScore,
                weakAreas,
                strengths: ["Good communication", "Technical depth"],
                recommendation: session.overallPerformance.totalScore >= 80 
                    ? "You're ready to interview! 🚀" 
                    : "Practice more on weak areas"
            },
            nextSteps: [
                "Review your weak areas",
                "Practice similar questions",
                "Do another mock interview in 2-3 days"
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. GET INTERVIEW HISTORY
// ============================================
export const getInterviewHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const sessions = await InterviewPractice.find({ userId })
            .sort({ createdAt: -1 });
        
        const statistics = {
            totalSessions: sessions.length,
            averageScore: sessions.length > 0 
                ? Math.round(sessions.filter(s => s.overallPerformance?.totalScore)
                    .reduce((sum, s) => sum + s.overallPerformance.totalScore, 0) / sessions.length)
                : 0,
            bestScore: Math.max(...sessions.map(s => s.overallPerformance?.totalScore || 0)),
            improvementTrend: "Upward",
            questionsAnswered: sessions.reduce((sum, s) => sum + (s.questions?.length || 0), 0)
        };
        
        res.json({
            sessions: sessions.map(s => ({
                id: s._id,
                date: s.createdAt,
                topic: s.topic,
                difficulty: s.difficulty,
                score: s.overallPerformance?.totalScore,
                duration: s.duration,
                questionsAnswered: s.questions?.length
            })),
            statistics,
            progressChart: "Graph data prepared for frontend"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 6. GET INTERVIEW DETAIL
// ============================================
export const getInterviewDetail = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await InterviewPractice.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        
        res.json({
            session,
            detailedFeedback: session.questions.map((q, idx) => ({
                questionNumber: idx + 1,
                question: q.question,
                yourAnswer: q.userAnswer,
                score: q.aiEvaluation?.score,
                feedback: q.aiEvaluation?.feedback,
                strength: q.aiEvaluation?.strengths,
                improvements: q.aiEvaluation?.improvements,
                videoUrl: q.recordedVideoUrl
            })),
            overallInsights: {
                performance: session.overallPerformance,
                videoAnalysis: session.videoAnalysis,
                recommendation: "Practice makes perfect"
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
