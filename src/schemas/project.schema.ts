import { z } from 'zod';

export const projectStatusEnum = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']);

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  budget: z.number().min(0, 'Budget must be a positive number'),
  deadline: z.string().datetime({ message: 'Invalid deadline date' }),
  status: projectStatusEnum.default('PLANNED'),
  clientId: z.string().uuid('Invalid client ID'),
});

export const updateProjectSchema = createProjectSchema.partial();
