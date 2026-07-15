'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase's recovery link logs the user into a temporary session
    // automatically on redirect (PASSWORD_RECOVERY event). We just wait for it.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    if (password.length < 6) {
      setError('Password needs to be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords don\u2019t match.');
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice('Password updated. Taking you to Autofy…');
    setTimeout(() => router.push('/'), 1200);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
      <div className="panel" style={{ width: '100%' }}>
        <h2>Set a new password</h2>
        {!ready ? (
          <p className="sub">Confirming your reset link…</p>
        ) : (
          <>
            <p className="sub">Choose a new password for your account.</p>
            <form onSubmit={handleUpdatePassword}>
              <div className="field">
                <label htmlFor="rp-pass">New password</label>
                <input
                  id="rp-pass"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="rp-pass-confirm">Confirm new password</label>
                <input
                  id="rp-pass-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <div className="error-text">{error}</div>}
              {notice && <div className="success-text">{notice}</div>}
              <button className="btn" type="submit" disabled={busy} style={{ marginTop: 6 }}>
                {busy ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
