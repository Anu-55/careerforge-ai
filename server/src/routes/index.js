import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import interviewRoutes from './interview.routes.js';
import historyRoutes from './history.routes.js';
import performanceRoutes from './performance.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);
router.use('/interview', interviewRoutes);
router.use('/history', historyRoutes);
router.use('/dashboard/performance', performanceRoutes);


export default router;