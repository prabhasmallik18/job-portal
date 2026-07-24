import express from 'express';
import {
    getSalaryData,
    analyzeOffer,
    compareOffers,
    getNegotiationStrategy,
    compareBenefits
} from '../controllers/salaryNegotiationController.js';

const router = express.Router();

// Salary & Negotiation Routes
router.get('/market-data', getSalaryData);
router.post('/analyze-offer', analyzeOffer);
router.post('/compare-offers', compareOffers);
router.post('/negotiation-strategy', getNegotiationStrategy);
router.post('/compare-benefits', compareBenefits);

export default router;
