import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userProgress.upsert({
    where: { userId: "demo-user" },
    update: {
      data: JSON.stringify({
        userId: "demo-user",
        moduleProgress: {},
        badges: ["starter"],
        lastActive: new Date().toISOString(),
      }),
    },
    create: {
      userId: "demo-user",
      data: JSON.stringify({
        userId: "demo-user",
        moduleProgress: {},
        badges: ["starter"],
        lastActive: new Date().toISOString(),
      }),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
