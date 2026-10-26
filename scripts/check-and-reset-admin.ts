import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  for (const u of users) {
    const isMatch = await bcrypt.compare('shivadmin', u.password);
    console.log(`User: ${u.email} | Role: ${u.role} | Password matches "shivadmin": ${isMatch}`);
  }

  // Ensure admin@shiv.com exists with password 'shivadmin'
  const hashedPassword = await bcrypt.hash('shivadmin', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shiv.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'SHIV Admin',
      email: 'admin@shiv.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const verified = await bcrypt.compare('shivadmin', admin.password);
  console.log(`Updated admin@shiv.com, verified password match: ${verified}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
