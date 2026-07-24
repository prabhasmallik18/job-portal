import express from 'express';
import {
    generateInterviewQuestions,
    startMockInterview,
    submitInterviewAnswer,
    completeInterview,
    getInterviewHistory,
    getInterviewDetail
} from '../controllers/interviewPrepController.js';

const router = express.Router();

// Interview Prep Routes
router.post('/generate-questions', generateInterviewQuestions);
router.post('/start-session', startMockInterview);
router.post('/submit-answer', submitInterviewAnswer);
router.put('/complete/:sessionId', completeInterview);
router.get('/history/:userId', getInterviewHistory);
router.get('/detail/:sessionId', getInterviewDetail);

export default router;
