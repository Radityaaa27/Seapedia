import { prisma } from "../lib/prisma";
import { logger } from "./logger";

// Runs a lightweight query ($queryRaw with SELECT 1) to verify
// the database is reachable before the server starts accepting traffic.
// If this fails, we log clearly and exit — a silent failure here
// would cause confusing errors later on every request.

export const testDbConnection = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("✅ Database connection established successfully.");
  } catch (error) {
    logger.error("❌ Failed to connect to the database.", error);
    logger.error("Check your DATABASE_URL in .env and ensure PostgreSQL is running.");
    process.exit(1); // Exit the process — no point starting without a DB
  }
};