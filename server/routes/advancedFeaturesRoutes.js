import express from "express";
import {
    calculateProfileStrength,
    getJobRecommendations,
    getSkillGap,
    getApplicationAnalytics,
    generateInterviewQuestions,
    updateUserProfile
} from "../controllers/advancedFeaturesController.js";

const router = express.Router();

// Profile Strength
router.get("/profile-strength/:userId", calculateProfileStrength);

// Job Recommendations
router.get("/recommendations/:userId", getJobRecommendations);

// Skill Gap Analysis
router.get("/skill-gap/:userId/:jobId", getSkillGap);

// Application Analytics
router.get("/analytics/:userId", getApplicationAnalytics);

// Interview Prep
router.get("/interview-questions/:userId/:jobId", generateInterviewQuestions);

// Update User Profile
router.patch("/update-profile/:userId", updateUserProfile);

export default router;
