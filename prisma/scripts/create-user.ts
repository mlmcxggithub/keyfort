const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");

function generateRandomPassword() {
  return randomBytes(16).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '@')
    .slice(0, 16);
}

async function main() {
  try {
    console.log("Seeding database with users...");

    const users = [
      { email: "jgvigilia@cxg.com" },
    ];

    for (const user of users) {
      if (!user.email || !user.email.includes('@')) {
        throw new Error(`Invalid email format: ${user.email}`);
      }
    }

    await Promise.all(users.map(async (user) => {
      const randomPassword = generateRandomPassword();
      console.log(`Generated password for ${user.email}: ${randomPassword}`);

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            hashedPassword: hashedPassword,
          },
        });
      } catch (error) {
        console.error(`Failed to create/update user ${user.email}:`, error);
        throw error;
      }
    }));

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

// Execute the seeding function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
