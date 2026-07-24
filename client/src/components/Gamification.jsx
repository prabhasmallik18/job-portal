import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { AppContext } from '../context/AppContext';
import styles from './Gamification.module.css';

const Gamification = ({ userId }) => {
    const { backendUrl } = useContext(AppContext);
    const [profile, setProfile] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        fetchGamificationData();
    }, [userId]);

    const fetchGamificationData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/gamification/dashboard/${userId}`);
            const data = await response.json();
            setProfile(data.profile);
            setLeaderboard(data.leaderboard);
            setBadges(data.badges);
        } catch (error) {
            console.error('Error fetching gamification data:', error);
            // Set temporary demo data
            setProfile({
                name: 'Alex Johnson',
                profileImage: '👤',
                level: 7,
                totalPoints: 4250,
                globalRank: 42,
                rank: 'Opportunity Hunter',
                progressToNextLevel: 65,
                stats: {
                    totalApplications: 45,
                    totalInterviews: 12,
                    totalOffers: 3,
                    applicationStreak: 8
                }
            });
            setLeaderboard([
                { rank: 1, name: 'Sarah Chen', points: 6850, level: 10, badge: '👑' },
                { rank: 2, name: 'Mike Johnson', points: 5420, level: 9, badge: '🥈' },
                { rank: 3, name: 'Emma Davis', points: 5100, level: 8, badge: '🥉' },
                { rank: 4, name: 'You (Alex)', points: 4250, level: 7, badge: '⭐' }
            ]);
            setBadges([
                { name: 'Quick Applicant', description: 'Apply in 5 consecutive days', earned: true, date: '2026-03-28', icon: '🚀' },
                { name: 'Interview Ace', description: 'Complete 5 interviews', earned: true, date: '2026-03-20', icon: '🎯' },
                { name: 'Resume Master', description: 'Achieve 85+ ATS score', earned: true, date: '2026-03-15', icon: '📄' },
                { name: 'Salary Negotiator', description: 'Increase offer by 15%', earned: false, icon: '💰' },
                { name: 'Offer Master', description: 'Receive 3 offers', earned: false, icon: '🏆' }
            ]);
        }
    };

    const getRankColor = (rank) => {
        if (rank === 'Industry Titan') return '#FFD700';
        if (rank === 'Opportunity Hunter') return '#C0C0C0';
        if (rank === 'Job Master') return '#CD7F32';
        return '#6B7280';
    };

    const getLevelGradient = (level) => {
        if (level >= 7) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (level >= 5) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        if (level >= 3) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    };

    if (!profile) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '40px 20px', minHeight: '100vh' }}>
                    <div className={styles.loading}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎮</div>
                        <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading your profile...</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.7 }}>Getting your gaming stats ready!</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
            <div className={styles.header}>
                <h1>🎮 Career Gamification Hub</h1>
                <p>Level up your job search with achievements, badges, and rewards</p>
            </div>

            {/* User Profile Card */}
            <div className={styles.profileCard} style={{ background: getLevelGradient(profile.level) }}>
                <div className={styles.profileContent}>
                    <div className={styles.profileLeft}>
                        <img src={profile.profileImage || '👤'} alt="profile" className={styles.avatar} />
                        <div className={styles.userInfo}>
                            <h2>{profile.name || 'Career Seeker'}</h2>
                            <p className={styles.rank} style={{ color: getRankColor(profile.rank) }}>
                                {profile.rank}
                            </p>
                        </div>
                    </div>
                    <div className={styles.profileRight}>
                        <div className={styles.statBox}>
                            <span className={styles.label}>Level</span>
                            <span className={styles.value}>{profile.level}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.label}>Points</span>
                            <span className={styles.value}>{profile.totalPoints.toLocaleString()}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.label}>Rank</span>
                            <span className={styles.value}>#{profile.globalRank}</span>
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className={styles.levelProgress}>
                    <div className={styles.progressLabel}>Progress to Level {profile.level + 1}</div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${profile.progressToNextLevel}%` }}></div>
                    </div>
                    <span className={styles.progressPercent}>{profile.progressToNextLevel}%</span>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'badges' ? styles.active : ''}`}
                    onClick={() => setActiveTab('badges')}
                >
                    🏆 Badges ({badges.length})
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'leaderboard' ? styles.active : ''}`}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    📈 Leaderboard
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'challenges' ? styles.active : ''}`}
                    onClick={() => setActiveTab('challenges')}
                >
                    🎯 Challenges
                </button>
            </div>

            {activeTab === 'dashboard' && (
                <div className={styles.content}>
                    {/* Achievements Overview */}
                    <div className={styles.achievementsGrid}>
                        <div className={styles.achieveCard}>
                            <span className={styles.icon}>📤</span>
                            <span className={styles.label}>Applications</span>
                            <span className={styles.count}>{profile.stats.totalApplications}</span>
                        </div>
                        <div className={styles.achieveCard}>
                            <span className={styles.icon}>🎤</span>
                            <span className={styles.label}>Interviews</span>
                            <span className={styles.count}>{profile.stats.totalInterviews}</span>
                        </div>
                        <div className={styles.achieveCard}>
                            <span className={styles.icon}>🎉</span>
                            <span className={styles.label}>Offers</span>
                            <span className={styles.count}>{profile.stats.totalOffers}</span>
                        </div>
                        <div className={styles.achieveCard}>
                            <span className={styles.icon}>🔥</span>
                            <span className={styles.label}>Streak</span>
                            <span className={styles.count}>{profile.stats.applicationStreak} days</span>
                        </div>
                    </div>

                    {/* Streak Section */}
                    <div className={styles.streakSection}>
                        <h3>🔥 Your Streak</h3>
                        <div className={styles.streakInfo}>
                            <div className={styles.streakStat}>
                                <span>Current Streak</span>
                                <strong>{profile.stats.applicationStreak}</strong>
                            </div>
                            <div className={styles.streakStat}>
                                <span>Longest Streak</span>
                                <strong>{profile.stats.longestStreak}</strong>
                            </div>
                        </div>
                        <p className={styles.streakTip}>💡 Keep applying daily to build your streak!</p>
                    </div>

                    {/* Referral Section */}
                    <div className={styles.referralSection}>
                        <h3>🤝 Referral Program</h3>
                        <div className={styles.referralCode}>
                            <span>Your Code:</span>
                            <code>{profile.stats.referralCode}</code>
                            <button className={styles.copyBtn}>📋 Copy</button>
                        </div>
                        <div className={styles.referralStats}>
                            <div className={styles.refStat}>
                                <span>Successful Referrals</span>
                                <strong>{profile.referralStats.successfulReferrals}</strong>
                            </div>
                            <div className={styles.refStat}>
                                <span>Bonus Earned</span>
                                <strong>+{profile.referralStats.referralBonus} pts</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'badges' && (
                <div className={styles.content}>
                    <div className={styles.badgesGrid}>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>📝</span>
                            <h4>First Application</h4>
                            <p>Apply to your first job</p>
                            <span className={styles.status}>🔓 Unlocked</span>
                        </div>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>⭐</span>
                            <h4>Application Master</h4>
                            <p>Apply to 10 jobs</p>
                            <span className={styles.status}>{profile.stats.totalApplications >= 10 ? '🔓 Unlocked' : '🔒 Locked'}</span>
                        </div>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>🎤</span>
                            <h4>Interview Warrior</h4>
                            <p>Complete 5 interviews</p>
                            <span className={styles.status}>{profile.stats.totalInterviews >= 5 ? '🔓 Unlocked' : '🔒 Locked'}</span>
                        </div>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>👤</span>
                            <h4>Profile Master</h4>
                            <p>100% profile completion</p>
                            <span className={styles.status}>{profile.achievements.profileCompletion >= 100 ? '🔓 Unlocked' : '🔒 Locked'}</span>
                        </div>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>🎉</span>
                            <h4>Deal Closed</h4>
                            <p>Accept a job offer</p>
                            <span className={styles.status}>{profile.stats.totalOffers >= 1 ? '🔓 Unlocked' : '🔒 Locked'}</span>
                        </div>
                        <div className={styles.badgeCard}>
                            <span className={styles.badgeIcon}>🔥</span>
                            <h4>On Fire</h4>
                            <p>3-day application streak</p>
                            <span className={styles.status}>{profile.stats.applicationStreak >= 3 ? '🔓 Unlocked' : '🔒 Locked'}</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'leaderboard' && (
                <div className={styles.content}>
                    <div className={styles.leaderboard}>
                        <h2>🏆 Global Leaderboard</h2>
                        <div className={styles.leaderboardTable}>
                            {leaderboard.map((player, idx) => (
                                <div key={idx} className={`${styles.leaderboardRow} ${idx < 3 ? styles[`rank${idx + 1}`] : ''}`}>
                                    <span className={styles.rank}>#{idx + 1}</span>
                                    <span className={styles.rankMedal}>
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}
                                    </span>
                                    <span className={styles.name}>{player.name}</span>
                                    <span className={styles.level}>Lvl {player.level}</span>
                                    <span className={styles.points}>{player.points.toLocaleString()} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.yourRank}>
                        <h3>📍 Your Position</h3>
                        <div className={styles.rankInfo}>
                            <p>Global Rank: <strong>#{profile.stats.globalRank}</strong></p>
                            <p>Points to Top 10: <strong>{(1000 - profile.stats.totalPoints).toLocaleString()}</strong></p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'challenges' && (
                <div className={styles.content}>
                    <div className={styles.challengesSection}>
                        <h2>🎯 Daily Challenges</h2>
                        <div className={styles.challengesList}>
                            <div className={styles.challenge}>
                                <div className={styles.challengeMark}>✓</div>
                                <div className={styles.challengeInfo}>
                                    <h4>Apply to a Job</h4>
                                    <p>Apply to at least one job today</p>
                                </div>
                                <div className={styles.reward}>+10 pts</div>
                            </div>

                            <div className={styles.challenge}>
                                <div className={styles.challengeMark}>✓</div>
                                <div className={styles.challengeInfo}>
                                    <h4>Complete Profile</h4>
                                    <p>Fill in all profile sections</p>
                                </div>
                                <div className={styles.reward}>+50 pts</div>
                            </div>

                            <div className={styles.challenge}>
                                <div className={styles.challengeMark}>✓</div>
                                <div className={styles.challengeInfo}>
                                    <h4>Practice Interview</h4>
                                    <p>Do one mock interview session</p>
                                </div>
                                <div className={styles.reward}>+100 pts</div>
                            </div>

                            <div className={styles.challenge}>
                                <div className={styles.challengeMark}>✓</div>
                                <div className={styles.challengeInfo}>
                                    <h4>Update Resume</h4>
                                    <p>Upload or update your resume</p>
                                </div>
                                <div className={styles.reward}>+30 pts</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default Gamification;
