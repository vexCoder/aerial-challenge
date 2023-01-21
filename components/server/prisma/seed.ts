import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany({});

  await prisma.message.create({
    data: {
      message: "Hello World",
      hasImage: true,
    },
  });

  await prisma.message.create({
    data: {
      message: "Hello World2",
    },
  });
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
