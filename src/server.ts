import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Root route redirecting to Login
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/Login.html'));
});

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Mock Auth endpoint to test login form submission
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ success: false, message: 'Student ID and password are required' });
  }

  // Temporary mock response
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: { studentId, name: 'John Doe', program: 'Computer Science' }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NUST Portal Server running on http://localhost:${PORT}`);
});