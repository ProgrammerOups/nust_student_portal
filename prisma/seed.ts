import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Seed student record from SQLite database
  // Inside prisma/seed.ts
const student = await prisma.user.upsert({
  where: { studentId: 'N02529096Q' },
  update: {
    passwordHash: hashedPassword, // <--- Force update the hash for existing user
  },
  create: {
    studentId: 'N02529096Q',
    firstName: 'Munashe Caleb Brendon',
    lastName: 'Dhliwayo',
    email: 'munashe.dhliwayo@nust.ac.zw',
    passwordHash: hashedPassword,
    year: 1,
    program: 'Computer Science',
    currentGPA: 3.9,
    financials: {
      create: {
        balance: 0.00,
        actionRequired: false,
      },
    },
  },
});

  console.log('✅ Seeded student from SQLite:', student.studentId, `${student.firstName} ${student.lastName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });