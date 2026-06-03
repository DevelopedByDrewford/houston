import { useParams, Link, useNavigate } from 'react-router-dom';

import SpotCard from '../components/SpotCard';
import NotFound from './NotFound';
import generateLocationSlug from '../utils/slug';
import { useLocations } from '../contexts/LocationsContext';

const slugifyNeighborhood = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Imgur serves a 161×81 placeholder for removed images — onError never fires.
// Guard swaps on load when it detects the sentinel dimensions.
const useImgGuard = (fallback = '') => ({
  onError: (e) => {
    if (!e.target.dataset.fellback) {
      e.target.dataset.fellback = '1';
      e.target.src = fallback || '';
      if (!fallback) e.target.style.display = 'none';
    }
  },
  onLoad: (e) => {
    if (
      e.target.naturalWidth === 161 &&
      e.target.naturalHeight === 81 &&
      !e.target.dataset.fellback
    ) {
      e.target.dataset.fellback = '1';
      if (fallback) e.target.src = fallback;
      else e.target.style.display = 'none';
    }
  },
});

// ── Compass SVG ──────────────────────────────────────────

const Compass = ({ size = 28 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M20 4 L22 19 L20 36 L18 19 Z" fill="currentColor"/>
    <path d="M4 20 L19 22 L36 20 L19 18 Z" fill="currentColor" opacity="0.55"/>
    <circle cx="20" cy="20" r="1.4" fill="currentColor"/>
  </svg>
);

// ── Breadcrumb ───────────────────────────────────────────

const Breadcrumb = ({ category, subcategory, name }) => {
  const section = category === 'food' ? 'Eats' : 'Activities';
  const sectionTo = category === 'food' ? '/eats' : '/activities';
  const cat = Array.isArray(subcategory) ? subcategory[0] : subcategory;

  return (
    <div className="lp-crumb">
      <Link to="/" className="lp-crumb__link">Index</Link>
      <span className="lp-crumb__sep">/</span>
      <Link to={sectionTo} className="lp-crumb__link">{section}</Link>
      {cat && (
        <>
          <span className="lp-crumb__sep">/</span>
          <span className="lp-crumb__seg">{cat}</span>
        </>
      )}
      <span className="lp-crumb__sep">/</span>
      <span className="lp-crumb__seg lp-crumb__seg--active">{name}</span>
    </div>
  );
};

// ── Title block ──────────────────────────────────────────

const TitleBlock = ({ item }) => {
  const cat = Array.isArray(item.subcategory) ? item.subcategory[0] : item.category;

  return (
    <section className="lp-title-block">
      <div className="lp-title-eyebrow">
        <span className="lp-title-category">{cat}</span>
        <span className="lp-title-sep">·</span>
        <Link to={`/atlas/${slugifyNeighborhood(item.neighborhood)}`} className="lp-title-neighborhood">
          {item.neighborhood}
        </Link>
      </div>

      <h1 className="lp-title-name">{item.name}</h1>
    </section>
  );
};

// ── Hero image (21:9) ────────────────────────────────────

const HeroImage = ({ src, alt }) => {
  const guard = useImgGuard();
  return (
    <section className="lp-hero">
      <div className="lp-hero__frame">
        <img src={src} alt={alt} className="lp-hero__img" {...guard} />
      </div>
    </section>
  );
};

// ── "Highlights" dark card ────────────────────────────

const WhatToOrderCard = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="lp-order-card">
      <div className="lp-order-card__header">
        <Compass size={22} />
        <span className="lp-order-card__label">Highlights</span>
      </div>
      <ul className="lp-order-card__list">
        {items.map((item, i) => (
          <li key={i} className="lp-order-card__item">{item}</li>
        ))}
      </ul>
    </div>
  );
};

// ── Info card (right sticky column) ─────────────────────

const InfoCard = ({ item, onMapClick }) => (
  <div className="lp-info-card">
    <div className="lp-info-rows">
      <div className="lp-info-row">
        <span className="lp-info-label">Neighborhood</span>
        <Link
          to={`/atlas/${slugifyNeighborhood(item.neighborhood)}`}
          className="lp-info-value lp-info-value--link"
        >
          {item.neighborhood}
        </Link>
      </div>
      {item.website && (
        <div className="lp-info-row">
          <span className="lp-info-label">Website</span>
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-info-value lp-info-value--link"
          >
            Visit ›
          </a>
        </div>
      )}
      {item.coordinates && (
        <div className="lp-info-row">
          <span className="lp-info-label">Coordinates</span>
          <span className="lp-info-value lp-info-coords">
            {Number(item.coordinates[0]).toFixed(4)}° N<br />
            {Math.abs(Number(item.coordinates[1])).toFixed(4)}° W
          </span>
        </div>
      )}
    </div>

    <div className="lp-info-map">
      <div className="lp-info-map__inner">
        <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="lp-info-map__svg">
          <defs>
            <pattern id="lp-grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M6 0 L0 0 L0 6" fill="none" stroke="currentColor" strokeWidth="0.12" opacity="0.18"/>
            </pattern>
          </defs>
          <rect width="100" height="56" fill="url(#lp-grid)"/>
          <path d="M -2 36 C 18 30, 30 42, 48 34 S 80 28, 102 36" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6"/>
          <path d="M 0 30 L 100 28" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.4"/>
          <path d="M 50 0 L 52 56" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.4"/>
          <ellipse cx="50" cy="32" rx="26" ry="14" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.45" strokeDasharray="0.8 0.8"/>
        </svg>
        <div className="lp-info-map__pin" />
      </div>
      {item.coordinates && (
        <div className="lp-info-map__footer">
          <span className="lp-info-map__coords">
            {Number(item.coordinates[0]).toFixed(2)}° N · {Math.abs(Number(item.coordinates[1])).toFixed(2)}° W
          </span>
          <button className="lp-info-map__link" onClick={onMapClick}>
            Directions ›
          </button>
        </div>
      )}
    </div>

    <div className="lp-btn-row">
      <button className="lp-btn lp-btn--primary" onClick={onMapClick}>
        View on map
      </button>
      {item.website && (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn--outline">
          Visit website
        </a>
      )}
    </div>
  </div>
);

// ── Section header (§ N, Title — subtitle) ───────────────

const SectionHdr = ({ n, title, sub, right }) => (
  <div className="lp-section-hdr">
    <div className="lp-section-hdr__left">
      <span className="lp-section-hdr__num">§ {n}</span>
      <h2 className="lp-section-hdr__title">{title}</h2>
      {sub && <span className="lp-section-hdr__sub">— {sub}</span>}
    </div>
    {right && <div className="lp-section-hdr__right">{right}</div>}
  </div>
);

// ── More in the area (§C) ────────────────────────────────

const MoreInArea = ({ current, all, neighborhood, setLat, setLon, setZoom }) => {
  const others = all
    .filter(loc => loc.neighborhood === neighborhood && generateLocationSlug(loc) !== generateLocationSlug(current))
    .slice(0, 3);

  if (!others.length) return null;

  return (
    <section className="lp-more">
      <SectionHdr
        n="C"
        title="More in the area"
        sub={neighborhood}
        right={
          <Link to={`/atlas/${slugifyNeighborhood(neighborhood)}`} className="lp-more__hood-link">
            All of {neighborhood} →
          </Link>
        }
      />
      <div className="lp-more__grid">
        {others.map((item, i) => (
          <SpotCard
            key={generateLocationSlug(item)}
            item={item}
            index={i}
            setLat={setLat}
            setLon={setLon}
            setZoom={setZoom}
          />
        ))}
      </div>
    </section>
  );
};

// ── Page ─────────────────────────────────────────────────

const LocationPage = ({ setLat, setLon, setZoom }) => {
  const { slug } = useParams();
  const { locations, loading } = useLocations();
  const navigate = useNavigate();

  if (loading) {
    return <div className="listing-page"><div className="listing-loading">Loading…</div></div>;
  }

  const location = locations.find(loc => generateLocationSlug(loc) === slug);
  if (!location) return <NotFound />;

  const handleMapClick = () => {
    if (!location.coordinates) return;
    setLat(location.coordinates[0]);
    setLon(location.coordinates[1]);
    setZoom(17);
    navigate('/');
  };

  const lede = location.blurb || '';
  const first = lede[0] || '';
  const rest = lede.slice(1);

  return (
    <div className="listing-page">
      <Breadcrumb
        category={location.category}
        subcategory={location.subcategory}
        name={location.name}
      />

      <TitleBlock item={location} />

      {location.img && <HeroImage src={location.img} alt={location.name} />}

      <section className="lp-body">
        <div className="lp-body__left">
          {lede && (
            <p className="lp-lede">
              <span className="lp-lede__dropcap" aria-hidden="true">{first}</span>
              {rest}
            </p>
          )}

          <WhatToOrderCard items={location.description} />

          {location.badges && location.badges.length > 0 && (
            <div className="lp-title-badges">
              {location.badges.map(b => (
                <span key={b} className="lp-badge">{b}</span>
              ))}
            </div>
          )}
        </div>

        <div className="lp-body__right">
          <InfoCard item={location} onMapClick={handleMapClick} />
        </div>
      </section>

      <MoreInArea
        current={location}
        all={locations}
        neighborhood={location.neighborhood}
        setLat={setLat}
        setLon={setLon}
        setZoom={setZoom}
      />
    </div>
  );
};

export default LocationPage;
