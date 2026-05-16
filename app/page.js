'use client';

import { useEffect, useState } from 'react';

const STATUSES = ['senere', 'igang', 'venter', 'færdig'];
const STATUS_CLASS = { 'senere': 'senere', 'igang': 'igang', 'venter': 'venter', 'færdig': 'faerdig' };

export default function Home() {
  const [items, setItems] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setItems);
  }, []);

  async function updateStatus(id, status) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status } : it));
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function cyclePriority(id, current) {
    const next = current >= 5 ? 1 : current + 1;
    setItems(prev => prev.map(it => it.id === id ? { ...it, priority: next } : it));
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: next }),
    });
  }

  async function deleteItem(id) {
    setItems(prev => prev.filter(it => it.id !== id));
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
  }

  return (
    <>
      <header>
        <h1>Fixelisten</h1>
        {items && <span>{items.length} opgaver</span>}
      </header>
      <main>
        {items === null ? (
          <div className="empty">Henter...</div>
        ) : items.length === 0 ? (
          <div className="empty">Ingen opgaver endnu — send !fix + billede til HenningClaw.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Billede</th>
                <th>Beskrivelse</th>
                <th>Prioritet</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id}>
                  <td className="num">{i + 1}</td>
                  <td className="thumb">
                    {it.image_data
                      ? <img src={it.image_data} alt="" onClick={() => setLightbox(it.image_data)} />
                      : <div className="no-img">📷</div>}
                  </td>
                  <td className="desc">{it.description}</td>
                  <td className="priority-cell">
                    <button
                      className={`priority-btn p${it.priority ?? 1}`}
                      onClick={() => cyclePriority(it.id, it.priority ?? 1)}
                    >
                      {it.priority ?? 1}
                    </button>
                  </td>
                  <td className="status-cell">
                    <select
                      className={STATUS_CLASS[it.status] ?? 'senere'}
                      value={it.status}
                      onChange={e => updateStatus(it.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="delete-cell">
                    <button className="delete-btn" onClick={() => deleteItem(it.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      )}
    </>
  );
}
