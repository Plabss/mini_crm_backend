import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  deleteReminder,
  getDueReminders
} from '../controllers/reminder.controller';

const router = Router();

router.use(auth);

router.post('/', createReminder);
router.get('/', getReminders);
router.get('/due', getDueReminders);
router.get('/:reminder_id', getReminder);
router.patch('/:reminder_id', updateReminder);
router.delete('/:reminder_id', deleteReminder);

export default router;