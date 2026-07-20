'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, Listing, ListingPhoto, Profile } from '@/lib/supabaseClient';
import { computeRating } from '@/lib/rating';

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

      <h2 className="display" style={{ fontSize: 22, textTransform: 'none', margin: '0 0 8px', color: 'var(--ink-soft)', fontWeight: 400 }}>
        {listing.year} {listing.make} {listing.model}{listing.trim ? ` ${listing.trim}` : ''}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div className="mono" style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-0.01em', color: 'var(--maroon)' }}>{formatPrice(listing.price)}</div>
        {(() => {
          const rating = computeRating(listing);
          return rating && (
            <span title={`Condition rating: ${rating.stars}/3`} style={{ display: 'inline-flex', gap: 2, fontSize: 18 }}>
              {[1, 2, 3].map((n) => (
                <span key={n} style={{ color: n <= rating.stars ? 'var(--maroon)' : 'var(--line)' }}>★</span>
              ))}
            </span>
          );
        })()}
      </div>

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
        {listing.service_history && <div><div className="k">Service history</div><div className="v">{listing.service_history}</div></div>}
        {listing.accident_history && <div><div className="k">Accident history</div><div className="v">{listing.accident_history}</div></div>}
        {(listing.warranty !== null && listing.warranty !== undefined) && <div><div className="k">Under warranty</div><div className="v">{listing.warranty ? 'Yes' : 'No'}</div></div>}
        {listing.owners && <div><div className="k">Owners</div><div className="v">{listing.owners}</div></div>}
        {listing.interior_condition && <div><div className="k">Interior condition</div><div className="v">{listing.interior_condition}</div></div>}
        {listing.paint_quality && <div><div className="k">Paint quality</div><div className="v">{listing.paint_quality}</div></div>}
        {(listing.ppf_coating !== null && listing.ppf_coating !== undefined) && <div><div className="k">PPF / ceramic coating</div><div className="v">{listing.ppf_coating ? 'Yes' : 'No'}</div></div>}
        {listing.tyre_condition && <div><div className="k">Tyre condition</div><div className="v">{listing.tyre_condition}</div></div>}
        {listing.import_specs && <div><div className="k">Import specs</div><div className="v">{listing.import_specs}</div></div>}
        <div><div className="k">Listed</div><div className="v">{timeAgo(listing.created_at)}</div></div>
      </div>

      <div className="desc">{listing.description || 'No description provided.'}</div>

      {seller && (
        <div className="contact-box">
          <div className="who">Seller</div>
          <div className="name display" style={{ textTransform: 'none' }}>{seller.full_name}</div>
          {seller.whatsapp_preferred ? (
            <div className="contact-row">
              <span className="num mono" style={{ fontSize: 13 }}>Seller prefers WhatsApp</span>
              <a
                href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message on WhatsApp"
                style={{ background: '#25D366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '7px 10px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0B0B0C" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12.004 2c-5.514 0-9.98 4.467-9.98 9.98 0 1.76.46 3.48 1.335 4.995L2 22l5.13-1.345a9.96 9.96 0 0 0 4.874 1.242h.004c5.513 0 9.98-4.467 9.98-9.98 0-2.665-1.037-5.17-2.922-7.055A9.933 9.933 0 0 0 12.004 2zm0 18.13a8.13 8.13 0 0 1-4.142-1.133l-.297-.176-3.045.799.813-2.968-.193-.305a8.126 8.126 0 0 1-1.246-4.367c0-4.49 3.653-8.144 8.144-8.144 2.176 0 4.22.848 5.759 2.388a8.09 8.09 0 0 1 2.385 5.76c0 4.49-3.653 8.146-8.178 8.146z"/>
                </svg>
              </a>
            </div>
          ) : (
            <div className="contact-row">
              <span className="num mono">{seller.phone}</span>
              <a href={`tel:${seller.phone.replace(/[^0-9+]/g, '')}`}>Call</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
