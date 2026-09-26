import { Request, Response } from 'express';

export const getDashboardData = async (req: Request, res: Response) => {
  // Returns structured metrics for Student.html
  return res.status(200).json({
    success: true,
    data: {
      profile: {
        studentId: 'N0123456X',
        name: 'John Doe',
        program: 'Computer Science'
      },
      stats: {
        feeBalance: '$450.00',
        currentGPA: 3.8,
        enrolledCoursesCount: 4
      },
      courses: [
        { code: 'SCS 1101', title: 'Introduction to Computer Science', credits: 4, status: 'Registered' },
        { code: 'SMA 1101', title: 'Calculus I', credits: 4, status: 'Registered' },
        { code: 'SCS 1102', title: 'Programming Concepts (Java)', credits: 5, status: 'Registered' },
        { code: 'CTL 1101', title: 'Communication Skills', credits: 2, status: 'Pending Audit' }
      ],
      announcements: [
        { id: '1', title: 'Exam Registration Deadline', body: 'The deadline has been extended to Friday.', category: 'Urgent', time: '2 hours ago' },
        { id: '2', title: 'Library Trading Hours', body: 'Main library open 24/7 next week.', category: 'Academic', time: '1 day ago' }
      ]
    }
  });
};