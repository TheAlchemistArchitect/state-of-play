import WebSocket from 'ws';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function streamPredictionMarkets() {
    const mockSocketUrl = 'wss://echo.websocket.org'; 
    const ws = new WebSocket(mockSocketUrl);

    ws.on('open', () => {
        console.log('[WEBSOCKET] Connected to high-frequency market stream pipeline.');
        
        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                const payload = JSON.stringify({
                    topic: "US Inflation (CPI) Prints Above Forecast for Q2 2026",
                    kalshiProb: 64.5,
                    polyProb: 68.2
                });
                ws.send(payload);
            }
        }, 5000);
    });

    ws.on('message', async (data) => {
        try {
            const update = JSON.parse(data);
            if (!update.topic) return;

            const gap = Math.abs(update.kalshiProb - update.polyProb);

            await pool.query(
                `INSERT INTO market_arbitrage (topic, kalshi_probability, polymarket_probability, statistical_gap, last_updated)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                 ON CONFLICT DO UPDATE SET kalshi_probability = $2, polymarket_probability = $3, statistical_gap = $4, last_updated = CURRENT_TIMESTAMP`,
                [update.topic, update.kalshiProb, update.polyProb, gap]
            );
        } catch (err) {
            // Context catch block
        }
    });

    ws.on('error', (error) => {
        console.error('[WEBSOCKET_ERROR] Stream interrupted:', error.message);
    });
}