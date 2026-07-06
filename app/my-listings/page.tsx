'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Listing } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthContext';

type Row = Listing & { thumb: string | null };

function formatPrice(p: number) {
  return 'AED ' + Number(p).toLocaleString('en-US');
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
  return Math.floor(d / 30) + 'mo ago';
}

export default function MyListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (!listings) { setRows([]); setLoading(false); return; }
    const ids = listings.map((l) => l.id);
    let photosByListing: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: photos } = await supabase
        .from('listing_photos')
        .select('listing_id, url, position')
        .in('listing_id', ids)
        .order('position', { ascending: true });
      (photos || []).forEach((p) => {
        if (!photosByListing[p.listing_id]) photosByListing[p.listing_id] = p.url;
      });
    }
    setRows(listings.map((l) => ({ ...l, thumb: photosByListing[l.id] || null })));
    setLoading(false);
  }

  useEffect(() => {
    if (!authLoading && user) load();
    if (!authLoading && !user) setLoading(false);
  }, [authLoading, user]);

  async function handleDelete(id: string) {
    if (!confirm("Take this listing down? This can't be undone.")) return;
    const prev = rows;
    setRows(rows.filter((r) => r.id !== id));
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) {
      alert('Could not delete right now. Try again in a moment.');
      setRows(prev);
    }
  }

  if (authLoading || loading) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>;

  if (!user) {
    return (
      <div className="empty">
        <div className="display">Sign in to see your listings</div>
        <p>You need an Autofy account to list and manage cars.</p>
        <Link href="/login" className="btn">Sign in / create account</Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="display" style={{ fontSize: 20, margin: 0 }}>My listings</h2>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{rows.length} posted</span>
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          <div className="display">Nothing listed yet</div>
          <p>Cars you post will show up here so you can manage them.</p>
          <Link href="/sell" className="btn">List your car</Link>
        </div>
      ) : (
        rows.map((l) => (
          <div className="mylisting-row" key={l.id}>
            {l.thumb ? <img src={l.thumb} alt="" /> : <div className="noimg">No photo</div>}
            <div className="info">
              <h4>
                {l.year} {l.make} {l.model}
                {l.status !== 'active' && <span className="badge">{l.status}</span>}
              </h4>
              <div className="meta">{formatPrice(l.price)} · {timeAgo(l.created_at)}</div>
            </div>
            <div className="actions">
              <Link href={`/listing/${l.id}`}>View</Link>
              <button className="del" onClick={() => handleDelete(l.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </>
  );
}
