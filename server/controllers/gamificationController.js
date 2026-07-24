import Gamification from "../models/Gamification.js";
import User from "../models/User.js";
import ApplicationTracker from "../models/ApplicationTracker.js";

// ============================================
// 1. INITIALIZE GAMIFICATION FOR USER
// ============================================
export const initializeGamification = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // TEMPORARY: Gamification feature is under development.
        // Currently showing basic points system. Full rewards, badges, and leaderboards coming soon!
        const tempMessage = "🚧 Gamification Feature - Temporary Implementation: Basic points tracking active. Advanced rewards, achievements, and social features coming soon!";
        
        let gamification = await Gamification.findOne({ userId });
        
        if (!gamification) {
            const referralCode = `REF_${userId.slice(-6)}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
            
            gamification = new Gamification({
                userId,
                referralCode,
                totalPoints: 0,
                badges: [],
                applicationStreak: 0,
                level: 1,
                rank: "Job Seeker"
            });
            
            await gamification.save();
        }
        
        res.json({
            message: "Gamification profile created",
            profile: {
                userId,
                level: gamification.level,
                totalPoints: gamification.totalPoints,
                rank: gamification.rank,
                referralCode: gamification.referralCode
            },
            temporaryNote: tempMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. AWARD POINTS FOR ACTIONS
// ============================================
export const awardPoints = async (req, res) => {
    try {
        const { userId, action, description } = req.body;
        
        const gamification = await Gamification.findOne({ userId });
        if (!gamification) return res.status(404).json({ message: "User not in gamification system" });
        
        // Define points for each action
        const pointsMap = {
            'job_applied': 10,
            'profile_completed': 50,
            'resume_uploaded': 30,
            'skill_added': 15,
            'interview_completed': 100,
            'job_saved': 5,
            'job_application_status_updated': 20,
            'offer_received': 200,
            'offer_accepted': 300,
            'referral_success': 500,
            'profile_viewed': 5
        };
        
        const points = pointsMap[action] || 10;
        
        gamification.totalPoints += points;
        gamification.pointsHistory.push({
            action,
            points,
            description: description || `Earned ${points} points for ${action}`,
            date: new Date()
        });
        
        // Check for level up
        const levelThresholds = {
            1: 0,
            2: 100,
            3: 300,
            4: 600,
            5: 1000,
            6: 1500,
            7: 2000,
            8: 2500,
            9: 3000,
            10: 4000
        };
        
        for (let level = 10; level >= 1; level--) {
            if (gamification.totalPoints >= levelThresholds[level]) {
                gamification.level = level;
                gamification.progressToNextLevel = Math.round(
                    ((gamification.totalPoints - levelThresholds[level]) / 
                    (levelThresholds[level + 1] - levelThresholds[level])) * 100
                );
                break;
            }
        }
        
        // Update rank based on level
        gamification.rank = gamification.level <= 2 ? "Job Seeker" 
            : gamification.level <= 4 ? "Career Climber"
            : gamification.level <= 6 ? "Job Master"
            : gamification.level <= 8 ? "Opportunity Hunter"
            : "Industry Titan";
        
        // Check for badge unlock
        await checkBadges(gamification);
        
        await gamification.save();
        
        res.json({
            message: `+${points} points earned!`,
            totalPoints: gamification.totalPoints,
            level: gamification.level,
            rank: gamification.rank,
            progressToNextLevel: gamification.progressToNextLevel,
            leveledUp: false // Can be true if level changed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. GET GAMIFICATION DASHBOARD
// ============================================
export const getGamificationDashboard = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const gamification = await Gamification.findOne({ userId });
        if (!gamification) return res.status(404).json({ message: "No gamification profile found" });
        
        const user = await User.findById(userId);
        
        // Fetch global leaderboard (top 10)
        const leaderboard = await Gamification.find()
            .sort({ totalPoints: -1 })
            .limit(10)
            .populate('userId', 'name image');
        
        // Find user's global rank
        const globalRank = await Gamification.countDocuments({ totalPoints: { $gt: gamification.totalPoints } }) + 1;
        
        // Calculate streak
        const applications = await ApplicationTracker.find({ userId }).sort({ applicationDate: -1 });
        let streak = 0;
        if (applications.length > 0) {
            const today = new Date().setHours(0, 0, 0, 0);
            const lastAppDate = new Date(applications[0].applicationDate).setHours(0, 0, 0, 0);
            if (today === lastAppDate) {
                const daysDiff = (lastAppDate - today) / (1000 * 60 * 60 * 24);
                if (Math.abs(daysDiff) <= 1) streak = 1;
            }
        }
        
        gamification.applicationStreak = Math.max(gamification.applicationStreak, streak);
        
        // Unlocked badges
        const unlockedBadges = gamification.badges.filter(b => b.unlockedDate);
        const totalBadges = 15; // Total available badges
        
        // Calculate daily challenge progress
        const today = new Date().toDateString();
        const todayChallenges = gamification.dailyChallenges.filter(c => 
            new Date(c.endsAt).toDateString() === today
        );
        
        res.json({
            profile: {
                name: user?.name,
                level: gamification.level,
                rank: gamification.rank,
                totalPoints: gamification.totalPoints,
                profileImage: user?.image
            },
            stats: {
                totalPoints: gamification.totalPoints,
                level: gamification.level,
                progressToNextLevel: gamification.progressToNextLevel,
                globalRank: globalRank,
                applicationStreak: gamification.applicationStreak,
                longestStreak: gamification.longestStreak,
                badgesUnlocked: unlockedBadges.length,
                totalBadgesAvailable: totalBadges,
                referralCode: gamification.referralCode
            },
            achievements: {
                totalApplications: gamification.achievements.totalApplications,
                totalInterviews: gamification.achievements.totalInterviews,
                totalOffers: gamification.achievements.totalOffers,
                profileCompletion: gamification.achievements.profileCompletion
            },
            badges: unlockedBadges.map(b => ({
                name: b.name,
                icon: b.icon,
                unlockedDate: b.unlockedDate,
                description: b.description
            })),
            leaderboard: leaderboard.map((g, idx) => ({
                rank: idx + 1,
                name: g.userId?.name || 'Anonymous',
                level: g.level,
                points: g.totalPoints,
                badge: "🏆"
            })),
            dailyChallenges: todayChallenges.slice(0, 3),
            referralStats: gamification.referralStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. GET LEADERBOARD
// ============================================
export const getLeaderboard = async (req, res) => {
    try {
        const { timeframe = 'all', limit = 20 } = req.query;
        
        const sortBy = timeframe === 'weekly' ? { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } : {};
        
        const leaderboard = await Gamification.find(sortBy)
            .sort({ totalPoints: -1, level: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'name image');
        
        res.json({
            leaderboard: leaderboard.map((g, idx) => ({
                rank: idx + 1,
                name: g.userId?.name || 'Anonymous',
                level: g.level,
                points: g.totalPoints,
                rank_title: g.rank,
                badgesCount: g.badges?.length || 0,
                image: g.userId?.image
            })),
            timeframe,
            totalPlayers: await Gamification.countDocuments()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. UNLOCK ACHIEVEMENT/BADGE
// ============================================
export const unlockBadge = async (req, res) => {
    try {
        const { userId, badgeType } = req.body;
        
        const gamification = await Gamification.findOne({ userId });
        if (!gamification) return res.status(404).json({ message: "User not found" });
        
        const badgeDefinitions = {
            'first_application': { name: "First Step", description: "Applied to your first job", icon: "🎯" },
            'application_master': { name: "Application Master", description: "Applied to 10 jobs", icon: "📝" },
            'interview_warrior': { name: "Interview Warrior", description: "Completed 5 interviews", icon: "🎤" },
            'profile_complete': { name: "Profile Master", description: "100% profile completion", icon: "👤" },
            'offer_accepted': { name: "Deal Closed", description: "Accepted a job offer", icon: "✅" },
            'three_day_streak': { name: "On Fire", description: "3-day application streak", icon: "🔥" },
            'referral_master': { name: "Network Hub", description: "Made 3 successful referrals", icon: "🤝" }
        };
        
        const badgeDef = badgeDefinitions[badgeType];
        if (!badgeDef) return res.status(400).json({ message: "Invalid badge type" });
        
        // Check if already unlocked
        const existing = gamification.badges.find(b => b.badgeId === badgeType);
        if (existing && existing.unlockedDate) {
            return res.json({ message: "Badge already unlocked", badge: existing });
        }
        
        const badge = {
            badgeId: badgeType,
            ...badgeDef,
            unlockedDate: new Date(),
            tier: 'bronze'
        };
        
        gamification.badges.push(badge);
        gamification.totalPoints += 50; // Bonus points for badge
        
        await gamification.save();
        
        res.json({
            message: "Badge unlocked!",
            badge,
            bonus: "+50 points",
            totalPoints: gamification.totalPoints
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 6. UPDATE DAILY CHALLENGE
// ============================================
export const updateDailyChallenge = async (req, res) => {
    try {
        const { userId, challengeId } = req.body;
        
        const gamification = await Gamification.findOne({ userId });
        if (!gamification) return res.status(404).json({ message: "User not found" });
        
        const challenge = gamification.dailyChallenges.find(c => c.challengeId === challengeId);
        if (!challenge) return res.status(404).json({ message: "Challenge not found" });
        
        challenge.isCompleted = true;
        challenge.completedDate = new Date();
        
        gamification.totalPoints += challenge.reward;
        
        await gamification.save();
        
        res.json({
            message: "Challenge completed!",
            reward: `+${challenge.reward} points`,
            totalPoints: gamification.totalPoints
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 7. REFERRAL SYSTEM
// ============================================
export const applyReferralCode = async (req, res) => {
    try {
        const { userId, referralCode } = req.body;
        
        // Find who referred this user
        const referrer = await Gamification.findOne({ referralCode });
        if (!referrer) return res.status(404).json({ message: "Invalid referral code" });
        
        const referred = await Gamification.findOne({ userId });
        if (!referred) return res.status(404).json({ message: "User not found" });
        
        // Award both parties
        referrer.referralStats.totalReferrals += 1;
        referrer.referralStats.successfulReferrals += 1;
        referrer.totalPoints += 500;
        referrer.pointsHistory.push({
            action: 'referral_success',
            points: 500,
            description: 'Successful referral bonus',
            date: new Date()
        });
        
        referred.totalPoints += 200;
        referred.pointsHistory.push({
            action: 'referral_bonus',
            points: 200,
            description: 'Joined via referral',
            date: new Date()
        });
        
        await referrer.save();
        await referred.save();
        
        res.json({
            message: "Referral applied successfully",
            youEarned: "+200 points",
            referrerEarned: "+500 points"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// HELPER FUNCTION: Check & Unlock Badges
// ============================================
async function checkBadges(gamification) {
    const badges = {
        'application_master': () => gamification.achievements.totalApplications >= 10,
        'interview_warrior': () => gamification.achievements.totalInterviews >= 5,
        'profile_complete': () => gamification.achievements.profileCompletion >= 100,
        'offer_accepted': () => gamification.achievements.totalOffers >= 1,
        'three_day_streak': () => gamification.applicationStreak >= 3
    };
    
    for (const [badgeId, condition] of Object.entries(badges)) {
        if (condition() && !gamification.badges.find(b => b.badgeId === badgeId && b.unlockedDate)) {
            const badgeDefinitions = {
                'application_master': { name: "Application Master", icon: "📝" },
                'interview_warrior': { name: "Interview Warrior", icon: "🎤" },
                'profile_complete': { name: "Profile Master", icon: "👤" },
                'offer_accepted': { name: "Deal Closed", icon: "✅" },
                'three_day_streak': { name: "On Fire", icon: "🔥" }
            };
            
            const badgeDef = badgeDefinitions[badgeId];
            gamification.badges.push({
                badgeId,
                ...badgeDef,
                unlockedDate: new Date(),
                description: `Unlocked for achieving ${badgeId}`,
                tier: 'silver'
            });
        }
    }
}

export default {
    initializeGamification,
    awardPoints,
    getGamificationDashboard,
    getLeaderboard,
    unlockBadge,
    updateDailyChallenge,
    applyReferralCode
};
