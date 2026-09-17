import { env } from 'node:process';

export type AppConfig = ReturnType<typeof loadConfig>;
const required = (name: string): string => {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export function loadConfig() {
  const cluster = env.SOLANA_CLUSTER ?? 'devnet';
  if (!['devnet', 'mainnet-beta'].includes(cluster)) throw new Error('SOLANA_CLUSTER must be devnet or mainnet-beta');
  return {
    nodeEnv: env.NODE_ENV ?? 'development', logLevel: env.LOG_LEVEL ?? 'info',
    solanaCluster: cluster as 'devnet' | 'mainnet-beta',
    heliusApiKey: env.HELIUS_API_KEY?.trim() || undefined,
    rpcUrl: env.SOLANA_RPC_URL?.trim() || undefined,
    burnerPrivateKey: env.BURNER_WALLET_PRIVATE_KEY?.trim() || undefined,
    sqlitePath: env.SQLITE_PATH ?? './data/mycelium.sqlite',
    discordToken: env.DISCORD_BOT_TOKEN?.trim() || undefined,
    discordApplicationId: env.DISCORD_APPLICATION_ID?.trim() || undefined,
    discordGuildId: env.DISCORD_GUILD_ID?.trim() || undefined,
    discordAdminUserId: env.DISCORD_ADMIN_USER_ID?.trim() || undefined,
    requireDiscord: Boolean(env.DISCORD_BOT_TOKEN)
  };
}
export { loadConfig as z, required };
