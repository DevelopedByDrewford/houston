import { Link } from 'react-router-dom';

const LogoMark = ({ size = 24 }) => (
  <img
    src="https://i.imgur.com/5Vui63v.png"
    alt="Houston Guide logo"
    width={size}
    height={size}
    style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
  />
);

const FOOTER_COLS = [
  {
    heading: 'Browse',
    links: [
      { label: 'Food index',      to: '/food' },
      { label: 'Things to do',    to: '/activities' },
      { label: 'Neighborhoods',   to: '/neighborhoods' },
      { label: 'Resources',       to: '/resources' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'How this works',  to: '/' },
      { label: 'Field notes',     to: '/' },
      { label: 'Submit a spot',   to: '/add-location' },
    ],
  },
  {
    heading: 'Find me',
    links: [
      { label: 'Drew Cook',    href: 'https://links.drewford.dev' },
      { label: 'Instagram',       href: 'https://instagram.com/developedbydrewford' },
      { label: 'TikTok',           href: 'https://tiktok.com/@developedbydrewford' },
      { label: 'Letterboxd',        href: 'https://letterboxd.com/drewford' },
    ],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      {/* Brand column */}
      <div className="footer__brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={24} />
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
            letterSpacing: '-0.01em', color: 'var(--paper)',
          }}>The Houston Guide</span>
        </div>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: 14.5, lineHeight: 1.55,
          opacity: 0.65, marginTop: 14, maxWidth: 320,
        }}>
          A personal, ad-free guide to the city's best places to eat, drink, and spend
          an afternoon. Updated by foot.
        </p>
      </div>

      {/* Link columns */}
      {FOOTER_COLS.map(col => (
        <div key={col.heading}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--paper)', opacity: 0.5, marginBottom: 14,
          }}>{col.heading}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {col.links.map(l => (
              <li key={l.label}>
                {l.to
                  ? <Link to={l.to} style={{
                      fontFamily: 'var(--sans)', fontSize: 13.5,
                      color: 'var(--paper)', opacity: 0.8, textDecoration: 'none',
                    }}>{l.label}</Link>
                  : <a href={l.href} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: 'var(--sans)', fontSize: 13.5,
                      color: 'var(--paper)', opacity: 0.8, textDecoration: 'none',
                    }}>{l.label}</a>
                }
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="footer__bottom">
      <span>© 2026 Developed by Drewford · Houston, TX 77009</span>
      <span>Set in Newsreader & Geist · Made with care</span>
    </div>
  </footer>
);

export default Footer;
