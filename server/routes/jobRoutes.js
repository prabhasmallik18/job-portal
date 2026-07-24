import express from 'express';
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;