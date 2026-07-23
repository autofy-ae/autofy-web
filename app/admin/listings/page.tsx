'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Listing } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthContext';

const ADMIN_EMAILS = [
  'ahmedatif20189@gmail.com',
  'autofy.ae@gmail.com',
  'supersonic561@gmail.com',
];

type Row = Listing;
type SortKey = 'view_count' | 'contact_click_count' | 'created_at';

export default function AdminListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('view_count');

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) { setLoading(false); return; }
    supabase
      .from('listings')
      .select('*')
      .order(sortKey, { ascending: false })
      .then(({ data }) => {
        setRows((data || []) as Row[]);
        setLoading(false);
      });
  }, [authLoading, isAdmin, sortKey]);

  if (authLoading || loading) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>;

  if (!isAdmin) {
    return (
      <div className="empty">
        <div className="display">Not authorized</div>
        <p>This page is restricted.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>Listing engagement</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(['view_count', 'contact_click_count', 'created_at'] as SortKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setSortKey(k)}
            className="mono"
            style={{
              padding: '6px 10px',
              border: '1px solid var(--line)',
              background: sortKey === k ? 'var(--maroon)' : 'transparent',
              color: sortKey === k ? '#fff' : 'var(--ink)',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            {k === 'view_count' ? 'Views' : k === 'contact_click_count' ? 'Contact clicks' : 'Newest'}
          </button>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
            <th style={{ padding: '8px 6px', fontSize: 12 }}>Listing</th>
            <th style={{ padding: '8px 6px', fontSize: 12 }}>Price</th>
            <th style={{ padding: '8px 6px', fontSize: 12 }} className="mono">Views</th>
            <th style={{ padding: '8px 6px', fontSize: 12 }} className="mono">Contact clicks</th>
            <th style={{ padding: '8px 6px', fontSize: 12 }} className="mono">CTR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => {
            const ctr = l.view_count > 0 ? ((l.contact_click_count / l.view_count) * 100).toFixed(1) + '%' : '—';
            return (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 6px' }}>
                  <Link href={`/listing/${l.id}`}>{l.year} {l.make} {l.model}{l.trim ? ` ${l.trim}` : ''}</Link>
                </td>
                <td style={{ padding: '8px 6px' }} className="mono">AED {Number(l.price).toLocaleString('en-US')}</td>
                <td style={{ padding: '8px 6px' }} className="mono">{l.view_count}</td>
                <td style={{ padding: '8px 6px' }} className="mono">{l.contact_click_count}</td>
                <td style={{ padding: '8px 6px' }} className="mono">{ctr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && <p style={{ color: 'var(--ink-soft)', marginTop: 16 }}>No listings yet.</p>}
    </div>
  );
}
