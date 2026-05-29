import { Link, NavLink } from "react-router-dom";

const LogoMark = ({ size = 28 }) => (
  <img
    src="https://i.imgur.com/5Vui63v.png"
    alt="Houston Guide logo"
    width={size}
    height={size}
    style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
  />
);

const navLinks = [
  { to: '/',              label: 'Home',         end: true  },
  { to: '/eats',           label: 'Eats',         end: false },
  { to: '/activities',    label: 'Activities',   end: false },
  { to: '/atlas',         label: 'Atlas',        end: false },
  { to: '/community',     label: 'Community',    end: false },
];

const Navigation = ({ setLat, setLon, setZoom, onSearchOpen }) => {
  const resetMap = () => {
    setLat(29.7604);
    setLon(-95.3698);
    setZoom(11);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleHomeClick = () => { scrollTop(); resetMap(); };

  return (
    <nav className="navigation" aria-label="Main navigation">
      <Link to="/" className="navigation__brand" onClick={handleHomeClick}>
        <LogoMark size={28} />
        <div className="navigation__brand-text">
          <span className="navigation__wordmark">The Houston Guide</span>
          <span className="navigation__tagline">Est. 2025 · Curated by Drew Cook</span>
        </div>
      </Link>

      <div className="navigation__links">
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `navigation__link${isActive ? ' navigation__link--active' : ''}`
            }
            onClick={to === '/' ? handleHomeClick : scrollTop}
          >
            {label}
          </NavLink>
        ))}
        <button
          className="navigation__search-btn"
          onClick={onSearchOpen}
          aria-label="Open search"
          title="Search (⌘K)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="navigation__search-hint">⌘K</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
