import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Email Accounts', slug: 'email-accounts' },
    { name: 'MCD Portal', slug: 'mcd-portal' },
    { name: 'Websites', slug: 'websites' },
  ];

  console.log('Seeding work-related categories for password manager...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
      },
    });
  }
  console.log('Work-related categories seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
