import { query, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await initDb();
  const res = await query('SELECT * FROM items ORDER BY priority ASC, id ASC');
  return Response.json(res.rows);
}

export async function POST(req) {
  const secret = req.headers.get('x-api-secret');
  if (secret !== process.env.ITEMS_API_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  const { description, image_data } = await req.json();
  if (!description) return Response.json({ error: 'description required' }, { status: 400 });
  const res = await query(
    'INSERT INTO items (description, image_data) VALUES ($1,$2) RETURNING *',
    [description, image_data || null]
  );
  return Response.json(res.rows[0], { status: 201 });
}
