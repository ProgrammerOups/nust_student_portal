import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ success: false, message: 'Student ID and password are required.' });
  }

  // Temporary stub for database lookup (will connect to Prisma once PostgreSQL is linked)
  const mockToken = jwt.sign(
    { studentId, role: 'STUDENT' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: mockToken,
    user: {
      studentId,
      name: 'John Doe',
      program: 'Computer Science'
    }
  });
};