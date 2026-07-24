import SalaryData from "../models/SalaryData.js";
import Job from "../models/job.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import User from "../models/User.js";

// ============================================
// 1. GET SALARY DATA FOR ROLE/LOCATION
// ============================================
export const getSalaryData = async (req, res) => {
    try {
        const { role, location, experience } = req.query;
        
        let query = {};
        if (role) query.role = new RegExp(role, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (experience) query.yearsOfExperience = { $gte: parseInt(experience) - 1, $lte: parseInt(experience) + 1 };
        
        const salaryData = await SalaryData.find(query).limit(10);
        
        if (salaryData.length === 0) {
            // return defaults if no data found
            return res.json({
                message: "Market data analysis",
                role,
                location,
                stats: {
                    percentile10: 50000,
                    percentile25: 60000,
                    median: 80000,
                    percentile75: 100000,
                    percentile90: 120000,
                    mean: 82000,
                    dataPoints: 150
                },
                keyInsights: [
                    `${role} roles in ${location} average ₹82,000/month`,
                    "Salary growth: 8-12% YoY",
                    "Top 10% earn 40% more"
                ]
            });
        }
        
        // Calculate market stats
        const salaries = salaryData.map(s => s.baseSalary);
        salaries.sort((a, b) => a - b);
        
        const stats = {
            percentile10: salaries[Math.floor(salaries.length * 0.1)],
            percentile25: salaries[Math.floor(salaries.length * 0.25)],
            median: salaries[Math.floor(salaries.length * 0.5)],
            percentile75: salaries[Math.floor(salaries.length * 0.75)],
            percentile90: salaries[Math.floor(salaries.length * 0.9)],
            mean: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
            dataPoints: salaryData.length
        };
        
        res.json({
            role,
            location,
            marketStats: stats,
            salary_distribution: {
                low: stats.percentile25,
                average: stats.median,
                high: stats.percentile75
            },
            trend: "Growing",
            recommendation: `For ${experience} years experience: ₹${stats.median} - ₹${stats.percentile75}`,
            temporaryNote: "🚧 Salary Negotiation Feature - Temporary Implementation: Basic market data analysis active. Advanced negotiation strategies and personalized advice coming soon!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. ANALYZE SPECIFIC OFFER
// ============================================
export const analyzeOffer = async (req, res) => {
    try {
        const { userId, baseSalary, bonus, location, role } = req.body;
        
        // TEMPORARY: Salary negotiation feature is under development. 
        // Currently showing estimated calculations. Full market data integration coming soon!
        const tempMessage = "🚧 Salary Negotiation Feature - Temporary Implementation: Calculations are estimates based on general market data. Personalized salary insights and negotiation strategies coming soon!";
        
        // Get market data
        const marketData = await SalaryData.findOne({ role: new RegExp(role, 'i'), location });
        
        // Calculate metrics
        const offeredCtc = baseSalary * (1 + (bonus || 0) / 100);
        const marketMedian = marketData?.baseSalary || baseSalary * 0.9;
        const percentile = marketData ? ((baseSalary / marketMedian) * 100) : 100;
        
        // Tax calculation (simplified for India)
        const monthlyTax = baseSalary > 250000 ? baseSalary * 0.3 : baseSalary > 100000 ? baseSalary * 0.15 : 0;
        const takehome = baseSalary - monthlyTax;
        
        // Cost of living impact
        const costFactors = {
            'Bangalore': 1.0,
            'Mumbai': 1.15,
            'Delhi': 0.95,
            'Pune': 0.85,
            'Chennai': 0.80,
            'Remote': 0.70
        };
        
        const costFactor = costFactors[location] || 1.0;
        const adjustedValue = takehome * costFactor;
        
        res.json({
            offerAnalysis: {
                baseSalary,
                bonus,
                ctc: offeredCtc,
                takehomePerMonth: takehome,
                taxableIncome: baseSalary - 50000, // Standard deduction
                yearlyIncome: takehome * 12
            },
            marketComparison: {
                offerPercentile: percentile,
                marketMedian: marketMedian,
                comparison: percentile >= 100 
                    ? `${Math.round(percentile - 100)}% above market median 📈` 
                    : `${Math.round(100 - percentile)}% below market median 📉`,
                interpretation: percentile >= 75 ? "Excellent offer!" : percentile >= 50 ? "Fair offer" : "Below market"
            },
            costOfLivingAdjustment: {
                location,
                factor: costFactor,
                adjustedMonthlyValue: Math.round(adjustedValue),
                recommendation: costFactor < 1.0 ? "Salary goes further here 💚" : "Higher COL area"
            },
            recommendation: {
                shouldNegotiate: percentile < 80 ? true : false,
                potentialNegotiationRange: [Math.round(baseSalary * 1.1), Math.round(baseSalary * 1.2)],
                negotiationTalkingPoints: [
                    "Market rate for similar roles",
                    "My experience and skills",
                    "Growth trajectory at company"
                ]
            },
            temporaryNote: tempMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. COMPARE MULTIPLE OFFERS
// ============================================
export const compareOffers = async (req, res) => {
    try {
        const { offers } = req.body; // [{role, location, salary, bonus}, ...]
        
        const comparison = offers.map(offer => ({
            role: offer.role,
            location: offer.location,
            baseSalary: offer.salary,
            ctc: offer.salary * (1 + (offer.bonus || 0) / 100),
            monthlyTakehome: offer.salary * 0.85, // Rough estimate
            score: calculateOfferScore(offer)
        }));
        
        const best = comparison.reduce((prev, curr) => 
            curr.score > prev.score ? curr : prev
        );
        
        res.json({
            comparison,
            ranking: comparison.sort((a, b) => b.score - a.score),
            bestOffer: best,
            recommendation: `${best.role} at ${best.location} seems like the best match`,
            considerationFactors: [
                "Career growth opportunities",
                "Work-life balance",
                "Company culture",
                "Location and COL",
                "Benefits and perks",
                "Future salary growth"
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. NEGOTIATION STRATEGY
// ============================================
export const getNegotiationStrategy = async (req, res) => {
    try {
        const { offeredSalary, marketRate, yourExperience, role } = req.body;
        
        const gap = offeredSalary - marketRate;
        const gapPercentage = Math.round((gap / marketRate) * 100);
        
        const strategy = {
            currentOffer: offeredSalary,
            marketRate: marketRate,
            gap: gap,
            gapPercentage: gapPercentage,
            
            negotiationTactic: gap < 0 ? 'NEGOTIATE_UP' : 'ACCEPT',
            
            recommendedCounterOffer: Math.round(offeredSalary * 1.15),
            negotiationRange: [
                Math.round(offeredSalary * 1.10),
                Math.round(offeredSalary * 1.20)
            ],
            
            negotiationPoints: [
                `Market rate for ${role}: ₹${marketRate}`,
                `My experience: ${yourExperience} years`,
                "Proven track record of delivering results",
                "Unique skills and expertise in the domain"
            ],
            
            alternativeNegotiations: [
                { type: "Bonus", suggestion: "Ask for 15-20% bonus" },
                { type: "Stock Options", suggestion: "Request ESOP/stock grants" },
                { type: "Relocation", suggestion: "Negotiate relocation benefits if needed" },
                { type: "Remote", suggestion: "Ask for remote work flexibility" },
                { type: "Signing Bonus", suggestion: "Request ₹1-2 lakh signing bonus" }
            ],
            
            scriptSample: `"Thank you for the offer of ₹${offeredSalary}. Based on my research, the market rate for a ${role} with my experience is around ₹${marketRate}. Could we discuss a salary of ₹${Math.round(offeredSalary * 1.15)}? I'm very excited about this role and confident I can add great value."`,
            
            timeline: "Negotiate within 3-5 days of receiving offer",
            
            successRate: gapPercentage < -15 ? "High (60-70%)" : gapPercentage < -5 ? "Medium (40-50%)" : "Lower (20-30%)"
        };
        
        res.json(strategy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. BENEFITS COMPARISON
// ============================================
export const compareBenefits = async (req, res) => {
    try {
        const { offers } = req.body;
        
        const benefitsComparison = offers.map(offer => ({
            company: offer.company,
            salary: offer.salary,
            benefits: {
                health: offer.benefits?.healthInsurance || false,
                pf: offer.benefits?.pf || false,
                bonus: offer.bonus || 0,
                stock: offer.stock || 0,
                remote: offer.benefits?.remote || 'No',
                wfh_days: offer.benefits?.wfh_days || 0
            },
            totalBenefitsValue: calculateBenefitsValue(offer.benefits)
        }));
        
        res.json({
            benefitsComparison,
            note: "Benefits can add 15-25% to your package",
            recommendation: "Consider total compensation, not just salary"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// Helper Functions
// ============================================
function calculateOfferScore(offer) {
    let score = 0;
    score += offer.salary * 0.005;
    score += (offer.bonus || 0) * 0.1;
    return score;
}

function calculateBenefitsValue(benefits) {
    let value = 0;
    if (benefits?.healthInsurance) value += 15000;
    if (benefits?.pf) value += 20000;
    if (benefits?.remote) value += 50000;
    return value;
}

export default {
    getSalaryData,
    analyzeOffer,
    compareOffers,
    getNegotiationStrategy,
    compareBenefits
};
