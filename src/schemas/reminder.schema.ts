import { z } from 'zod';

export const createReminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime({ message: 'Invalid due date' }),
  clientId: z.string().uuid('Invalid client ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
});

export const updateReminderSchema = createReminderSchema.partial().extend({
  completed: z.boolean().optional(),
});
