import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 40 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: 'var(--black)' }}>
          AUTO<span style={{ color: 'var(--maroon)' }}>FY</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/about" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/book-a-shoot" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>Book A Shoot</Link>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
          © {new Date().getFullYear()} Autofy
        </div>
      </div>
    </footer>
  );
}
