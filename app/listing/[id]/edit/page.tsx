'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, ListingPhoto } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthContext';
import { SPECIFICATIONS, DRIVETRAINS, FUEL_TYPES, ENGINES, TRANSMISSIONS, SEAT_OPTIONS, EXTERIOR_COLORS, INTERIOR_COLORS, HORSEPOWER_RANGES, rangeForExactHorsepower } from '@/lib/vehicleOptions';
import { UAE_CITIES } from '@/lib/uaeCities';
import { MAKE_MODELS } from '@/lib/carModels';
import { compressImage } from '@/lib/compressImage';

const MAX_PHOTOS = 10;
const MAKES = Object.keys(MAKE_MODELS).sort();

export default function EditListingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [loadingListing, setLoadingListing] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

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
  const [horsepowerExact, setHorsepowerExact] = useState('');

  const [existingPhotos, setExistingPhotos] = useState<ListingPhoto[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  useEffect(() => {
    async function load() {
      if (!id || !user) return;
      setLoadingListing(true);
      const { data: listing } = await supabase.from('listings').select('*').eq('id', id).maybeSingle();
      if (!listing) { setNotFound(true); setLoadingListing(false); return; }
      if (listing.owner_id !== user.id) { setForbidden(true); setLoadingListing(false); return; }

      setMake(MAKES.includes(listing.make) ? listing.make : 'Other');
      if (!MAKES.includes(listing.make)) setCustomMake(listing.make);
      const modelsForMake = MAKE_MODELS[listing.make] || [];
      setModel(modelsForMake.includes(listing.model) ? listing.model : 'Other');
      if (!modelsForMake.includes(listing.model)) setCustomModel(listing.model);

      setTrim(listing.trim || '');
      setYear(String(listing.year));
      setPrice(String(listing.price));
      setMileage(listing.mileage != null ? String(listing.mileage) : '');
      setLocation(listing.location || '');
      setDescription(listing.description || '');
      setSpecification(listing.specification || '');

      setExteriorColor(EXTERIOR_COLORS.includes(listing.exterior_color) ? listing.exterior_color : (listing.exterior_color ? 'Other' : ''));
      if (listing.exterior_color && !EXTERIOR_COLORS.includes(listing.exterior_color)) setCustomExteriorColor(listing.exterior_color);
      setInteriorColor(INTERIOR_COLORS.includes(listing.interior_color) ? listing.interior_color : (listing.interior_color ? 'Other' : ''));
      if (listing.interior_color && !INTERIOR_COLORS.includes(listing.interior_color)) setCustomInteriorColor(listing.interior_color);

      setDrivetrain(listing.drivetrain || '');
      setFuelType(listing.fuel_type || '');
      setEngine(listing.engine || '');
      setTransmission(listing.transmission || '');
      setSeats(listing.seats != null ? String(listing.seats) : '');
      setHorsepower(listing.horsepower || '');
      setHorsepowerExact(listing.horsepower_exact != null ? String(listing.horsepower_exact) : '');

      const { data: photos } = await supabase.from('listing_photos').select('*').eq('listing_id', id).order('position', { ascending: true });
      setExistingPhotos((photos || []) as ListingPhoto[]);
      setLoadingListing(false);
    }
    if (!authLoading && user) load();
  }, [id, user, authLoading]);

  if (authLoading || loadingListing) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>;

  if (!user) {
    return (
      <div className="empty">
        <div className="display">Sign in to edit this listing</div>
        <Link href="/login" className="btn">Sign in / create account</Link>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="empty">
        <div className="display">Listing not found</div>
        <p>It may have already been removed.</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="empty">
        <div className="display">Not your listing</div>
        <p>You can only edit listings you posted yourself.</p>
      </div>
    );
  }

  const totalPhotoCount = existingPhotos.length - removedPhotoIds.length + newFiles.length;

  async function processFiles(incoming: File[]) {
    const room = MAX_PHOTOS - totalPhotoCount;
    const picked = incoming.filter((f) => f.type.startsWith('image/')).slice(0, room);
    if (picked.length === 0) return;
    setCompressing(true);
    try {
      const compressed = await Promise.all(picked.map((f) => compressImage(f)));
      setNewFiles((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error('Compression failed, using original files:', err);
      setNewFiles((prev) => [...prev, ...picked]);
    } finally {
      setCompressing(false);
    }
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    await processFiles(Array.from(e.target.files || []));
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    processFiles(Array.from(e.dataTransfer.files || []));
  }

  function removeNewFile(idx: number) {
    setNewFiles(newFiles.filter((_, i) => i !== idx));
  }

  function toggleRemoveExisting(photoId: string) {
    setRemovedPhotoIds((prev) => prev.includes(photoId) ? prev.filter((p) => p !== photoId) : [...prev, photoId]);
  }

  function handleExactHorsepowerChange(value: string) {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    setHorsepowerExact(digitsOnly);
    if (digitsOnly) {
      setHorsepower(rangeForExactHorsepower(Number(digitsOnly)));
    }
  }

  async function submitEdit() {
    setError('');
    const finalMake = make === 'Other' ? customMake.trim() : make;
    const finalModel = model === 'Other' ? customModel.trim() : model;
    const finalInteriorColor = interiorColor === 'Other' ? customInteriorColor.trim() : interiorColor;
    const finalExteriorColor = exteriorColor === 'Other' ? customExteriorColor.trim() : exteriorColor;

    if (!finalMake || !finalModel || !year || !price) {
      setError('Make, model, year, and price are required.');
      return;
    }
    if (!mileage) { setError('Kilometers driven is required.'); return; }
    if (!location) { setError('Location is required.'); return; }
    if (!finalExteriorColor) { setError('Exterior color is required.'); return; }
    if (!finalInteriorColor) { setError('Interior color is required.'); return; }

    setBusy(true);
    setProgress('Saving changes…');

    const { error: updateError } = await supabase
      .from('listings')
      .update({
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
        horsepower: horsepower || null,
        horsepower_exact: horsepowerExact ? Number(horsepowerExact) : null
      })
      .eq('id', id);

    if (updateError) {
      setBusy(false);
      setError(updateError.message);
      return;
    }

    for (const photoId of removedPhotoIds) {
      const photo = existingPhotos.find((p) => p.id === photoId);
      if (photo) {
        const pathMatch = photo.url.split('/listing-photos/')[1];
        if (pathMatch) await supabase.storage.from('listing-photos').remove([pathMatch]);
      }
      await supabase.from('listing_photos').delete().eq('id', photoId);
    }

    const startPosition = existingPhotos.filter((p) => !removedPhotoIds.includes(p.id)).length;
    const failedPhotos: number[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      setProgress(`Uploading photo ${i + 1} of ${newFiles.length}…`);
      const file = newFiles[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${id}/${startPosition + i}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('listing-photos').upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (uploadError) {
        console.error(`Photo ${i + 1} failed to upload:`, uploadError.message);
        failedPhotos.push(i + 1);
        continue;
      }
      const { data: pub } = supabase.storage.from('listing-photos').getPublicUrl(path);
      await supabase.from('listing_photos').insert({
        listing_id: id,
        url: pub.publicUrl,
        position: startPosition + i
      });
    }

    setBusy(false);
    if (failedPhotos.length > 0) {
      setError(`Changes saved, but photo${failedPhotos.length > 1 ? 's' : ''} ${failedPhotos.join(', ')} couldn't be uploaded. Try adding again.`);
      return;
    }
    router.push(`/listing/${id}`);
  }

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <h2 className="display" style={{ fontSize: 20, margin: 0 }}>Edit listing</h2>
      </div>
      <div className="panel">
        <p className="sub">Update any details — price, specs, or photos — and save.</p>

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
          <div className="field"><label>Year</label><input type="number" min={1950} max={2027} value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div className="field"><label>Price (AED)</label><input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="field"><label>Kilometers</label><input type="number" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} /></div>
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
            <label>Drivetrain (optional)</label>
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
            <label>Engine (optional)</label>
            <select value={engine} onChange={(e) => setEngine(e.target.value)}>
              <option value="">Not specified</option>
              {ENGINES.map((e2) => (<option key={e2} value={e2}>{e2}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Transmission (optional)</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Not specified</option>
              {TRANSMISSIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Seats (optional)</label>
            <select value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="">Not specified</option>
              {SEAT_OPTIONS.map((s) => (<option key={s} value={s}>{s === 6 ? '6+' : s}</option>))}
            </select>
          </div>
          <div className="field">
            <label>Horsepower range{horsepowerExact ? ' (auto-set from exact bhp)' : ''}</label>
            <select value={horsepower} onChange={(e) => setHorsepower(e.target.value)} disabled={!!horsepowerExact}>
              <option value="">Not specified</option>
              {HORSEPOWER_RANGES.map((h) => (<option key={h} value={h}>{h}</option>))}
            </select>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Know the exact bhp? Enter it here (optional)"
              value={horsepowerExact}
              onChange={(e) => handleExactHorsepowerChange(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="field">
          <label>Photos (up to {MAX_PHOTOS})</label>
          {existingPhotos.length > 0 && (
            <div className="photo-input-row" style={{ marginBottom: 10 }}>
              {existingPhotos.map((p) => {
                const marked = removedPhotoIds.includes(p.id);
                return (
                  <div key={p.id} style={{ position: 'relative' }}>
                    <img className="thumb" src={p.url} alt="" style={{ opacity: marked ? 0.35 : 1 }} />
                    <button
                      type="button"
                      onClick={() => toggleRemoveExisting(p.id)}
                      title={marked ? 'Undo remove' : 'Remove photo'}
                      style={{ position: 'absolute', top: -6, right: -6, background: marked ? 'var(--ink-soft)' : 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, cursor: 'pointer', lineHeight: 1 }}
                    >
                      {marked ? '↺' : '×'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div
            onDragOver={(e) => { e.preventDefault(); if (totalPhotoCount < MAX_PHOTOS && !compressing) setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--maroon)' : 'var(--line-strong)'}`,
              borderRadius: 8,
              padding: '20px 14px',
              textAlign: 'center',
              background: dragActive ? 'rgba(138,21,24,0.05)' : 'var(--surface)',
              transition: 'border-color .15s, background .15s'
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
              Drag and drop new photos here, or
            </p>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} disabled={totalPhotoCount >= MAX_PHOTOS || compressing} />
          </div>
          {compressing && <div className="hint" style={{ marginTop: 6 }}>Compressing photos…</div>}
          {newFiles.length > 0 && (
            <div className="photo-input-row" style={{ marginTop: 10 }}>
              {newFiles.map((f, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img className="thumb" src={URL.createObjectURL(f)} alt="" />
                  <button type="button" onClick={() => removeNewFile(i)} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error-text">{error}</div>}
        {busy && progress && <div className="success-text">{progress}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn" onClick={submitEdit} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
          <Link href={`/listing/${id}`} className="btn secondary">Cancel</Link>
        </div>
      </div>
    </>
  );
}
