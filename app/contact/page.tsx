'use client';

const EMAIL = 'autofy.ae@gmail.com';

const REASONS = [
  { label: 'Ads / Partnerships', subject: 'Ads / Partnerships' },
  { label: 'Improvements / Feedback', subject: 'Improvements / Feedback' },
  { label: 'Noticed a Bug?', subject: 'Bug Report' },
  { label: 'Careers', subject: 'Careers' },
  { label: 'Report Scam Listing', subject: 'Report Scam Listing' },
  { label: 'Account Help', subject: 'Account Help' },
  { label: 'Book a Shoot Questions', subject: 'Book a Shoot Questions' }
];

function mailtoFor(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent('Autofy — ' + subject)}`;
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="hero" style={{ marginBottom: 24 }}>
        <h1>Get in <span>touch.</span></h1>
        <p>
          Pick what you're reaching out about and it'll open an email straight to our team, subject line
          already filled in.
        </p>
        <span className="swoosh"></span>
      </div>

      <div className="panel" style={{ maxWidth: 'none' }}>
        {REASONS.map((r) => (
          <a
            key={r.subject}
            href={mailtoFor(r.subject)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 4px', textDecoration: 'none', color: 'var(--ink)',
              borderBottom: '1px solid var(--line)'
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{r.label}</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--maroon)' }}>Email us →</span>
          </a>
        ))}

        <p className="hint" style={{ marginTop: 20 }}>
          Prefer to write directly? Reach us anytime at{' '}
          <a href={`mailto:${EMAIL}`} style={{ color: 'var(--maroon)', fontWeight: 600 }}>{EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}
