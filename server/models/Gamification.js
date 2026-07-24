import mongoose from "mongoose";

const gamificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // 🔹 Points System
    totalPoints: { type: Number, default: 0 },
    pointsHistory: [{
        action: String, // e.g., 'job_applied', 'profile_completed', 'interview_completed'
        points: Number,
        date: { type: Date, default: Date.now },
        description: String
    }],
    
    // 🔹 Achievements & Badges
    badges: [{
        badgeId: String,
        name: String, // e.g., "First Application", "Interview Master"
        description: String,
        icon: String, // URL or emoji
        unlockedDate: Date,
        tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' }
    }],
    
    // 🔹 Streaks
    applicationStreak: { type: Number, default: 0 }, // Consecutive days applying
    longestStreak: { type: Number, default: 0 },
    lastApplicationDate: Date,
    
    // 🔹 Levels & Ranking
    level: { type: Number, default: 1 },
    rank: String, // "Job Seeker", "Career Builder", "Master Hunter"
    progressToNextLevel: { type: Number, default: 0 }, // % progress to next level
    
    // 🔹 Leaderboard Info
    globalRank: Number,
    cityRank: Number,
    skillRank: { type: Map, of: Number }, // Rank by skill
    
    // 🔹 Achievements Breakdown
    achievements: {
        totalApplications: { type: Number, default: 0 },
        totalInterviews: { type: Number, default: 0 },
        totalOffers: { type: Number, default: 0 },
        profileCompletion: { type: Number, default: 0 }, // %
        resumeUploads: { type: Number, default: 0 },
        skillsAdded: { type: Number, default: 0 },
        jobsSaved: { type: Number, default: 0 },
        companiesFollowed: { type: Number, default: 0 }
    },
    
    // 🔹 Specific Badges Available
    availableBadges: [
        {
            badgeType: String,
            name: String,
            requirement: String,
            isUnlocked: Boolean,
            progress: Number // % towards unlock
        }
    ],
    
    // 🔹 Special Achievements
    specialAchievements: [{
        achievementName: String,
        achievedDate: Date,
        rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
        description: String
    }],
    
    // 🔹 Daily/Weekly Challenges
    dailyChallenges: [{
        challengeId: String,
        name: String,
        description: String,
        reward: Number, // points
        isCompleted: Boolean,
        completedDate: Date,
        endsAt: Date
    }],
    
    // 🔹 Referral Program
    referralCode: { type: String, unique: true },
    referralStats: {
        totalReferrals: { type: Number, default: 0 },
        successfulReferrals: { type: Number, default: 0 },
        referralBonus: { type: Number, default: 0 }
    },
    
    // 🔹 Tier Progression
    tiers: {
        currentTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'], default: 'bronze' },
        tierBenefits: [String] // What they get in this tier
    },
    
    updatedAt: { type: Date, default: Date.now }
});

const Gamification = mongoose.model('Gamification', gamificationSchema);
export default Gamification;
