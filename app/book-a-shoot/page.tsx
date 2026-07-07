'use client';

const WHATSAPP_URL = 'https://wa.me/971569026568?text=Hi%20Team%20Autofy%2C%20I%20would%20like%20to%20book%20a%20shoot%20for%20my%20car.';

export default function BookAShootPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="hero" style={{ marginBottom: 24 }}>
        <h1>Book a <span>shoot.</span></h1>
        <p>
          Our team comes to you and spends 2-3 hours producing high-quality photo and video of your car —
          for your listing, your socials, or just to have.
        </p>
        <span className="swoosh"></span>
      </div>

      <div className="panel" style={{ maxWidth: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ margin: 0 }}>What's included</h2>
          <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--maroon)' }}>AED 750</div>
        </div>
        <p className="sub" style={{ marginBottom: 20 }}>Flat rate, one car, one shoot.</p>

        <ul style={{ margin: '0 0 24px', paddingLeft: 20, fontSize: 14, lineHeight: 1.9, color: 'var(--ink)' }}>
          <li>A 2-3 hour on-location shoot with a full Autofy team</li>
          <li>Professionally shot and edited photo and video content</li>
          <li>A copy of the final edit delivered to you, for personal or social use</li>
        </ul>

        <h3 style={{ fontSize: 15, margin: '0 0 10px' }}>Terms</h3>
        <ul style={{ margin: '0 0 26px', paddingLeft: 20, fontSize: 13.5, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
          <li>The car must be available on-site for a minimum of 2 hours during the shoot</li>
          <li>Autofy retains the right to publish the resulting content on Autofy's own social media pages</li>
          <li>You'll receive a copy of the final edited video — no further editing changes are made after delivery</li>
          <li>AED 750 is charged flat and is non-refundable once the shoot is booked</li>
        </ul>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ background: '#25D366', color: '#0B0B0C', display: 'inline-block', textDecoration: 'none' }}
        >
          Book Now
        </a>
        <p className="hint" style={{ marginTop: 12 }}>Opens WhatsApp with a message to the Autofy shoot team.</p>
      </div>
    </div>
  );
}
