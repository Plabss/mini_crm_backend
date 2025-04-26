import { PrismaClient } from '@prisma/client';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect() {
    try {
      await this.prisma.$connect();
      // Test the connection
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('Successfully connected to PostgreSQL database');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}

export const db = DatabaseService.getInstance();
export const prisma = db.getPrisma();