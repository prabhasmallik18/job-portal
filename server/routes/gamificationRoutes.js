import express from 'express';
import {
    initializeGamification,
    awardPoints,
    getGamificationDashboard,
    getLeaderboard,
    unlockBadge,
    updateDailyChallenge,
    applyReferralCode
} from '../controllers/gamificationController.js';

const router = express.Router();

// Gamification Routes
router.post('/initialize', initializeGamification);
router.post('/award-points', awardPoints);
router.get('/dashboard/:userId', getGamificationDashboard);
router.get('/leaderboard', getLeaderboard);
router.post('/unlock-badge', unlockBadge);
router.post('/complete-challenge', updateDailyChallenge);
router.post('/apply-referral', applyReferralCode);

export default router;
