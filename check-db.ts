import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Check for existing users
  const existingUsers = await prisma.user.findMany();

  if (existingUsers.length > 0) {
    console.log('\n--- EXISTING USERS FOUND IN DB ---');
    existingUsers.forEach((u) => {
      console.log(`Student ID: ${u.studentId} | Email: ${u.email} | Name: ${u.firstName} ${u.lastName}`);
    });
    console.log('-----------------------------------\n');
    return;
  }

  // 2. Create test user if DB is empty
  console.log('No users found. Creating test user...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const newUser = await prisma.user.create({
    data: {
      studentId: 'N0248593X',
      firstName: 'Tinashe',
      lastName: 'Ndlovu',
      email: 'tinashe.ndlovu@students.nust.ac.zw',
      passwordHash: hashedPassword,
      program: 'Computer Science',
      year: 2,
      currentGPA: 2.1,
      financials: {
        create: {
          balance: 450.00,
          actionRequired: false,
        },
      },
    },
  });

  console.log('\nSUCCESS: Created Test Student!');
  console.log(`Student ID: ${newUser.studentId}`);
  console.log(`Password:   password123\n`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());