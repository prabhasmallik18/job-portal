import ApplicationTracker from "../models/ApplicationTracker.js";
import User from "../models/User.js";
import Job from "../models/job.js";
import Company from "../models/Company.js";

// ============================================
// 1. GET APPLICATION DASHBOARD
// ============================================
export const getApplicationDashboard = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const tempMessage = "🚧 Application Tracker - Temporary Implementation: Basic tracking active. Advanced analytics and AI-powered insights coming soon!";
        
        const applications = await ApplicationTracker.find({ userId })
            .populate('jobId')
            .populate('companyId')
            .sort({ applicationDate: -1 });

        // If user has no application data yet, provide sample demo data to show dashboard metrics.
        const isDemoMode = applications.length === 0;
        if (isDemoMode) {
            const demoApplicationDate = new Date();
            applications.push(
                {
                    _id: new Date().getTime(),
                    companyId: { name: 'Demo Corp' },
                    jobId: { title: 'Frontend Engineer' },
                    status: 'interview_scheduled',
                    applicationDate: new Date(demoApplicationDate.getTime() - 8 * 24 * 60 * 60 * 1000),
                    responseTime: 4,
                    priority: 'high',
                    applicationScore: 85,
                    updatedAt: demoApplicationDate
                },
                {
                    _id: new Date().getTime() + 1,
                    companyId: { name: 'CloudTech LLC' },
                    jobId: { title: 'Backend Developer' },
                    status: 'applied',
                    applicationDate: new Date(demoApplicationDate.getTime() - 12 * 24 * 60 * 60 * 1000),
                    responseTime: null,
                    priority: 'medium',
                    applicationScore: 74,
                    updatedAt: demoApplicationDate
                },
                {
                    _id: new Date().getTime() + 2,
                    companyId: { name: 'DataWave' },
                    jobId: { title: 'Data Scientist' },
                    status: 'offer_received',
                    applicationDate: new Date(demoApplicationDate.getTime() - 20 * 24 * 60 * 60 * 1000),
                    responseTime: 3,
                    priority: 'very_high',
                    applicationScore: 92,
                    updatedAt: demoApplicationDate
                }
            );
        }
        
        // 🔹 Calculate Statistics
        const stats = {
            total: applications.length,
            applied: applications.filter(a => a.status === 'applied').length,
            viewed: applications.filter(a => a.status === 'viewed').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            interviewScheduled: applications.filter(a => a.status === 'interview_scheduled').length,
            interviewCompleted: applications.filter(a => a.status === 'interview_completed').length,
            rejected: applications.filter(a => a.status === 'rejected').length,
            offerReceived: applications.filter(a => a.status === 'offer_received').length,
            offerAccepted: applications.filter(a => a.status === 'offer_accepted').length
        };
        
        // 🔹 Calculate Success Rate
        const successRate = stats.total > 0 
            ? Math.round(((stats.interviewScheduled + stats.offerReceived) / stats.total) * 100)
            : 0;
        
        // 🔹 Average Response Time
        const applicationsWithResponse = applications.filter(a => a.responseTime != null);
        const avgResponseTime = applicationsWithResponse.length > 0
            ? Math.round(applicationsWithResponse.reduce((sum, a) => sum + a.responseTime, 0) / applicationsWithResponse.length)
            : 0;

        // add these stats into the stats object so UI can easily read them
        stats.successRate = successRate;
        stats.avgResponseTime = avgResponseTime;
        
        // 🔹 Timeline Data (Last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentApplications = applications.filter(a => new Date(a.applicationDate) > thirtyDaysAgo);
        stats.recentApplicationsCount = recentApplications.length;
        
        // 🔹 Top Companies
        const companyStats = {};
        applications.forEach(app => {
            const companyName = app.companyId?.name || 'Unknown';
            companyStats[companyName] = (companyStats[companyName] || 0) + 1;
        });
        
        const topCompanies = Object.entries(companyStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
        
        // 🔹 Status Timeline
        const timeline = applications.map(app => ({
            date: app.applicationDate,
            company: app.companyId?.name,
            jobTitle: app.jobId?.title,
            status: app.status
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json({
            stats,
            successRate,
            avgResponseTime,
            recentApplicationsCount: recentApplications.length,
            topCompanies,
            timeline,
            applications: applications.map(app => ({
                id: app._id,
                company: app.companyId?.name,
                jobTitle: app.jobId?.title,
                status: app.status,
                applicationDate: app.applicationDate,
                responseTime: app.responseTime,
                priority: app.priority,
                applicationScore: app.applicationScore,
                lastUpdate: app.updatedAt
            })),
            insights: {
                bestDay: "Wednesday", // Can be calculated from data
                recommendedApplicationCount: "5-8 per week",
                nextStep: stats.applied > stats.interviewScheduled ? "Follow up on applications" : "Keep applying!"
            },
            temporaryNote: tempMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 2. UPDATE APPLICATION STATUS
// ============================================
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, event, notes, interviewDetails } = req.body;
        
        const application = await ApplicationTracker.findById(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found" });
        
        application.status = status;
        
        // Add timeline event
        if (event) {
            application.timeline.push({
                event,
                date: new Date(),
                notes,
                status
            });
        }
        
        // Update interview details if provided
        if (interviewDetails) {
            application.interviewDetails = { ...application.interviewDetails, ...interviewDetails };
        }
        
        // Calculate response time if first response
        if (status === 'viewed' && !application.responseTime) {
            application.responseTime = Math.ceil((new Date() - application.applicationDate) / (1000 * 60 * 60 * 24));
        }
        
        await application.save();
        
        res.json({
            message: "Application updated successfully",
            application,
            statusMessage: `Status changed to ${status}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 3. CREATE/LOG APPLICATION
// ============================================
export const createApplication = async (req, res) => {
    try {
        const { userId, jobId, companyId } = req.body;
        
        const application = new ApplicationTracker({
            userId,
            jobId,
            companyId,
            applicationDate: new Date(),
            status: 'applied',
            timeline: [{
                event: 'Application Submitted',
                date: new Date(),
                status: 'applied'
            }]
        });
        
        await application.save();
        
        res.status(201).json({
            message: "Application tracked successfully",
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 4. GET APPLICATION DETAIL
// ============================================
export const getApplicationDetail = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const application = await ApplicationTracker.findById(applicationId)
            .populate('userId')
            .populate('jobId')
            .populate('companyId');
        
        if (!application) return res.status(404).json({ message: "Application not found" });
        
        res.json({
            application,
            timeline: application.timeline,
            interviewDetails: application.interviewDetails,
            offerDetails: application.offerDetails,
            documents: {
                resume: application.submittedResume,
                coverLetter: application.submittedCoverLetter,
                portfolio: application.portfolioLink
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 5. ADD INTERVIEW DETAILS
// ============================================
export const addInterviewDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { scheduledDate, interviewType, links, notes } = req.body;
        
        const application = await ApplicationTracker.findById(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found" });
        
        application.status = 'interview_scheduled';
        application.interviewDetails = {
            ...application.interviewDetails,
            scheduledDate: new Date(scheduledDate),
            interviewType,
            links,
            notes
        };
        
        application.timeline.push({
            event: 'Interview Scheduled',
            date: new Date(),
            notes: `${interviewType} interview scheduled on ${scheduledDate}`,
            status: 'interview_scheduled'
        });
        
        await application.save();
        
        res.json({
            message: "Interview details added",
            application,
            reminder: `Interview coming up on ${new Date(scheduledDate).toLocaleDateString()}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 6. ADD OFFER DETAILS
// ============================================
export const addOfferDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { baseSalary, currency, benefits, bonusPercentage, ctc, noticePeriod, department, reportingManager } = req.body;
        
        const application = await ApplicationTracker.findById(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found" });
        
        application.status = 'offer_received';
        application.offerDetails = {
            offerDate: new Date(),
            basesalary: baseSalary,
            currency,
            benefits,
            bonusPercentage,
            ctc,
            noticePeriod,
            department,
            reportingManager
        };
        
        application.timeline.push({
            event: 'Offer Received',
            date: new Date(),
            notes: `Offer: ₹${ctc} CTC, ${noticePeriod} days notice`,
            status: 'offer_received'
        });
        
        await application.save();
        
        res.json({
            message: "Offer details recorded",
            application,
            offerSummary: {
                baseSalary,
                currency,
                ctc,
                benefits: benefits.length,
                bonusPercentage
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// 7. GET OFFER COMPARISON
// ============================================
export const compareOffers = async (req, res) => {
    try {
        const { userId } = req.params;
        const { applicationIds } = req.body;
        
        const applications = await ApplicationTracker.find({
            _id: { $in: applicationIds },
            status: 'offer_received'
        }).populate('companyId').populate('jobId');
        
        if (applications.length === 0) {
            return res.status(404).json({ message: "No offers found" });
        }
        
        const comparison = applications.map(app => ({
            company: app.companyId?.name,
            job: app.jobId?.title,
            baseSalary: app.offerDetails?.basesalary,
            bonus: app.offerDetails?.bonusPercentage,
            ctc: app.offerDetails?.ctc,
            benefits: app.offerDetails?.benefits,
            noticePeriod: app.offerDetails?.noticePeriod
        }));
        
        const best = applications.reduce((prev, curr) => 
            (curr.offerDetails?.ctc > prev.offerDetails?.ctc) ? curr : prev
        );
        
        res.json({
            comparison,
            bestOffer: {
                company: best.companyId?.name,
                ctc: best.offerDetails?.ctc
            },
            recommendation: "Compare not just salary, but growth, culture, and location too!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
