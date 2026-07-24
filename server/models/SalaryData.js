import mongoose from "mongoose";

const salaryDataSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    role: { type: String, required: true }, // e.g., "React Developer", "DevOps Engineer"
    location: { type: String, required: true },
    company: String,
    
    // 🔹 Salary Data
    baseSalary: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    bonus: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    benefits: {
        healthInsurance: Boolean,
        pf: Boolean, // Provident Fund
        hra: Boolean, // House Rent Allowance
        maternity: Boolean,
        childcare: Boolean,
        gymMembership: Boolean,
        mealAllowance: Boolean,
        travelAllowance: Boolean
    },
    ctc: { type: Number }, // Cost to Company
    takehomePerMonth: { type: Number }, // After taxes
    
    // 🔹 Experience Level
    yearsOfExperience: { type: Number, required: true },
    level: { type: String, enum: ['junior', 'mid', 'senior', 'lead', 'manager'], required: true },
    
    // 🔹 Market Data
    marketStats: {
        percentile10: Number,
        percentile25: Number,
        median: Number,
        percentile75: Number,
        percentile90: Number,
        mean: Number,
        dataPoints: Number // Number of salary records used
    },
    
    // 🔹 Trends
    yearOverYearGrowth: Number, // % growth compared to last year
    trend: { type: String, enum: ['declining', 'stable', 'growing', 'high_growth'], default: 'stable' },
    
    // 🔹 Top Companies for Role
    topCompanies: [{
        companyName: String,
        avgSalary: Number,
        count: Number // How many data points
    }],
    
    // 🔹 Geographic Data
    costOfLiving: {
        city: String,
        index: Number, // Where 100 = national average
        recommendation: String // "This salary goes further here" or "Consider higher salary for COL"
    },
    
    createdAt: { type: Date, default: Date.now }
});

const SalaryData = mongoose.model('SalaryData', salaryDataSchema);
export default SalaryData;
