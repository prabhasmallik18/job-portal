import express from 'express';
import {
    getApplicationDashboard,
    updateApplicationStatus,
    createApplication,
    getApplicationDetail,
    addInterviewDetails,
    addOfferDetails,
    compareOffers
} from '../controllers/applicationTrackerController.js';

const router = express.Router();

// Application Tracking Routes
router.get('/dashboard/:userId', getApplicationDashboard);
router.get('/detail/:applicationId', getApplicationDetail);
router.post('/create', createApplication);
router.put('/update-status/:applicationId', updateApplicationStatus);
router.post('/add-interview/:applicationId', addInterviewDetails);
router.post('/add-offer/:applicationId', addOfferDetails);
router.post('/compare-offers', compareOffers);

export default router;
