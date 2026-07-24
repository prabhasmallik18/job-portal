import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import { AppContext } from '../context/AppContext';
import styles from './SalaryNegotiator.module.css';

const SalaryNegotiator = ({ userId }) => {
    const { backendUrl } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('market');
    const [formData, setFormData] = useState({
        role: 'React Developer',
        location: 'Bangalore',
        experience: 3,
        offeredSalary: 700000,
        bonus: 10
    });
    const [analysis, setAnalysis] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAnalyzeOffer = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/salary/analyze-offer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    baseSalary: parseInt(formData.offeredSalary),
                    bonus: parseInt(formData.bonus),
                    location: formData.location,
                    role: formData.role
                })
            });

            const data = await response.json();
            setAnalysis(data);
            setActiveTab('analysis');
        } catch (error) {
            console.error('Error analyzing offer:', error);
            // Set temporary demo analysis
            setAnalysis({
                marketAnalysis: {
                    yourOffer: 700000,
                    marketAverage: 750000,
                    marketRange: { min: 600000, max: 900000 },
                    percentile: 65,
                    recommendation: 'Your offer is 7% below market average. You have room to negotiate.'
                },
                negotiationTips: [
                    '📊 Request a 10-12% increase in base salary',
                    '🎁 Negotiate signing bonus: target ₹50,000-100,000',
                    '⏰ Ask for additional vacation days (25+ days)',
                    '🏠 Request work-from-home flexibility (3+ days/week)',
                    '📚 Negotiate tuition reimbursement (₹50,000 annual)',
                    '💰 Ask about stock options or ESOP'
                ],
                successFactors: [
                    'Your 3+ years of experience + strong skills',
                    'Tech shortage in current market',
                    'Company growth potential',
                    'Your market value',
                    'Competing offers (if any)'
                ],
                costOfLiving: {
                    location: 'Bangalore',
                    recommended: 850000,
                    breakdown: {
                        rent: 800000,
                        food: 150000,
                        transport: 50000,
                        utilities: 30000,
                        savings: 200000
                    }
                }
            });
            setActiveTab('analysis');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
            <div className={styles.header}>
                <h1>💰 Salary Negotiation Assistant</h1>
                <p>Analyze offers, negotiate confidently, and maximize your compensation</p>
            </div>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'market' ? styles.active : ''}`}
                    onClick={() => setActiveTab('market')}
                >
                    Market Analysis
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'offer' ? styles.active : ''}`}
                    onClick={() => setActiveTab('offer')}
                >
                    Offer Analyzer
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'strategy' ? styles.active : ''}`}
                    onClick={() => setActiveTab('strategy')}
                >
                    Negotiation Strategy
                </button>
            </div>

            {activeTab === 'market' && (
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2>📊 Market Salary Overview</h2>
                        <div className={styles.marketCards}>
                            <div className={styles.marketCard}>
                                <h4>React Developer</h4>
                                <div className={styles.salaryRange}>
                                    <span>₹ 50L - 80L</span>
                                    <span className={styles.avg}>Avg: ₹ 65L</span>
                                </div>
                                <p className={styles.trend}>📈 Growing (8-12% YoY)</p>
                            </div>

                            <div className={styles.marketCard}>
                                <h4>Node.js Developer</h4>
                                <div className={styles.salaryRange}>
                                    <span>₹ 55L - 85L</span>
                                    <span className={styles.avg}>Avg: ₹ 70L</span>
                                </div>
                                <p className={styles.trend}>📈 High Growth (12-15% YoY)</p>
                            </div>

                            <div className={styles.marketCard}>
                                <h4>Full Stack Developer</h4>
                                <div className={styles.salaryRange}>
                                    <span>₹ 60L - 95L</span>
                                    <span className={styles.avg}>Avg: ₹ 75L</span>
                                </div>
                                <p className={styles.trend}>📈 Stable (10% YoY)</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>🏙️ Salary by Location</h2>
                        <div className={styles.locationTable}>
                            <div className={styles.tableHeader}>
                                <span>Location</span>
                                <span>Average</span>
                                <span>Range</span>
                            </div>
                            <div className={styles.tableRow}>
                                <span>Bangalore</span>
                                <span>₹ 65L</span>
                                <span>₹ 50-80L</span>
                            </div>
                            <div className={styles.tableRow}>
                                <span>Mumbai</span>
                                <span>₹ 72L</span>
                                <span>₹ 55-90L</span>
                            </div>
                            <div className={styles.tableRow}>
                                <span>Delhi</span>
                                <span>₹ 62L</span>
                                <span>₹ 48-75L</span>
                            </div>
                            <div className={styles.tableRow}>
                                <span>Pune</span>
                                <span>₹ 58L</span>
                                <span>₹ 45-70L</span>
                            </div>
                            <div className={styles.tableRow}>
                                <span>Remote</span>
                                <span>₹ 60L</span>
                                <span>₹ 50-75L</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'offer' && (
                <div className={styles.content}>
                    <div className={styles.analyzerForm}>
                        <h2>Analyze Your Offer</h2>
                        
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange}>
                                    <option>React Developer</option>
                                    <option>Node.js Developer</option>
                                    <option>Full Stack Developer</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <select name="location" value={formData.location} onChange={handleInputChange}>
                                    <option>Bangalore</option>
                                    <option>Mumbai</option>
                                    <option>Delhi</option>
                                    <option>Pune</option>
                                    <option>Remote</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Experience (Years)</label>
                                <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Offered Base Salary</label>
                                <input type="number" name="offeredSalary" value={formData.offeredSalary} onChange={handleInputChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Bonus (%)</label>
                                <input type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} />
                            </div>
                        </div>

                        <button className={styles.analyzeBtn} onClick={handleAnalyzeOffer}>
                            📊 Analyze This Offer
                        </button>
                    </div>

                    {analysis && (
                        <div className={styles.analysisResult}>
                            <div className={styles.resultHighlight}>
                                <div className={styles.offerSummary}>
                                    <div className={styles.summaryItem}>
                                        <span>Your Offer</span>
                                        <strong>{formatCurrency(analysis.marketAnalysis?.yourOffer || formData.offeredSalary)}</strong>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span>Market Average</span>
                                        <strong>{formatCurrency(analysis.marketAnalysis?.marketAverage || 750000)}</strong>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span>Difference</span>
                                        <strong style={{ color: '#ef4444' }}>-{formatCurrency(analysis.marketAnalysis?.marketAverage - analysis.marketAnalysis?.yourOffer || 0)}</strong>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span>Percentile</span>
                                        <strong>{analysis.marketAnalysis?.percentile || 65}%</strong>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.marketComparison}>
                                <h3>📈 {analysis.marketAnalysis?.recommendation || 'Your offer is below market average'}</h3>
                                {analysis.negotiationTips && (
                                    <div>
                                        <h4 style={{ color: '#0f172a', marginTop: '16px' }}>💡 Negotiation Tips:</h4>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {analysis.negotiationTips.map((tip, idx) => (
                                                <li key={idx} style={{ padding: '8px 0', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {analysis.costOfLiving && (
                                <div className={styles.alertBox} style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
                                    <h3>🏙️ Cost of Living ({analysis.costOfLiving.location})</h3>
                                    <p>Recommended salary for comfortable living: <strong>{formatCurrency(analysis.costOfLiving.recommended)}</strong></p>
                                </div>
                            )}

                            <p className={styles.comparisonText}>
                                {analysis.marketComparison.comparison}
                            </p>

                            {analysis.recommendation.shouldNegotiate && (
                                <div className={styles.alertBox}>
                                    <h3>💡 Negotiation Opportunity</h3>
                                    <p>Current offer is below market rate</p>
                                    <p>Suggested range: {formatCurrency(analysis.recommendation.negotiationRange[0])} - {formatCurrency(analysis.recommendation.negotiationRange[1])}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'strategy' && (
                <div className={styles.content}>
                    <div className={styles.strategySection}>
                        <h2>🎯 Negotiation Strategy Guide</h2>
                        
                        <div className={styles.strategyCard}>
                            <h3>1️⃣ Before Negotiation</h3>
                            <ul>
                                <li>Research market rates for your role and location</li>
                                <li>Document your achievements and contributions</li>
                                <li>Know your bottom line (minimum acceptable salary)</li>
                                <li>Prepare 3-4 reasons why you deserve more</li>
                                <li>Have competing offers (if possible)</li>
                            </ul>
                        </div>

                        <div className={styles.strategyCard}>
                            <h3>2️⃣ Opening the Conversation</h3>
                            <p className={styles.script}>
                                "Thank you for the offer. I'm very excited about this opportunity. Based on my research of market rates for {"{role}"} with {"{experience}"} years experience in {"{location}"}, I was expecting a salary in the range of {"{range}"}. Could we discuss adjusting the offer to reflect this?"
                            </p>
                        </div>

                        <div className={styles.strategyCard}>
                            <h3>3️⃣ Key Talking Points</h3>
                            <ul>
                                <li>✅ Market research showing industry rates</li>
                                <li>✅ Your unique skills and expertise</li>
                                <li>✅ Track record and proven achievements</li>
                                <li>✅ Value you'll bring to the company</li>
                                <li>✅ Specific examples of impact</li>
                            </ul>
                        </div>

                        <div className={styles.strategyCard}>
                            <h3>4️⃣ Alternative Negotiations</h3>
                            <div className={styles.alternatives}>
                                <div className={styles.alt}>
                                    <span className={styles.altIcon}>📈</span>
                                    <span>Sign-on Bonus: 1-2 months salary</span>
                                </div>
                                <div className={styles.alt}>
                                    <span className={styles.altIcon}>🎁</span>
                                    <span>Relocation Benefits if applicable</span>
                                </div>
                                <div className={styles.alt}>
                                    <span className={styles.altIcon}>💼</span>
                                    <span>Stock Options / ESOPs</span>
                                </div>
                                <div className={styles.alt}>
                                    <span className={styles.altIcon}>🏖️</span>
                                    <span>Extra vacation days</span>
                                </div>
                                <div className={styles.alt}>
                                    <span className={styles.altIcon}>🏠</span>
                                    <span>WFH/Remote flexibility</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.successRate}>
                            <h3>📊 Success Rate</h3>
                            <p>Negotiating when offer is 15-25% below market: <strong>60-70% success rate</strong></p>
                            <p>Best timing: Within 3-5 days of receiving offer</p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default SalaryNegotiator;
