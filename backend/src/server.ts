import "dotenv/config";
import app from "./app";
import { testDbConnection } from "./utils/testDbConnection";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Verify database is reachable before accepting any traffic
  await testDbConnection();

  // 2. Start the HTTP server
  app.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
};

// Catch any startup errors (e.g. port already in use)
startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});