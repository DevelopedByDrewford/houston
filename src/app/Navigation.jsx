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
  { to: '/food',          label: 'Food',         end: false },
  { to: '/activities',    label: 'Activities',   end: false },
  { to: '/neighborhoods', label: 'Hoods',        end: false },
  { to: '/resources',     label: 'Resources',    end: false },
];

const Navigation = ({ setLat, setLon, setZoom }) => {
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
          <span className="navigation__tagline">Est. 2024 · Curated by Drew</span>
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
      </div>
    </nav>
  );
};

export default Navigation;
