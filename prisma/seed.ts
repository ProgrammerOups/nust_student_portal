import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed Student User
  const student = await prisma.user.upsert({
    where: { studentId: 'N0123456X' },
    update: {},
    create: {
      studentId: 'N0123456X',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@nust.ac.zw',
      passwordHash: hashedPassword,
      program: 'Computer Science',
      currentGPA: 3.8,
      financials: {
        create: {
          balance: 450.00,
          actionRequired: true,
        },
      },
    },
  });

  console.log('✅ Seeded user:', student.studentId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });