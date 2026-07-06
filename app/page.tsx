'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase, Listing } from '@/lib/supabaseClient';
import { SPECIFICATIONS, DRIVETRAINS, FUEL_TYPES, ENGINES, TRANSMISSIONS, SEAT_OPTIONS } from '@/lib/vehicleOptions';
import { MAKE_MODELS } from '@/lib/carModels';

type Row = Listing & { thumb: string | null };

const COMMON_MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge',
  'Ford', 'GMC', 'Genesis', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep',
  'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini',
  'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota',
  'Volkswagen', 'Volvo'
];

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

export default function BrowsePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [trim, setTrim] = useState('');
  const [specification, setSpecification] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minKm, setMinKm] = useState('');
  const [maxKm, setMaxKm] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [drivetrain, setDrivetrain] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [engine, setEngine] = useState('');
  const [transmission, setTransmission] = useState('');
  const [seats, setSeats] = useState('');
  const [minHp, setMinHp] = useState('');
  const [maxHp, setMaxHp] = useState('');

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

  const makes = useMemo(() => {
    const fromListings = rows.map((r) => r.make);
    return Array.from(new Set([...COMMON_MAKES, ...fromListings])).sort();
  }, [rows]);

  const availableModels = useMemo(() => {
    if (make && MAKE_MODELS[make]) return MAKE_MODELS[make];
    const allModels = Object.values(MAKE_MODELS).flat();
    const fromListings = rows.map((r) => r.model);
    return Array.from(new Set([...allModels, ...fromListings])).sort();
  }, [make, rows]);

  const quickActive = make || model || minPrice || maxPrice;
  const advancedActive = trim || specification || minYear || maxYear || minKm || maxKm || interiorColor ||
    exteriorColor || drivetrain || fuelType || engine || transmission || seats || minHp || maxHp;

  function clearAll() {
    setMake(''); setModel(''); setMinPrice(''); setMaxPrice('');
    setTrim(''); setSpecification(''); setMinYear(''); setMaxYear(''); setMinKm(''); setMaxKm('');
    setInteriorColor(''); setExteriorColor(''); setDrivetrain(''); setFuelType('');
    setEngine(''); setTransmission(''); setSeats(''); setMinHp(''); setMaxHp('');
  }

  const filtered = rows.filter((r) => {
    if (make && r.make !== make) return false;
    if (model && r.model !== model) return false;
    if (minPrice && r.price < Number(minPrice)) return false;
    if (maxPrice && r.price > Number(maxPrice)) return false;
    if (trim && !(r.trim || '').toLowerCase().includes(trim.toLowerCase())) return false;
    if (specification && r.specification !== specification) return false;
    if (minYear && r.year < Number(minYear)) return false;
    if (maxYear && r.year > Number(maxYear)) return false;
    if (minKm && (r.mileage ?? -1) < Number(minKm)) return false;
    if (maxKm && (r.mileage ?? Infinity) > Number(maxKm)) return false;
    if (interiorColor && !(r.interior_color || '').toLowerCase().includes(interiorColor.toLowerCase())) return false;
    if (exteriorColor && !(r.exterior_color || '').toLowerCase().includes(exteriorColor.toLowerCase())) return false;
    if (drivetrain && r.drivetrain !== drivetrain) return false;
    if (fuelType && r.fuel_type !== fuelType) return false;
    if (engine && r.engine !== engine) return false;
    if (transmission && r.transmission !== transmission) return false;
    if (seats) {
      const wanted = Number(seats);
      const has = r.seats ?? -1;
      if (wanted === 8 ? has < 8 : has !== wanted) return false;
    }
    if (minHp && (r.horsepower ?? -1) < Number(minHp)) return false;
    if (maxHp && (r.horsepower ?? Infinity) > Number(maxHp)) return false;
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
        <span className="swoosh"></span>
      </div>

      <div className="filter-bar">
        <div className="f-field">
          <label>Make</label>
          <select value={make} onChange={(e) => { setMake(e.target.value); setModel(''); }}>
            <option value="">All makes</option>
            {makes.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        <div className="f-field">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="">All models</option>
            {availableModels.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        <div className="f-field">
          <label>Min price</label>
          <input type="number" placeholder="AED 0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="f-field">
          <label>Max price</label>
          <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: showMore ? 12 : 22, flexWrap: 'wrap' }}>
        <button className="btn-highlight" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Hide filters' : 'More filters'}{advancedActive ? ' •' : ''}
        </button>
        {(quickActive || advancedActive) && (
          <button className="btn secondary" onClick={clearAll}>Clear all filters</button>
        )}
      </div>

      {showMore && (
        <div className="filter-bar" style={{ marginBottom: 22 }}>
          <div className="f-field">
            <label>Trim</label>
            <input type="text" placeholder="Any" value={trim} onChange={(e) => setTrim(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Specification</label>
            <select value={specification} onChange={(e) => setSpecification(e.target.value)}>
              <option value="">Any</option>
              {SPECIFICATIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Year, from</label>
            <input type="number" placeholder="Any" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Year, to</label>
            <input type="number" placeholder="Any" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Min km</label>
            <input type="number" placeholder="0" value={minKm} onChange={(e) => setMinKm(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Max km</label>
            <input type="number" placeholder="Any" value={maxKm} onChange={(e) => setMaxKm(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Interior color</label>
            <input type="text" placeholder="Any" value={interiorColor} onChange={(e) => setInteriorColor(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Exterior color</label>
            <input type="text" placeholder="Any" value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Drive type</label>
            <select value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)}>
              <option value="">Any</option>
              {DRIVETRAINS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Fuel type</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="">Any</option>
              {FUEL_TYPES.map((f) => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Engine</label>
            <select value={engine} onChange={(e) => setEngine(e.target.value)}>
              <option value="">Any</option>
              {ENGINES.map((e2) => (<option key={e2} value={e2}>{e2}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Transmission</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Any</option>
              {TRANSMISSIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Seats</label>
            <select value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="">Any</option>
              {SEAT_OPTIONS.map((s) => (<option key={s} value={s}>{s === 8 ? '8 or more' : s}</option>))}
            </select>
          </div>
          <div className="f-field">
            <label>Min horsepower</label>
            <input type="number" placeholder="0" value={minHp} onChange={(e) => setMinHp(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Max horsepower</label>
            <input type="number" placeholder="Any" value={maxHp} onChange={(e) => setMaxHp(e.target.value)} />
          </div>
        </div>
      )}

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
              <div className="meta">{l.mileage ? `${l.mileage.toLocaleString()} km · ` : ''}{l.location || 'Location not listed'}</div>
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
