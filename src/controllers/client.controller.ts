import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

const prisma = new PrismaClient();

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const data = createClientSchema.parse(req.body);
    const client = await prisma.client.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: req.params.client_id,
        userId: req.user!.id,
      },
      include: {
        projects: true,
        reminders: true,
      },
    });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateClientSchema.parse(req.body);
    const client = await prisma.client.findFirst({
      where: {
        id: req.params.client_id,
        userId: req.user!.id,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: req.params.client_id },
      data,
    });

    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: req.params.client_id,
        userId: req.user!.id,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await prisma.client.delete({
      where: { id: req.params.client_id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};