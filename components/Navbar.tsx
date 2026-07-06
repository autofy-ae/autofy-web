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
        <div className="whoami">
          {loading ? null : user ? (
            <>
              Signed in as <b style={{ color: '#fff' }}>{profile?.full_name || user.email}</b>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <Link href="/login" style={{ color: 'var(--amber)', fontSize: 12, textDecoration: 'underline' }}>
              Sign in / create account
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
