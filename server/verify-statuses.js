import mongoose from 'mongoose';
import 'dotenv/config';
import JobApplication from './models/JobApplication.js';

const checkStatuses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const apps = await JobApplication.find().sort({ date: -1 });
        console.log('Current application statuses:');
        apps.forEach((app, i) => {
            console.log(`${i+1}. Status: ${app.status}`);
        });
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkStatuses();