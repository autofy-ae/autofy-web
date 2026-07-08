'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <header className="top">
      <div className="top-inner">
        <Link href="/" className="logo">
          <div className="mark">AUTO<span>FY</span></div>
        </Link>
        <nav className="tabs">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Browse</Link>
          <Link href="/sell" className={pathname === '/sell' ? 'active' : ''}>Sell a car</Link>
          <Link href="/my-listings" className={pathname === '/my-listings' ? 'active' : ''}>My listings</Link>
        </nav>
        <Link
          href="/book-a-shoot"
          style={{
            background: 'var(--maroon)', color: '#fff', fontFamily: "'Anton', sans-serif", fontSize: 13,
            letterSpacing: '0.03em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 6,
            textDecoration: 'none', flexShrink: 0
          }}
        >
          Book A Shoot
        </Link>
        <div className="whoami">
          {loading ? null : user ? (
            <>
              Signed in as <b style={{ color: 'var(--ink)' }}>{profile?.full_name || user.email}</b>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <Link href="/login" style={{ color: 'var(--maroon)', fontSize: 12, textDecoration: 'underline' }}>
              Sign in / create account
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
