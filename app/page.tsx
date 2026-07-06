'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase, Listing } from '@/lib/supabaseClient';

type Row = Listing & { thumb: string | null };

function formatPrice(p: number) {
  return '$' + Number(p).toLocaleString('en-US');
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
  return Math.floor(d / 30) + 'mo ago';
}

export default function BrowsePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [make, setMake] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
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
    load();
  }, []);

  const makes = useMemo(() => Array.from(new Set(rows.map((r) => r.make))).sort(), [rows]);

  const filtered = rows.filter((r) => {
    if (make && r.make !== make) return false;
    if (minPrice && r.price < Number(minPrice)) return false;
    if (maxPrice && r.price > Number(maxPrice)) return false;
    if (minYear && r.year < Number(minYear)) return false;
    return true;
  });

  return (
    <>
      <div className="hero">
        <h1>Buy and sell cars <span>direct.</span></h1>
        <p>
          Autofy is a free, no-fee classifieds board. List your car, browse what's around, and call the owner
          directly — no payments ever move through the site.
        </p>
      </div>

      <div className="filter-bar">
        <div className="f-field">
          <label>Make</label>
          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">All makes</option>
            {makes.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        <div className="f-field">
          <label>Min price</label>
          <input type="number" placeholder="$0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="f-field">
          <label>Max price</label>
          <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="f-field">
          <label>Year, from</label>
          <input type="number" placeholder="Any" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
        </div>
        {(make || minPrice || maxPrice || minYear) && (
          <div className="f-field">
            <button className="btn secondary" style={{ width: '100%', padding: '10px 14px' }} onClick={() => { setMake(''); setMinPrice(''); setMaxPrice(''); setMinYear(''); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="display" style={{ fontSize: 20, margin: 0 }}>On the lot</h2>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
          {loading ? 'Loading…' : `${filtered.length} listing${filtered.length === 1 ? '' : 's'}`}
        </span>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="display">{rows.length === 0 ? 'The lot is empty' : 'No matches'}</div>
          <p>{rows.length === 0 ? 'No cars listed yet. Be the first — it takes about a minute.' : 'Try widening your filters.'}</p>
          {rows.length === 0 && <Link href="/sell" className="btn">List your car</Link>}
        </div>
      )}

      <div className="grid">
        {filtered.map((l) => (
          <Link key={l.id} href={`/listing/${l.id}`} className="card">
            <div className="photo">
              {l.thumb ? <img src={l.thumb} alt={`${l.year} ${l.make} ${l.model}`} /> : <div className="noimg">No photo</div>}
              <div className="price-tag mono">{formatPrice(l.price)}</div>
            </div>
            <div className="body">
              <h3>{l.year} {l.make} {l.model}</h3>
              <div className="meta">{l.mileage ? `${l.mileage.toLocaleString()} mi · ` : ''}{l.location || 'Location not listed'}</div>
              <div className="foot">
                <span>{timeAgo(l.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
