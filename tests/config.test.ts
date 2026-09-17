import { describe, expect, it } from 'vitest';
import { loadBurnerWallet } from '../src/connect/solana/client.js';
import { loadConfig } from '../src/config/env.js';
describe('Phase 1 configuration', () => { it('defaults to devnet and never requires a key at import time', () => { const old = process.env.SOLANA_CLUSTER; delete process.env.SOLANA_CLUSTER; expect(loadConfig().solanaCluster).toBe('devnet'); if (old) process.env.SOLANA_CLUSTER = old; }); it('rejects malformed wallet material', () => expect(() => loadBurnerWallet('not-a-key')).toThrow()); });
