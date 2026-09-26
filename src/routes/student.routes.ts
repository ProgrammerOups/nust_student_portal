import { Router } from 'express';
import { getDashboardData } from '../controllers/student.controller';

const router = Router();

router.get('/dashboard', getDashboardData);

export default router;