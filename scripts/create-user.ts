import { PrismaClient } from '../src/generated/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'testuser';
  const password = 'password123';
  const email = 'testuser@example.com';
  
  console.log(`Creating user: ${username}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        password_hash: hashedPassword,
        email
      },
      create: {
        username,
        email,
        password_hash: hashedPassword,
      }
    });
    console.log(`User ready:`);
    console.log(`Username: ${user.username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${user.email}`);

    // Create BMI records with different dates
    console.log('Creating BMI records with different dates...');

    // Delete existing records for this user to avoid duplicates on re-run
    await prisma.bMIRecord.deleteMany({
      where: { user_id: user.id }
    });

    const records = [
      {
        weight: 80,
        height: 180,
        bmi: 80 / ((180/100) * (180/100)),
        recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        weight: 78,
        height: 180,
        bmi: 78 / ((180/100) * (180/100)),
        recorded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        weight: 76,
        height: 180,
        bmi: 76 / ((180/100) * (180/100)),
        recorded_at: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ];

    for (const r of records) {
      await prisma.bMIRecord.create({
        data: {
          user_id: user.id,
          weight: r.weight,
          height: r.height,
          bmi: r.bmi,
          recorded_at: r.recorded_at
        }
      });
    }

    console.log(`Created ${records.length} BMI records for ${username}`);

  } catch (e) {
    console.error('Error creating user/records:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
