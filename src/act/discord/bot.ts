import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import type { AppConfig } from '../../config/env.js';
import type { AppDatabase } from '../../persistence/database.js';
import type { createSolanaClient } from '../solana/client.js';
import type pino from 'pino';
const commands = [new SlashCommandBuilder().setName('status').setDescription('Show MYCELIUM CORE health and mode'), new SlashCommandBuilder().setName('help').setDescription('Show available Phase 1 commands')];
const isAdmin = (i: ChatInputCommandInteraction, id?: string) => Boolean(id && i.user.id === id);
export function createDiscordBot(config: AppConfig, deps: { database: AppDatabase; solana: ReturnType<typeof createSolanaClient>; logger: pino.Logger }) {
  if (!config.discordToken) return { start: async () => deps.logger.warn('DISCORD_BOT_TOKEN not configured; Discord disabled'), stop: async () => undefined };
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.once('ready', () => deps.logger.info({ user: client.user?.tag }, 'Discord connected'));
  client.on('interactionCreate', async i => { if (!i.isChatInputCommand()) return; if (!isAdmin(i, config.discordAdminUserId)) { await i.reply({ content: 'Unauthorized.', ephemeral: true }); return; }
    if (i.commandName === 'help') return i.reply({ content: 'MYCELIUM CORE Phase 1: /status and /help. Trading is not implemented and cannot be armed.', ephemeral: true });
    if (i.commandName === 'status') { const balance = await deps.solana.balance(); return i.reply({ content: JSON.stringify({ mode: 'DRY_RUN', tradingState: 'LIVE_DISARMED', rpc: await deps.solana.health(), database: true, wallet: balance ? { address: deps.solana.publicKey?.toBase58(), sol: balance.sol } : 'not configured' }, null, 2), ephemeral: true }); }
  });
  return { start: async () => { const rest = new REST({ version: '10' }).setToken(config.discordToken!); if (config.discordGuildId) await rest.put(Routes.applicationGuildCommands(config.discordApplicationId!, config.discordGuildId), { body: commands.map(c => c.toJSON()) }); else await rest.put(Routes.applicationCommands(config.discordApplicationId!), { body: commands.map(c => c.toJSON()) }); await client.login(config.discordToken); }, stop: async () => { client.destroy(); } };
}
