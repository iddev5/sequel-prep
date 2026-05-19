// Extra installs: tsx dotenv

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const filePath = path.join(process.cwd(), "data", "problems.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const problems = JSON.parse(fileData);

    const dbCount = await prisma.problem.count();

    console.log(`Table len: ${dbCount}; Json len: ${problems.length}`);

    if (dbCount !== problems.length) {
      console.log("Resetting Problem table...");

      // await prisma.problem.deleteMany();
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Problem" RESTART IDENTITY CASCADE;`);

      await prisma.problem.createMany({
        data: problems
      });

      console.log("Problems synced successfully.");
    } else {
      console.log("Already sync.");
    }
  } catch (err) {
    console.error("Sync failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
