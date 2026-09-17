import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { readFileSync } from 'node:fs';

export function createDatabase(filename: string) {
  mkdirSync(dirname(filename), { recursive: true });
  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
  const migration = readFileSync(new URL('./migrations/001_initial.sql', import.meta.url), 'utf8');
  if (!db.prepare('SELECT 1 FROM schema_migrations WHERE id = ?').get('001_initial')) {
    const apply = db.transaction(() => { db.exec(migration); db.prepare('INSERT INTO schema_migrations VALUES (?, ?)').run('001_initial', new Date().toISOString()); });
    apply();
  }
  return { db, close: () => db.close() };
}
export type AppDatabase = ReturnType<typeof createDatabase>;
