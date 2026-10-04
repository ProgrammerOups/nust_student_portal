import { Request, Response } from 'express';

// In-memory fallback list matching the SQLite student record
let studentsStore = [
  {
    id: '1',
    studentId: 'N02529096Q',
    firstName: 'Munashe Caleb Brendon',
    lastName: 'Dhliwayo',
    year: 1,
    program: 'Computer Science'
  }
];

// 1. Get All Students or Search by Student Number (matches GET ?student_number=)
export const getStudents = async (req: Request, res: Response) => {
  const searchQuery = (req.query.studentNumber as string || '').trim().toLowerCase();

  if (searchQuery) {
    const filtered = studentsStore.filter(s => s.studentId.toLowerCase().includes(searchQuery));
    return res.status(200).json({ success: true, data: filtered });
  }

  return res.status(200).json({ success: true, data: studentsStore });
};

// 2. Create Student (matches POST action=create)
export const createStudent = async (req: Request, res: Response) => {
  const { studentId, firstName, lastName, year, program } = req.body;

  if (!studentId || !firstName || !lastName || !program) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const newStudent = {
    id: String(Date.now()),
    studentId,
    firstName,
    lastName,
    year: Number(year) || 1,
    program
  };

  studentsStore.push(newStudent);
  return res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
};

// 3. Update Student (matches POST action=update)
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, firstName, lastName, year, program } = req.body;

  const index = studentsStore.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  studentsStore[index] = {
    ...studentsStore[index],
    studentId: studentId || studentsStore[index].studentId,
    firstName: firstName || studentsStore[index].firstName,
    lastName: lastName || studentsStore[index].lastName,
    year: year ? Number(year) : studentsStore[index].year,
    program: program || studentsStore[index].program,
  };

  return res.status(200).json({ success: true, message: 'Student updated successfully', data: studentsStore[index] });
};

// 4. Delete Student (matches GET ?delete=id)
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = studentsStore.length;
  
  studentsStore = studentsStore.filter(s => s.id !== id);

  if (studentsStore.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  return res.status(200).json({ success: true, message: 'Student deleted successfully.' });
};