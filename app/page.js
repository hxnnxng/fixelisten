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
          <div className="empty">Ingen opgaver endnu — send /fix + billede til HenningClaw.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Billede</th>
                <th>Beskrivelse</th>
                <th>Status</th>
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
                  <td className="status-cell">
                    <select
                      className={STATUS_CLASS[it.status] ?? 'senere'}
                      value={it.status}
                      onChange={e => updateStatus(it.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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
