import { query } from '@/lib/db';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  if ('status' in body) {
    const allowed = ['senere', 'igang', 'venter', 'færdig'];
    if (!allowed.includes(body.status)) return Response.json({ error: 'invalid status' }, { status: 400 });
    const res = await query('UPDATE items SET status=$1 WHERE id=$2 RETURNING *', [body.status, id]);
    if (!res.rows.length) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json(res.rows[0]);
  }

  if ('priority' in body) {
    const p = parseInt(body.priority);
    if (p < 1 || p > 5) return Response.json({ error: 'priority must be 1-5' }, { status: 400 });
    const res = await query('UPDATE items SET priority=$1 WHERE id=$2 RETURNING *', [p, id]);
    if (!res.rows.length) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json(res.rows[0]);
  }

  return Response.json({ error: 'nothing to update' }, { status: 400 });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await query('DELETE FROM items WHERE id=$1', [id]);
  return new Response(null, { status: 204 });
}
