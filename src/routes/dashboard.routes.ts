import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { getDashboardStats } from '../controllers/dashboard.controller';

const router = Router();

router.use(auth);

router.get('/', getDashboardStats);

export default router;