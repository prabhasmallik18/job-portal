import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserAuthContext } from '../context/UserAuthContext';
import styles from './AdvancedFeaturesShowcase.module.css';

const AdvancedFeaturesShowcase = () => {
  const { user, userToken } = useContext(UserAuthContext);

  // Only show if user is logged in
  if (!user || !userToken) {
    return null;
  }

  const features = [
    {
      id: 'application-tracker',
      title: 'Application Tracker',
      description: 'Track all your job applications with AI-powered analytics and insights',
      icon: '📊',
      color: '#3B82F6',
      benefits: ['Real-time status updates', 'Success rate analysis', 'Interview scheduling', 'Offer comparison', 'Performance insights']
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      description: 'Get AI-powered feedback on your resume with ATS optimization',
      icon: '📄',
      color: '#10B981',
      benefits: ['ATS score calculation', 'Content analysis', 'Keyword optimization', 'Industry benchmarking', 'Improvement suggestions']
    },
    {
      id: 'interview-prep',
      title: 'Interview Prep',
      description: 'Practice with AI-generated questions and get real-time feedback',
      icon: '🎤',
      color: '#F59E0B',
      benefits: ['Mock interviews', 'Video recording', 'Performance analysis', 'Question generation', 'Personalized feedback']
    },
    {
      id: 'salary-negotiator',
      title: 'Salary Negotiator',
      description: 'Market intelligence for salary negotiation and offer analysis',
      icon: '💰',
      color: '#EF4444',
      benefits: ['Market data analysis', 'Offer comparison', 'Negotiation strategy', 'Cost of living adjustment', 'Benefits analysis']
    },
    {
      id: 'gamification',
      title: 'Gamification',
      description: 'Earn points, unlock badges, and climb the leaderboard',
      icon: '🎮',
      color: '#8B5CF6',
      benefits: ['Points system', 'Achievement badges', 'Leaderboards', 'Referral program', 'Exclusive rewards']
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🚀 Advanced Features</h2>
        <p>Supercharge your job search with our enterprise-grade tools</p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={`/${feature.id}`}
            className={styles.featureCard}
            style={{ '--accent-color': feature.color }}
          >
            <div className={styles.featureIcon}>
              {feature.icon}
            </div>
            <div className={styles.featureContent}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className={styles.benefitsList}>
                {feature.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className={styles.featureAction}>
              <span>Try Now →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>5000+</div>
          <div className={styles.statLabel}>Active Users</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>95%</div>
          <div className={styles.statLabel}>Success Rate</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>AI Support</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesShowcase;