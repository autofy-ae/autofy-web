'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthContext';
import { SPECIFICATIONS, DRIVETRAINS, FUEL_TYPES, ENGINES, TRANSMISSIONS, SEAT_OPTIONS, EXTERIOR_COLORS, INTERIOR_COLORS, HORSEPOWER_RANGES } from '@/lib/vehicleOptions';
import { UAE_CITIES } from '@/lib/uaeCities';
import { MAKE_MODELS } from '@/lib/carModels';

const MAX_PHOTOS = 10;
const MAKES = Object.keys(MAKE_MODELS).sort();

export default function SellPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [make, setMake] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [trim, setTrim] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specification, setSpecification] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  const [customInteriorColor, setCustomInteriorColor] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [customExteriorColor, setCustomExteriorColor] = useState('');
  const [drivetrain, setDrivetrain] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [engine, setEngine] = useState('');
  const [transmission, setTransmission] = useState('');
  const [seats, setSeats] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  if (loading) return null;

  if (!user) {
    return (
      <div className="empty">
        <div className="display">Sign in to list a car</div>
        <p>You need an Autofy account before you can post a listing.</p>
        <Link href="/login" className="btn">Sign in / create account</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty">
        <div className="display">Finishing account setup</div>
        <p>This is taking longer than usual. Try refreshing the page.</p>
        <button className="btn" onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    const combined = [...files, ...picked].slice(0, MAX_PHOTOS);
    setFiles(combined);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  async function submitListing() {
    setError('');
    const finalMake = make === 'Other' ? customMake.trim() : make;
    const finalModel = model === 'Other' ? customModel.trim() : model;
    const finalInteriorColor = interiorColor === 'Other' ? customInteriorColor.trim() : interiorColor;
    const finalExteriorColor = exteriorColor === 'Other' ? customExteriorColor.trim() : exteriorColor;
    if (!finalMake || !finalModel || !year || !price) {
      setError('Make, model, year, and price are required.');
      return;
    }
    if (!mileage) {
      setError('Kilometers driven is required.');
      return;
    }
    if (!location) {
      setError('Location is required.');
      return;
    }
    if (!finalExteriorColor) {
      setError('Exterior color is required.');
      return;
    }
    if (!finalInteriorColor) {
      setError('Interior color is required.');
      return;
    }
    setBusy(true);
    setProgress('Creating listing…');

    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        owner_id: user!.id,
        make: finalMake,
        model: finalModel,
        year: Number(year),
        price: Number(price),
        mileage: mileage ? Number(mileage) : null,
        location: location.trim() || null,
        description: description.trim() || null,
        trim: trim.trim() || null,
        specification: specification || null,
        interior_color: finalInteriorColor || null,
        exterior_color: finalExteriorColor || null,
        drivetrain: drivetrain || null,
        fuel_type: fuelType || null,
        engine: engine || null,
        transmission: transmission || null,
        seats: seats ? Number(seats) : null,
        horsepower: horsepower || null
      })
      .select()
      .single();

    if (insertError || !listing) {
      setBusy(false);
      setError(insertError?.message || 'Could not create the listing.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading photo ${i + 1} of ${files.length}…`);
      const file = files[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user!.id}/${listing.id}/${i}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('listing-photos').upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (uploadError) continue;
      const { data: pub } = supabase.storage.from('listing-photos').getPublicUrl(path);
      await supabase.from('listing_photos').insert({
        listing_id: listing.id,
        url: pub.publicUrl,
        position: i
      });
    }

    setBusy(false);
    router.push(`/listing/${listing.id}`);
  }

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <h2 className="display" style={{ fontSize: 20, margin: 0 }}>List your car</h2>
      </div>
      <div className="panel">
        <p className="sub">Fill in the details buyers care about most. It stays up for 30 days.</p>
        <div className="contact-chip">
          Buyers will contact <b>{profile.full_name}</b> at <b>{profile.phone}</b>{profile.whatsapp_preferred ? ' (Preference - WhatsApp)' : ''}.
        </div>

        <div className="row2">
          <div className="field">
            <label>Make</label>
            <select value={make} onChange={(e) => { setMake(e.target.value); setModel(''); }}>
              <option value="">Select a make</option>
              {MAKES.map((m) => (<option key={m} value={m}>{m}</option>))}
              <option value="Other">Other</option>
            </select>
            {make === 'Other' && (
              <input type="text" placeholder="Type the make" value={customMake} onChange={(e) => setCustomMake(e.target.value)} style={{ marginTop: 8 }} />
            )}
          </div>
          <div className="field">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
              <option value="">{make ? 'Select a model' : 'Select a make first'}</option>
              {make && make !== 'Other' && (MAKE_MODELS[make] || []).map((m) => (<option key={m} value={m}>{m}</option>))}
              <option value="Other">Other</option>
            </select>
            {model === 'Other' && (
              <input type="text" placeholder="Type the model" value={customModel} onChange={(e) => setCustomModel(e.target.value)} style={{ marginTop: 8 }} />
            )}
          </div>
        </div>
        <div className="row2">
          <div className="field"><label>Trim (optional)</label><input type="text" placeholder="SE, Limited, etc." value={trim} onChange={(e) => setTrim(e.target.value)} /></div>
          <div className="field">
            <label>Specification</label>
            <select value={specification} onChange={(e) => setSpecification(e.target.value)}>
              <option value="">Not specified</option>
              {SPECIFICATIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field"><label>Year</label><input type="number" placeholder="2019" min={1950} max={2027} value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div className="field"><label>Price (AED)</label><input type="number" placeholder="53000" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="field"><label>Kilometers</label><input type="number" placeholder="62000" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} /></div>
          <div className="field">
            <label>Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select a city</option>
              {UAE_CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Exterior color</label>
            <select value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)}>
              <option value="">Select a color</option>
              {EXTERIOR_COLORS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            {exteriorColor === 'Other' && (
              <input type="text" placeholder="Type the color" value={customExteriorColor} onChange={(e) => setCustomExteriorColor(e.target.value)} style={{ marginTop: 8 }} />
            )}
          </div>
          <div className="field">
            <label>Interior color</label>
            <select value={interiorColor} onChange={(e) => setInteriorColor(e.target.value)}>
              <option value="">Select a color</option>
              {INTERIOR_COLORS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            {interiorColor === 'Other' && (
              <input type="text" placeholder="Type the color" value={customInteriorColor} onChange={(e) => setCustomInteriorColor(e.target.value)} style={{ marginTop: 8 }} />
            )}
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Drivetrain</label>
            <select value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)}>
              <option value="">Not specified</option>
              {DRIVETRAINS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Fuel type</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="">Not specified</option>
              {FUEL_TYPES.map((f) => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Engine</label>
            <select value={engine} onChange={(e) => setEngine(e.target.value)}>
              <option value="">Not specified</option>
              {ENGINES.map((e2) => (<option key={e2} value={e2}>{e2}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Transmission</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Not specified</option>
              {TRANSMISSIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Seats</label>
            <select value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="">Not specified</option>
              {SEAT_OPTIONS.map((s) => (<option key={s} value={s}>{s === 6 ? '6+' : s}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Horsepower range</label>
            <select value={horsepower} onChange={(e) => setHorsepower(e.target.value)}>
              <option value="">Not specified</option>
              {HORSEPOWER_RANGES.map((h) => (<option key={h} value={h}>{h}</option>))}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea placeholder="Condition, service history, why you're selling, anything a buyer should know. Maybe even why you love the car so other car enthusiasts can understand better." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <label>Photos (up to {MAX_PHOTOS})</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} disabled={files.length >= MAX_PHOTOS} />
          <div className="hint">JPEG, PNG, or WebP. Under 5MB each.</div>
          {files.length > 0 && (
            <div className="photo-input-row" style={{ marginTop: 10 }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img className="thumb" src={URL.createObjectURL(f)} alt="" />
                  <button type="button" onClick={() => removeFile(i)} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error-text">{error}</div>}
        {busy && progress && <div className="success-text">{progress}</div>}
        <button className="btn" onClick={submitListing} disabled={busy} style={{ marginTop: 8 }}>
          {busy ? 'Posting…' : 'Post listing'}
        </button>
      </div>
    </>
  );
}
