import { Router } from 'express';
import { getPerformance } from '../controllers/performance.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getPerformance);

export default router;