import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    const [
      totalClients,
      totalProjects,
      upcomingReminders,
      projectsByStatus
    ] = await Promise.all([
      prisma.client.count({
        where: { userId: req.user!.id },
      }),

      prisma.project.count({
        where: { userId: req.user!.id },
      }),

      prisma.reminder.findMany({
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
      }),

      prisma.project.groupBy({
        by: ['status'],
        where: { userId: req.user!.id },
        _count: true,
      }),
    ]);
    
    const formattedProjectsByStatus = projectsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      totalClients,
      totalProjects,
      upcomingReminders,
      projectsByStatus: formattedProjectsByStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};