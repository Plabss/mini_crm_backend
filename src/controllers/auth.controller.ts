import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { signupSchema, loginSchema } from '../schemas/auth.schema';
import { prisma } from '../utils/database';

export const signup = async (req: Request, res: Response) => {
  try {
    console.log('Signup request received:', { ...req.body, password: '[REDACTED]' });
    
    const data = signupSchema.parse(req.body);
    console.log('Data validation passed');
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    console.log('Checked for existing user');

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('Password hashed successfully');
    
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });
      console.log('User created successfully:', { id: user.id, email: user.email });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET ?? '',
        { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as SignOptions
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during signup'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET ?? '',
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as SignOptions
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during login'
    });
  }
}