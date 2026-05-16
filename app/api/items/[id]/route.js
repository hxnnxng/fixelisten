import { query } from '@/lib/db';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();
  const allowed = ['senere', 'igang', 'venter', 'færdig'];
  if (!allowed.includes(status)) return Response.json({ error: 'invalid status' }, { status: 400 });
  const res = await query('UPDATE items SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
  if (!res.rows.length) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(res.rows[0]);
}

export async function DELETE(req, { params }) {
  const secret = req.headers.get('x-api-secret');
  if (secret !== process.env.ITEMS_API_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await query('DELETE FROM items WHERE id=$1', [id]);
  return new Response(null, { status: 204 });
}
