import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a default shift if it doesn't exist
  const defaultShift = await prisma.shift.upsert({
    where: { name: "Default Shift" },
    update: {},
    create: {
      name: "Default Shift",
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  console.log("✅ Default shift seeded:", defaultShift);

  // Assign default shift to all users without a shift
  const usersWithoutShift = await prisma.user.findMany({
    where: { userShift: { none: {} } }, // Users with no assigned shift
  });

  for (const user of usersWithoutShift) {
    await prisma.userShift.create({
      data: {
        userId: user.id,
        shiftId: defaultShift.id,
        startDate: new Date(),
      },
    });
    console.log(` Assigned default shift to user: ${user.fullName}`);
  }
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(() => prisma.$disconnect());
