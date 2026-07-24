import mongoose from 'mongoose';
import 'dotenv/config';
import JobApplication from './models/JobApplication.js';
import Company from './models/Company.js';
import Job from './models/job.js';

const testUserAPI = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Get a user ID from the applications
        const app = await JobApplication.findOne();
        if (!app) {
            console.log('No applications found');
            return;
        }

        const userId = app.userId;
        console.log('Testing with userId:', userId);

        // Simulate the API call
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name image')
            .populate('jobId', 'title location category level salary')
            .exec();

        console.log('API would return:');
        applications.forEach((app, i) => {
            console.log(`${i+1}. ${app.companyId?.name} - ${app.jobId?.title} - Status: ${app.status}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

testUserAPI();