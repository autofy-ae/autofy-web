'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, Listing, ListingPhoto, Profile } from '@/lib/supabaseClient';

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

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: l } = await supabase.from('listings').select('*').eq('id', id).maybeSingle();
      if (!l) { setNotFound(true); setLoading(false); return; }
      setListing(l as Listing);

      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from('listing_photos').select('*').eq('listing_id', id).order('position', { ascending: true }),
        supabase.from('profiles').select('id, full_name, phone, whatsapp_preferred').eq('id', l.owner_id).maybeSingle()
      ]);
      setPhotos((p || []) as ListingPhoto[]);
      setSeller(s as Profile | null);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>;
  if (notFound || !listing) {
    return (
      <div className="empty">
        <div className="display">Listing not found</div>
        <p>It may have been removed or taken down by the owner.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="detail-photo" style={{ position: 'relative' }}>
        {photos.length > 0 ? (
          <img src={photos[activePhoto]?.url} alt={`${listing.year} ${listing.make} ${listing.model}`} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B9C6CF' }} className="display">
            No photos provided
          </div>
        )}
        {photos.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={() => setActivePhoto((activePhoto - 1 + photos.length) % photos.length)}
              className="photo-nav-arrow"
              style={{ left: 10 }}
            >
              ‹
            </button>
            <button
              aria-label="Next photo"
              onClick={() => setActivePhoto((activePhoto + 1) % photos.length)}
              className="photo-nav-arrow"
              style={{ right: 10 }}
            >
              ›
            </button>
            <div className="photo-counter mono">{activePhoto + 1} / {photos.length}</div>
          </>
        )}
      </div>

      <h2 className="display" style={{ fontSize: 24, textTransform: 'none', margin: '0 0 6px' }}>
        {listing.year} {listing.make} {listing.model}
      </h2>
      <div className="mono" style={{ fontWeight: 700, fontSize: 20, color: 'var(--maroon)' }}>{formatPrice(listing.price)}</div>

      <div className="spec-grid">
        <div><div className="k">Year</div><div className="v">{listing.year}</div></div>
        <div><div className="k">Trim</div><div className="v">{listing.trim || '—'}</div></div>
        <div><div className="k">Kilometers</div><div className="v">{listing.mileage ? `${listing.mileage.toLocaleString('en-US')} km` : '—'}</div></div>
        <div><div className="k">Specification</div><div className="v">{listing.specification || '—'}</div></div>
        <div><div className="k">Location</div><div className="v">{listing.location || '—'}</div></div>
        <div><div className="k">Exterior color</div><div className="v">{listing.exterior_color || '—'}</div></div>
        <div><div className="k">Interior color</div><div className="v">{listing.interior_color || '—'}</div></div>
        <div><div className="k">Drivetrain</div><div className="v">{listing.drivetrain || '—'}</div></div>
        <div><div className="k">Fuel type</div><div className="v">{listing.fuel_type || '—'}</div></div>
        <div><div className="k">Engine</div><div className="v">{listing.engine || '—'}</div></div>
        <div><div className="k">Transmission</div><div className="v">{listing.transmission || '—'}</div></div>
        <div><div className="k">Seats</div><div className="v">{listing.seats ? (listing.seats >= 8 ? '8+' : listing.seats) : '—'}</div></div>
        <div><div className="k">Horsepower</div><div className="v">{listing.horsepower_exact ? `${listing.horsepower_exact} bhp` : (listing.horsepower || '—')}</div></div>
        <div><div className="k">Listed</div><div className="v">{timeAgo(listing.created_at)}</div></div>
      </div>

      <div className="desc">{listing.description || 'No description provided.'}</div>

      {seller && (
        <div className="contact-box">
          <div className="who">Seller</div>
          <div className="name display" style={{ textTransform: 'none' }}>{seller.full_name}</div>
          {seller.whatsapp_preferred && (
            <div className="contact-row">
              <span className="num mono" style={{ fontSize: 13 }}>The seller prefers to be contacted via WhatsApp</span>
              <a
                href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#25D366', color: '#0B0B0C' }}
              >
                WhatsApp
              </a>
            </div>
          )}
          <div className="contact-row">
            <span className="num mono">{seller.phone}</span>
            <a href={`tel:${seller.phone.replace(/[^0-9+]/g, '')}`}>Call</a>
          </div>
        </div>
      )}
    </div>
  );
}
