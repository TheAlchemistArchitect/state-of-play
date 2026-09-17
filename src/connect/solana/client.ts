import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import type { AppConfig } from '../../config/env.js';

export function createSolanaClient(config: AppConfig) {
  const endpoint = config.rpcUrl ?? (config.heliusApiKey ? `https://${config.solanaCluster === 'devnet' ? 'devnet.' : ''}helius-rpc.com/?api-key=${config.heliusApiKey}` : `https://api.${config.solanaCluster}.solana.com`);
  const connection = new Connection(endpoint, 'confirmed');
  const publicKey = config.burnerPrivateKey ? loadBurnerWallet(config.burnerPrivateKey).publicKey : undefined;
  return { connection, publicKey, endpoint, balance: async () => publicKey ? connection.getBalance(publicKey, 'confirmed').then(lamports => ({ lamports, sol: lamports / LAMPORTS_PER_SOL })) : null, health: async () => connection.getLatestBlockhash('confirmed').then(() => true).catch(() => false) };
}
export function loadBurnerWallet(encoded: string): Keypair {
  try { const value = encoded.trim(); const bytes = value.startsWith('[') ? Uint8Array.from(JSON.parse(value)) : bs58.decode(value); return Keypair.fromSecretKey(bytes); }
  catch { throw new Error('BURNER_WALLET_PRIVATE_KEY is not a valid base58 key or Solana JSON keypair'); }
}
export function parsePublicKey(address: string): PublicKey { return new PublicKey(address); }
