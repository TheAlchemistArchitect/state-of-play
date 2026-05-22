import { Router } from 'express';
import pg from 'pg';

const { Pool } = pg;
export const apiRouter = Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

apiRouter.get('/ledger', async (req, res) => {
    try {
        const query = `
            SELECT p.name, p.chamber, p.party, d.asset_name, d.ticker, 
                   d.transaction_type, d.amount_range, d.transaction_date, d.filing_date
            FROM disclosures d
            JOIN politicians p ON d.politician_id = p.id
            ORDER BY d.filing_date DESC LIMIT 100;
        `;
        const result = await pool.query(query);
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Database pipeline read failure.' });
    }
});

apiRouter.get('/arbitrage', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM market_arbitrage WHERE statistical_gap > 2.0 ORDER BY statistical_gap DESC;');
        res.status(200).json({ success: true, anomalies: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Database pipeline read failure.' });
    }
});