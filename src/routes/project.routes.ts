import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller';

const router = Router();

router.use(auth);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:project_id', getProject);
router.patch('/:project_id', updateProject);
router.delete('/:project_id', deleteProject);

export default router;