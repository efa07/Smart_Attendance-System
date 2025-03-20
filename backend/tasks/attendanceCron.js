const cron = require("node-cron");
const axios = require("axios");
const moment = require("moment");
const { prisma } = require("../prismaClient");

// function to get holidays from nager api
async function getHolidays(year, countryCode) {
  try {
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    return response.data.map(holiday => holiday.date); // Extract only dates
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    return [];
  }
}

// check if a day is a weekend or holiday
async function isNonWorkingDay(date) {
  const dayOfWeek = date.day(); // Sunday = 0, Saturday = 6
  const formattedDate = date.format("YYYY-MM-DD");

  // Fetch holidays dynamically
  const holidays = await getHolidays(date.year(), "ET"); // Ethiopia == ET

  return dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(formattedDate);
}

// Cron job for marking absent for the morning shift (runs daily at 10:00 AM)
cron.schedule("0 10 * * *", async () => {
  const today = moment();
  if (await isNonWorkingDay(today)) {
    console.log("Today is a weekend or holiday. Skipping morning absent marking.");
    return;
  }

  try {
    console.log("Running morning absent marking cron job");
    const morningStart = today.clone().set({ hour: 8, minute: 30, second: 0 });
    const morningEnd = today.clone().set({ hour: 12, minute: 0, second: 0 });

    const users = await prisma.user.findMany();

    for (const user of users) {
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId: user.id,
          checkIn: { gte: morningStart.toDate(), lt: morningEnd.toDate() },
        },
      });

      if (!attendance) {
        await prisma.attendance.create({
          data: { userId: user.id, status: "absent" },
        });
        console.log(`Marked user ${user.id} absent for morning shift`);
      }
    }
  } catch (error) {
    console.error("Error in morning absent cron job:", error);
  }
});

// Cron job for marking absent for the afternoon shift (runs daily at 3:00 PM)
cron.schedule("0 15 * * *", async () => {
  const today = moment();
  if (await isNonWorkingDay(today)) {
    console.log("Today is a weekend or holiday. Skipping afternoon absent marking.");
    return;
  }

  try {
    console.log("Running afternoon absent marking cron job");
    const afternoonStart = today.clone().set({ hour: 13, minute: 0, second: 0 });
    const afternoonEnd = today.clone().set({ hour: 17, minute: 0, second: 0 });

    const users = await prisma.user.findMany();

    for (const user of users) {
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId: user.id,
          checkIn: { gte: afternoonStart.clone().subtract(1, "hour").toDate(), lt: afternoonEnd.toDate() },
        },
      });

      if (!attendance) {
        await prisma.attendance.create({
          data: { userId: user.id, status: "absent" },
        });
        console.log(`Marked user ${user.id} absent for afternoon shift`);
      }
    }
  } catch (error) {
    console.error("Error in afternoon absent cron job:", error);
  }
});
