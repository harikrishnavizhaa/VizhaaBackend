const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Example: Create a test user if needed
  // const user = await prisma.user.upsert({
  //   where: { mobile: '7339509611' },
  //   update: {},
  //   create: {
  //     mobile: '7339509611',
  //     name: 'Test User',
  //   },
  // });
  // console.log({ user });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
