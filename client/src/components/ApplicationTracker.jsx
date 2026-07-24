import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { AppContext } from '../context/AppContext';
import styles from './ApplicationTracker.module.css';

const ApplicationTracker = ({ userId }) => {
    const { backendUrl } = useContext(AppContext);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchApplicationDashboard();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchApplicationDashboard = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/applications/dashboard/${userId}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.stats && data.applications) {
                setStats(data.stats);
                setApplications(data.applications || []);
            } else {
                throw new Error('Invalid response structure');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            // Set temporary demo data
            setStats({
                total: 12,
                successRate: 65,
                avgResponseTime: 4,
                recentApplicationsCount: 5,
                applied: 7,
                shortlisted: 3,
                interviewScheduled: 2,
                offerReceived: 1,
                topCompanies: [
                    { name: '🚀 TechVision Solutions', count: 3 },
                    { name: '💻 CloudSync Systems', count: 2 },
                    { name: '🎯 DataDrive Analytics', count: 2 }
                ]
            });
            setApplications([
                {
                    id: 1,
                    jobTitle: 'Senior Full Stack Developer',
                    company: 'TechVision Solutions',
                    applicationDate: new Date(Date.now() - 3*24*60*60*1000),
                    responseTime: 3,
                    applicationScore: 88,
                    status: 'interview_scheduled'
                },
                {
                    id: 2,
                    jobTitle: 'React Developer', 
                    company: 'CloudSync Systems',
                    applicationDate: new Date(Date.now() - 5*24*60*60*1000),
                    responseTime: 5,
                    applicationScore: 92,
                    status: 'shortlisted'
                },
                {
                    id: 3,
                    jobTitle: 'Node.js Backend Engineer',
                    company: 'DataDrive Analytics',
                    applicationDate: new Date(Date.now() - 7*24*60*60*1000),
                    responseTime: null,
                    applicationScore: 78,
                    status: 'applied'
                },
                {
                    id: 4,
                    jobTitle: 'Full Stack Developer',
                    company: 'TechVision Solutions',
                    applicationDate: new Date(Date.now() - 10*24*60*60*1000),
                    responseTime: 8,
                    applicationScore: 85,
                    status: 'offer_received'
                }
            ]);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: '#3B82F6',
            viewed: '#8B5CF6',
            shortlisted: '#EC4899',
            interview_scheduled: '#F59E0B',
            interview_completed: '#10B981',
            offer_received: '#06B6D4',
            rejected: '#EF4444',
            offer_accepted: '#22C55E'
        };
        return colors[status] || '#6B7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            applied: '📤',
            viewed: '👁️',
            shortlisted: '⭐',
            interview_scheduled: '📅',
            interview_completed: '✅',
            offer_received: '🎉',
            rejected: '❌',
            offer_accepted: '🎊'
        };
        return icons[status] || '📋';
    };

    const filteredApplications = filter === 'all' 
        ? applications 
        : applications.filter(app => app.status === filter);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className={styles.loading}>📊 Loading your applications...</div>
            </>
        );
    }

    if (!userId) {
        return (
            <>
                <Navbar />
                <div className={styles.loading}>🔐 Please log in to view your application tracker.</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
            <div className={styles.header}>
                <h1>📊 Application Tracking Dashboard</h1>
                <p>Track every step of your job search journey</p>
            </div>

            {/* Statistics Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📋</div>
                    <div className={styles.statContent}>
                        <h3>Total Applications</h3>
                        <p className={styles.statNumber}>{stats?.total || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statContent}>
                        <h3>Success Rate</h3>
                        <p className={styles.statNumber}>{stats?.successRate || 0}%</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏱️</div>
                    <div className={styles.statContent}>
                        <h3>Avg Response Time</h3>
                        <p className={styles.statNumber}>{stats?.avgResponseTime || 0} days</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📈</div>
                    <div className={styles.statContent}>
                        <h3>Recent (30 days)</h3>
                        <p className={styles.statNumber}>{stats?.recentApplicationsCount || 0}</p>
                    </div>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className={styles.breakdown}>
                <div className={styles.breakdownItem}>
                    <span>{getStatusIcon('applied')}</span>
                    <span>Applied</span>
                    <span className={styles.badge}>{stats?.applied || 0}</span>
                </div>
                <div className={styles.breakdownItem}>
                    <span>{getStatusIcon('shortlisted')}</span>
                    <span>Shortlisted</span>
                    <span className={styles.badge}>{stats?.shortlisted || 0}</span>
                </div>
                <div className={styles.breakdownItem}>
                    <span>{getStatusIcon('interview_scheduled')}</span>
                    <span>Interview</span>
                    <span className={styles.badge}>{stats?.interviewScheduled || 0}</span>
                </div>
                <div className={styles.breakdownItem}>
                    <span>{getStatusIcon('offer_received')}</span>
                    <span>Offers</span>
                    <span className={styles.badge}>{stats?.offerReceived || 0}</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                <button 
                    className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                {['applied', 'shortlisted', 'interview_scheduled', 'offer_received'].map(status => (
                    <button 
                        key={status}
                        className={`${styles.tab} ${filter === status ? styles.active : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {getStatusIcon(status)} {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className={styles.applications}>
                {filteredApplications.length > 0 ? (
                    filteredApplications.map(app => (
                        <div 
                            key={app.id} 
                            className={styles.appCard}
                            onClick={() => setSelectedApp(app)}
                        >
                            <div className={styles.appHeader}>
                                <div className={styles.appTitle}>
                                    <h3>{app.jobTitle}</h3>
                                    <p>{app.company}</p>
                                </div>
                                <div 
                                    className={styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor(app.status) }}
                                >
                                    {getStatusIcon(app.status)} {app.status.replace('_', ' ')}
                                </div>
                            </div>
                            <div className={styles.appMeta}>
                                <span>📅 {new Date(app.applicationDate).toLocaleDateString()}</span>
                                <span>⏱️ {app.responseTime ? `${app.responseTime}d` : 'Pending'}</span>
                                <span>⭐ Score: {app.applicationScore}/100</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <p>No applications found in this category</p>
                    </div>
                )}
            </div>

            {/* Top Companies */}
            {stats?.topCompanies && stats.topCompanies.length > 0 && (
                <div className={styles.topCompanies}>
                    <h2>🏆 Top Companies Applied</h2>
                    <div className={styles.companiesList}>
                        {stats.topCompanies.map((company, idx) => (
                            <div key={idx} className={styles.companyItem}>
                                <span>{idx + 1}. {company.name || company}</span>
                                <span className={styles.count}>{company.count || 'N/A'} applications</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default ApplicationTracker;
