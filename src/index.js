import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { runCongressScraper } from './scrapers/congress.js';
import { streamPredictionMarkets } from './scrapers/predictionMarkets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`[STATEOFPLAY] Production Server operational on port ${PORT}`);
    
    setInterval(async () => {
        try {
            console.log('[DAEMON] Initiating Congressional PDF Ingestion Audit...');
            await runCongressScraper();
        } catch (error) {
            console.error('[DAEMON_ERROR] Ingestion step aborted:', error.message);
        }
    }, 1000 * 60 * 60);
    
    console.log('[DAEMON] Activating Real-time Prediction Order Book Streams...');
    streamPredictionMarkets();
});