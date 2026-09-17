import 'dotenv/config';
import { loadConfig } from '../src/config/env.js';
import { createSolanaClient } from '../src/connect/solana/client.js';
const config = loadConfig();
const client = createSolanaClient(config);
if (!client.publicKey) throw new Error('Set BURNER_WALLET_PRIVATE_KEY before running this check');
const balance = await client.balance();
console.log(JSON.stringify({ cluster: config.solanaCluster, address: client.publicKey.toBase58(), balanceSol: balance?.sol }, null, 2));
