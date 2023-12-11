import { startApi } from "./api";
import { logger } from "./utils/logger";

(() => {
  try {
    logger.info('Starting the api');
    startApi();
  } catch (error) {
    logger.error(`API error!: ${(error as Error).message}\nExiting...\n`, undefined, error as Error);
    process.exit(1);
  }
})();
