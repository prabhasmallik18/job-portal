import mongoose from 'mongoose';
import 'dotenv/config';
import ApplicationTracker from './models/ApplicationTracker.js';

const updateApplicationStatuses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const applications = await ApplicationTracker.find();
        console.log(`📊 Found ${applications.length} applications`);

        if (applications.length === 0) {
            console.log('❌ No applications found to update');
            return;
        }

        // Different statuses to cycle through
        const statuses = [
            'applied',
            'viewed',
            'shortlisted',
            'interview_scheduled',
            'interview_completed',
            'rejected',
            'offer_received',
            'offer_accepted'
        ];

        console.log('\n🔄 Updating application statuses...');

        for (let i = 0; i < applications.length; i++) {
            const newStatus = statuses[i % statuses.length];
            const statusText = newStatus.replace('_', ' ');

            await ApplicationTracker.findByIdAndUpdate(applications[i]._id, {
                status: newStatus,
                timeline: [{
                    event: `Status updated to ${statusText}`,
                    date: new Date(),
                    status: newStatus
                }]
            });

            console.log(`✅ Updated application ${i+1}/${applications.length}: ${newStatus}`);
        }

        console.log('\n🎉 All application statuses updated successfully!');
        console.log('📋 Status distribution:');
        console.log(`   • Applied: ${applications.length} applications`);
        console.log(`   • Varied statuses: ${statuses.length} different types`);

    } catch (error) {
        console.error('❌ Error updating statuses:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

updateApplicationStatuses();