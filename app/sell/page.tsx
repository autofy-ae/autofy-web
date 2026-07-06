'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthContext';

const MAX_PHOTOS = 10;

export default function SellPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  if (loading) return null;

  if (!user || !profile) {
    return (
      <div className="empty">
        <div className="display">Sign in to list a car</div>
        <p>You need an Autofy account before you can post a listing.</p>
        <Link href="/login" className="btn">Sign in / create account</Link>
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
    if (!make.trim() || !model.trim() || !year || !price) {
      setError('Make, model, year, and price are required.');
      return;
    }
    setBusy(true);
    setProgress('Creating listing…');

    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        owner_id: user!.id,
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        price: Number(price),
        mileage: mileage ? Number(mileage) : null,
        location: location.trim() || null,
        description: description.trim() || null
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
          Buyers will contact <b>{profile.full_name}</b> at <b>{profile.phone}</b> or <b>{profile.email}</b>.
        </div>

        <div className="row2">
          <div className="field"><label>Make</label><input type="text" placeholder="Toyota" value={make} onChange={(e) => setMake(e.target.value)} /></div>
          <div className="field"><label>Model</label><input type="text" placeholder="Camry" value={model} onChange={(e) => setModel(e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="field"><label>Year</label><input type="number" placeholder="2019" min={1950} max={2027} value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div className="field"><label>Price (USD)</label><input type="number" placeholder="14500" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="field"><label>Mileage (optional)</label><input type="number" placeholder="62000" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} /></div>
          <div className="field"><label>Location (optional)</label><input type="text" placeholder="Austin, TX" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea placeholder="Condition, service history, why you're selling, anything a buyer should know." value={description} onChange={(e) => setDescription(e.target.value)} />
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
                  <button type="button" onClick={() => removeFile(i)} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--rust)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, cursor: 'pointer', lineHeight: 1 }}>×</button>
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
