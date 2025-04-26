import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  getClient
} from '../controllers/client.controller';

const router = Router();

router.use(auth);

router.post('/', createClient);
router.get('/', getClients);
router.get('/:client_id', getClient);
router.patch('/:client_id', updateClient);
router.delete('/:client_id', deleteClient);

export default router;