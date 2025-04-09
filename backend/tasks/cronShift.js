const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// Run every Monday at midnight
cron.schedule("0 0 * * 1", async () => {
  const users = await prisma.userShift.findMany();
  for (const user of users) {
    const nextShiftId = user.shiftId === "DayShiftId" ? "NightShiftId" : "DayShiftId";
    await prisma.userShift.update({
      where: { id: user.id },
      data: { shiftId: nextShiftId },
    });
  }
  console.log("Rotational shifts updated");
});

