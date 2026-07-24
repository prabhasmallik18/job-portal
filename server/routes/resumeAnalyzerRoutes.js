import express from 'express';
import {
    analyzeResume,
    getResumeAnalysisReport,
    getImprovementSuggestions,
    optimizeKeywords,
    compareVersions,
    generateResumeReport
} from '../controllers/resumeAnalyzerController.js';

const router = express.Router();

// Resume Analysis Routes
router.post('/analyze', analyzeResume);
router.get('/report/:userId', getResumeAnalysisReport);
router.get('/suggestions/:userId', getImprovementSuggestions);
router.post('/keywords', optimizeKeywords);
router.get('/versions/:userId', compareVersions);
router.get('/generate-report/:userId', generateResumeReport);

export default router;
