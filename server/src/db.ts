import initSqlJs, { type Database, type SqlValue } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedRealData } from './realSeed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data.db');

let db: Database;

export function getDb(): Database {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      email         TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      role          TEXT    NOT NULL DEFAULT 'team_member',
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS item_master (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      is_active  INTEGER NOT NULL DEFAULT 1,
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      item_master_id     INTEGER NOT NULL REFERENCES item_master(id),
      item_name_snapshot TEXT    NOT NULL,
      category           TEXT    NOT NULL DEFAULT '',
      specification      TEXT    NOT NULL DEFAULT '',
      quantity           INTEGER NOT NULL DEFAULT 1,
      price              REAL    NOT NULL DEFAULT 0,
      status             TEXT    NOT NULL DEFAULT 'In Use',
      ownership_type     TEXT    NOT NULL DEFAULT 'team',
      owner_user_id      INTEGER REFERENCES users(id),
      receiver_user_name TEXT    NOT NULL DEFAULT '',
      registration_date  TEXT    NOT NULL DEFAULT (date('now')),
      notes              TEXT    NOT NULL DEFAULT '',
      created_by_user_id INTEGER NOT NULL REFERENCES users(id),
      created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  saveDb();
}

export function seedDb() {
  const [{ values }] = db.exec('SELECT COUNT(*) as c FROM users');
  if ((values[0][0] as number) > 0) return;
  seedRealData(db);
  saveDb();
}

export function runQuery(sql: string, params: unknown[] = []) {
  db.run(sql, params as SqlValue[]);
  saveDb();
}

export function getOne(sql: string, params: unknown[] = []): Record<string, unknown> | undefined {
  const stmt = db.prepare(sql);
  stmt.bind(params as SqlValue[]);
  if (stmt.step()) {
    const cols = stmt.getColumnNames();
    const vals = stmt.get();
    stmt.free();
    const row: Record<string, unknown> = {};
    cols.forEach((c: string, i: number) => { row[c] = vals[i]; });
    return row;
  }
  stmt.free();
  return undefined;
}

export function getAll(sql: string, params: unknown[] = []): Record<string, unknown>[] {
  const stmt = db.prepare(sql);
  stmt.bind(params as SqlValue[]);
  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    const cols = stmt.getColumnNames();
    const vals = stmt.get();
    const row: Record<string, unknown> = {};
    cols.forEach((c: string, i: number) => { row[c] = vals[i]; });
    results.push(row);
  }
  stmt.free();
  return results;
}

export function runInsert(sql: string, params: unknown[] = []): number {
  db.run(sql, params as SqlValue[]);
  const result = db.exec('SELECT last_insert_rowid()');
  saveDb();
  return result[0].values[0][0] as number;
}
