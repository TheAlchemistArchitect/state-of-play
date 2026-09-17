# MYCELIUM CORE — Phase 1

Phase 1 establishes the TypeScript foundation, Helius-compatible Solana connection, burner-wallet balance check, SQLite migrations, and Discord `/status` and `/help` skeleton. It is **DRY_RUN / LIVE_DISARMED only**; no trading code exists yet.

## Run
```bash
cp .env.example .env
npm install
npm test
npm run build
npm run test:real-balance
npm start
```

Set `SOLANA_CLUSTER=devnet` for safe testing. `SOLANA_RPC_URL` may override the Helius endpoint. The private key is accepted only from `BURNER_WALLET_PRIVATE_KEY`; it is never logged or committed. Discord requires `DISCORD_BOT_TOKEN`, `DISCORD_APPLICATION_ID`, `DISCORD_GUILD_ID`, and `DISCORD_ADMIN_USER_ID`.

Register commands with `npm run register-commands`, then invite the application with the `applications.commands` and `bot` scopes. Guild registration is immediate. This phase does not implement trading, `/arm`, or live execution.
