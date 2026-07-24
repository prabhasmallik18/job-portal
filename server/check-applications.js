import mongoose from 'mongoose';
import 'dotenv/config';
import JobApplication from './models/JobApplication.js';
import Company from './models/Company.js';
import Job from './models/job.js';

const checkApplications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const applications = await JobApplication.find().sort({ date: -1 });

        console.log(`📊 Found ${applications.length} JobApplication records:`);

        applications.forEach((app, i) => {
            console.log(`${i+1}. Company ID: ${app.companyId} - Job ID: ${app.jobId} - Status: ${app.status} - Date: ${new Date(app.date).toLocaleDateString()}`);
        });

        if (applications.length > 0) {
            console.log('\n🔄 Updating statuses to show variety...');

            const statuses = ['Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Offer Received'];

            for (let i = 0; i < applications.length; i++) {
                const newStatus = statuses[i % statuses.length];
                await JobApplication.findByIdAndUpdate(applications[i]._id, { status: newStatus });
                console.log(`✅ Updated application ${i+1}: ${newStatus}`);
            }

            console.log('\n🎉 Status updates completed!');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

checkApplications();