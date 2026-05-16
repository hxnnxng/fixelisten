import { Pool } from 'pg';

let pool;
export function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}
export async function query(sql, params) {
  const client = await getPool().connect();
  try { return await client.query(sql, params); } finally { client.release(); }
}
export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      image_data TEXT,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'senere',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
