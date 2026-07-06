'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { COUNTRY_CODES } from '@/lib/countryCodes';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [phone, setPhone] = useState('');
  const [whatsappPreferred, setWhatsappPreferred] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setError('Fill in every field to create your account.');
      return;
    }
    if (password.length < 6) {
      setError('Password needs to be at least 6 characters.');
      return;
    }
    setBusy(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), phone: `${countryCode} ${phone.trim()}`, whatsapp_preferred: whatsappPreferred }
      }
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      router.push('/');
    } else {
      setNotice('Check your email for a confirmation link, then come back and sign in.');
      setMode('signin');
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push('/');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
      <div className="panel" style={{ width: '100%' }}>
        {mode === 'signup' ? (
          <>
            <h2>Open your Autofy account</h2>
            <p className="sub">
              One quick form. Your name, email, and phone are what buyers and sellers use to reach you.
            </p>
            <form onSubmit={handleSignUp}>
              <div className="field">
                <label htmlFor="su-name">Full name</label>
                <input id="su-name" type="text" placeholder="Tony Stank" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="su-phone">Phone number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ flex: '0 0 130px' }}
                    aria-label="Country code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.iso} value={c.dial}>{c.iso} {c.dial}</option>
                    ))}
                  </select>
                  <input id="su-phone" type="tel" placeholder="50 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1 }} />
                </div>
                <div className="hint">Shown directly on your listings so buyers can call you.</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13, fontWeight: 400, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={whatsappPreferred}
                    onChange={(e) => setWhatsappPreferred(e.target.checked)}
                    style={{ width: 18, height: 18, minHeight: 'auto', flexShrink: 0 }}
                  />
                  Prefer to be contacted on WhatsApp
                </label>
              </div>
              <div className="field">
                <label htmlFor="su-email">Email</label>
                <input id="su-email" type="email" placeholder="tonystank@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="su-pass">Password</label>
                <input id="su-pass" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <div className="error-text">{error}</div>}
              {notice && <div className="success-text">{notice}</div>}
              <button className="btn" type="submit" disabled={busy} style={{ marginTop: 6 }}>
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </form>
            <p style={{ fontSize: 13, marginTop: 18 }}>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError(''); setNotice(''); }} style={{ background: 'none', border: 'none', color: 'var(--black)', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}>
                Sign in
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Sign in</h2>
            <p className="sub">Welcome back.</p>
            <form onSubmit={handleSignIn}>
              <div className="field">
                <label htmlFor="si-email">Email</label>
                <input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="si-pass">Password</label>
                <input id="si-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <div className="error-text">{error}</div>}
              {notice && <div className="success-text">{notice}</div>}
              <button className="btn" type="submit" disabled={busy} style={{ marginTop: 6 }}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p style={{ fontSize: 13, marginTop: 18 }}>
              New to Autofy?{' '}
              <button onClick={() => { setMode('signup'); setError(''); setNotice(''); }} style={{ background: 'none', border: 'none', color: 'var(--black)', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}>
                Create an account
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
