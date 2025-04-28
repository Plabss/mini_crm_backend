import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema';

const prisma = new PrismaClient();

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const data = createProjectSchema.parse(req.body);
    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        userId: req.user!.id,
      },
    });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    const project = await prisma.project.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};
export const getProjectsByClient = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Client ID:', req.params.client_id);
    const projects = await prisma.project.findMany({
      where: {
        clientId: req.params.client_id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Hiiiiiiiiiiiit");
    console.log('Project ID:', req.params.project_id);
    console.log('User ID:', req.user!.id);
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.project_id,
        userId: req.user!.id,
      },
      include: {
        client: true,
        reminders: true,
      },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProjectSchema.parse(req.body);
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.project_id,
        userId: req.user!.id,
      },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
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

    const updatedProject = await prisma.project.update({
      where: { id: req.params.project_id },
      data,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.project_id,
        userId: req.user!.id,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: req.params.project_id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};