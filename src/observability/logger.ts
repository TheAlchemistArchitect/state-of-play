import pino from 'pino';
export function createLogger() { return pino({ level: process.env.LOG_LEVEL ?? 'info', redact: { paths: ['*.privateKey', '*.secret', '*.token', '*.burnerPrivateKey'], censor: '[REDACTED]' } }); }
