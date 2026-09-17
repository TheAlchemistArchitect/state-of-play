import 'dotenv/config';
import { z } from './config/env.js';
import { createLogger } from './observability/logger.js';
import { createDatabase } from './persistence/database.js';
import { createSolanaClient } from './connect/solana/client.js';
import { createDiscordBot } from './act/discord/bot.js';

const logger = createLogger();
const config = z();
const database = createDatabase(config.sqlitePath);
const solana = createSolanaClient(config);
const discord = createDiscordBot(config, { database, solana, logger });

const shutdown = async (signal: string) => {
  logger.info({ signal }, 'shutting down');
  await discord.stop();
  database.close();
};
process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

await discord.start();
logger.info({ cluster: config.solanaCluster, mode: 'DRY_RUN' }, 'MYCELIUM CORE Phase 1 online');
