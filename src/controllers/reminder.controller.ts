import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createReminderSchema, updateReminderSchema } from '../schemas/reminder.schema';

const prisma = new PrismaClient();

export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const data = createReminderSchema.parse(req.body);
    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          userId: req.user!.id,
        },
      });
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
    }
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: data.projectId,
          userId: req.user!.id,
          ...(data.clientId && { clientId: data.clientId }),
        },
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
    }
    const reminder = await prisma.reminder.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleReminder = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch the reminder by ID and ensure it's owned by the user
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: req.params.reminder_id,
        userId: req.user!.id, // Ensure the reminder belongs to the logged-in user
      },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    // Toggle the 'completed' status
    const updatedReminder = await prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        completed: !reminder.completed, // Toggle the current 'completed' status
      },
    });

    // Respond with the updated reminder
    res.json(updatedReminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReminders = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, projectId, completed } = req.query;
    const where = {
      userId: req.user!.id,
      ...(clientId && { clientId: String(clientId) }),
      ...(projectId && { projectId: String(projectId) }),
      ...(completed !== undefined && { completed: completed === 'true' }),
    };
    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDueReminders = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: req.user!.id,
        completed: false,
        dueDate: {
          lte: endOfWeek,
          gte: today,
        },
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReminder = async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: req.params.reminder_id,
        userId: req.user!.id,
      },
      include: {
        client: true,
        project: true,
      },
    });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReminder = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateReminderSchema.parse(req.body); 
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: req.params.reminder_id,
        userId: req.user!.id,
      },
    });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          userId: req.user!.id,
        },
      });
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
    }
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: data.projectId,
          userId: req.user!.id,
          ...(data.clientId && { clientId: data.clientId }),
        },
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
    }
    const updatedReminder = await prisma.reminder.update({
      where: { id: req.params.reminder_id },
      data,
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    });
    res.json(updatedReminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: req.params.reminder_id,
        userId: req.user!.id,
      },
    });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    await prisma.reminder.delete({
      where: { id: req.params.reminder_id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

