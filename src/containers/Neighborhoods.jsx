import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import { useNeighborhoods } from '../contexts/NeighborhoodsContext';
import { REGIONS, REGION_COPY } from '../data/neighborhood-regions';

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

function convertNumberToWords(n) {
  if (n === 0) return 'zero';
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convertNumberToWords(n % 100) : '');
  return n;
}

// ---------- Compass SVG ----------

const CompassMark = ({ size = 28 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
    <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M20 4 L22 19 L20 36 L18 19 Z" fill="currentColor" />
    <path d="M4 20 L19 22 L36 20 L19 18 Z" fill="currentColor" opacity="0.55" />
    <circle cx="20" cy="20" r="1.4" fill="currentColor" />
  </svg>
);

// ---------- Hero ----------

const NeighborhoodHero = ({ featured, totalCount }) => (
  <section className="nb-hero">
    <div className="nb-hero__meta">
      <span className="nb-hero__meta-label nb-hero__meta-label--accent">§ 04 · Atlas</span>
      <span className="nb-hero__meta-divider" />
      <span className="nb-hero__meta-label nb-hero__meta-label--dim">{totalCount} corners · 6 regions</span>
    </div>
    <div className="nb-hero__content">
      <div>
        <h1 className="nb-hero__title">
          {convertNumberToWords(totalCount).charAt(0).toUpperCase() + convertNumberToWords(totalCount).slice(1)} corners of <em>Houston.</em>
        </h1>
        <p className="nb-hero__copy">
          The city is too big to think about whole. So it gets sorted — by drive-time, by
          grid pattern, by the kind of evening it offers. Every name below is a real
          chapter of the index.
        </p>
      </div>
      {featured && (
        <figure className="nb-hero__featured">
          <div className="nb-hero__featured-img-wrap">
            <img src={featured.img} alt={featured.name} className="nb-hero__featured-img" />
            <div className="nb-hero__featured-gradient" />
            <div className="nb-hero__featured-badge">Featured</div>
            <div className="nb-hero__featured-info">
              <div className="nb-hero__featured-meta">Inner Loop · {featured.count} spots</div>
              <div className="nb-hero__featured-name">{featured.name}</div>
              <p className="nb-hero__featured-blurb">"{featured.blurb}"</p>
            </div>
          </div>
        </figure>
      )}
    </div>
  </section>
);

// ---------- Region tabs ----------

const RegionTabs = ({ active, onChange, counts }) => (
  <section className="nb-region-tabs">
    <div className="nb-region-tabs__inner">
      {REGIONS.map(r => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`nb-region-tab${r.id === active ? ' nb-region-tab--active' : ''}`}
        >
          {r.label}
          <span className="nb-region-tab__count">{counts[r.id] ?? 0}</span>
        </button>
      ))}
    </div>
  </section>
);

// ---------- Region copy ----------

const RegionCopy = ({ activeRegion }) => {
  const region = REGIONS.find(r => r.id === activeRegion) || REGIONS[0];
  return (
    <section className="nb-region-copy">
      <div className="nb-region-copy__inner">
        <div>
          <span className="nb-region-copy__now-showing">Now showing</span>
          <div className="nb-region-copy__title">{region.label}</div>
        </div>
        <p className="nb-region-copy__text">{REGION_COPY[activeRegion] || REGION_COPY.all}</p>
      </div>
    </section>
  );
};

// ---------- City map ----------

const CityMap = ({ neighborhoods }) => {
  const [hoverIdx, setHoverIdx] = useState(null);

  const positions = useMemo(() => {
    const bands = {
      inner_loop: { cx: 50, cy: 48, r: 8 },
      north:      { cx: 48, cy: 30, r: 10 },
      south:      { cx: 52, cy: 62, r: 8 },
      east:       { cx: 70, cy: 50, r: 9 },
      west:       { cx: 30, cy: 46, r: 10 },
      outer:      { cx: 50, cy: 50, r: 38 },
    };
    return neighborhoods.map(n => {
      const band = bands[n.region] || bands.outer;
      const h = [...n.name].reduce((a, c) => a + c.charCodeAt(0), 0);
      const a = (h * 137.5) % 360;
      const r = (h % 100) / 100 * band.r;
      const x = band.cx + Math.cos(a * Math.PI / 180) * r;
      const y = band.cy + Math.sin(a * Math.PI / 180) * r * 0.7;
      return { x: Math.max(4, Math.min(96, x)), y: Math.max(6, Math.min(94, y)) };
    });
  }, [neighborhoods]);

  return (
    <section className="nb-map">
      <div className="nb-map__header">
        <span className="nb-map__label">City overview · {neighborhoods.length} pins</span>
        <Link to="/" className="nb-map__link">Open full map →</Link>
      </div>
      <div className="nb-map__frame">
        <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="nb-map__svg">
          <defs>
            <pattern id="nb-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M4 0 L0 0 L0 4" fill="none" stroke="currentColor" strokeWidth="0.08" opacity="0.18"/>
            </pattern>
          </defs>
          <rect width="100" height="56" fill="url(#nb-grid)"/>
          <path d="M -2 34 C 18 28, 30 40, 48 32 S 80 26, 102 34" fill="none" stroke="currentColor" strokeOpacity="0.32" strokeWidth="0.55"/>
          <path d="M 10 10 C 22 16, 30 8, 44 18 S 70 24, 92 16" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1 1.5"/>
          <path d="M 0 28 L 100 26" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          <path d="M 50 0 L 52 56" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          <path d="M 0 48 L 100 16" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.3"/>
          <ellipse cx="50" cy="42" rx="18" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.4" strokeDasharray="0.8 0.8"/>
          <ellipse cx="50" cy="42" rx="32" ry="18" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.35" strokeDasharray="0.6 0.8"/>
        </svg>

        {neighborhoods.map((n, i) => {
          const p = positions[i];
          const isHover = hoverIdx === i;
          return (
            <div
              key={n.name}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="nb-map__pin"
              style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: isHover ? 5 : 1 }}
            >
              <span className={`nb-map__pin-dot${isHover ? ' nb-map__pin-dot--hover' : ''}`} />
              {isHover && (
                <span className="nb-map__pin-tooltip">{n.name} · {n.count}</span>
              )}
            </div>
          );
        })}

        <div className="nb-map__compass">
          <CompassMark size={36} />
          <span className="nb-map__compass-n">N</span>
        </div>
        <div className="nb-map__scale">├──────┤ &nbsp; 5 MI</div>
        <div className="nb-map__coords">29.76° N<br/>95.37° W</div>
      </div>
    </section>
  );
};

// ---------- Photo tile ----------

const PhotoTile = ({ n, i }) => (
  <Link to={`/atlas/${slugify(n.name)}`} className="nb-tile nb-tile--photo">
    <img src={n.img} alt={n.name} className="nb-tile__img" />
    <div className="nb-tile__gradient" />
    <span className="nb-tile__number">{String(i + 1).padStart(2, '0')}</span>
    <span className="nb-tile__count">{n.count} ›</span>
    <div className="nb-tile__info">
      <div className="nb-tile__name">{n.name}</div>
      <div className="nb-tile__tag">{n.tag}</div>
    </div>
  </Link>
);

// ---------- Index tile ----------

const IndexTile = ({ n, i }) => (
  <Link to={`/atlas/${slugify(n.name)}`} className="nb-tile nb-tile--index">
    <div className="nb-tile--index__top">
      <span className="nb-tile--index__number">{String(i + 1).padStart(2, '0')}</span>
      <span className="nb-tile--index__count">{n.count} ›</span>
    </div>
    <div>
      <div className="nb-tile--index__name">{n.name}</div>
      <div className="nb-tile--index__tag">{n.tag}</div>
      <p className="nb-tile--index__blurb">{n.blurb}</p>
    </div>
  </Link>
);

// ---------- Neighborhood grid ----------

const NeighborhoodGrid = ({ neighborhoods, tileStyle }) => (
  <section className="nb-grid-section">
    <div className={`nb-grid nb-grid--${tileStyle}`}>
      {neighborhoods.map((n, i) =>
        tileStyle === 'index'
          ? <IndexTile key={n.name} n={n} i={i} />
          : <PhotoTile key={n.name} n={n} i={i} />
      )}
    </div>
  </section>
);

// ---------- A–Z directory ----------

const AZDirectory = ({ neighborhoods }) => {
  const grouped = useMemo(() => {
    const g = {};
    [...neighborhoods].sort((a, b) => a.name.localeCompare(b.name)).forEach(n => {
      const k = n.name[0].toUpperCase();
      (g[k] = g[k] || []).push(n);
    });
    return g;
  }, [neighborhoods]);

  const letters = Object.keys(grouped).sort();

  return (
    <section className="nb-az">
      <div className="nb-az__header">
        <div className="nb-az__header-left">
          <span className="nb-az__section-num">§ 04.b</span>
          <h2 className="nb-az__title">A–Z directory</h2>
          <span className="nb-az__sub">— all names, alphabetical</span>
        </div>
        <div className="nb-az__jumps">
          {letters.map(L => (
            <a key={L} href={`#az-${L}`} className="nb-az__jump">{L}</a>
          ))}
        </div>
      </div>
      <div className="nb-az__columns">
        {letters.map(L => (
          <div key={L} id={`az-${L}`} className="nb-az__letter-group">
            <div className="nb-az__letter">{L}</div>
            <ul className="nb-az__list">
              {grouped[L].map(n => (
                <li key={n.name} className="nb-az__row">
                  <Link to={`/atlas/${slugify(n.name)}`} className="nb-az__link">{n.name}</Link>
                  <span className="nb-az__count">{String(n.count).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

// ---------- Page ----------

const Neighborhoods = () => {
  const { locations, loading: locationsLoading } = useLocations();
  const { neighborhoods, loading: neighborhoodsLoading } = useNeighborhoods();
  const [activeRegion, setActiveRegion] = useState('all');
  const [view, setView] = useState('photo');

  const countsByNeighborhood = useMemo(() => {
    if (!Array.isArray(locations)) return {};
    const counts = {};
    locations.forEach(loc => {
      if (loc.neighborhood) counts[loc.neighborhood] = (counts[loc.neighborhood] || 0) + 1;
    });
    return counts;
  }, [locations]);

  const enrichedNeighborhoods = useMemo(() => {
    return neighborhoods.map(n => ({
      ...n,
      count: countsByNeighborhood[n.name] || 0,
    }));
  }, [neighborhoods, countsByNeighborhood]);

  const filtered = useMemo(() => {
    if (activeRegion === 'all') return enrichedNeighborhoods;
    return enrichedNeighborhoods.filter(n => n.region === activeRegion);
  }, [activeRegion, enrichedNeighborhoods]);

  const counts = useMemo(() => {
    const c = { all: enrichedNeighborhoods.length };
    REGIONS.slice(1).forEach(r => {
      c[r.id] = enrichedNeighborhoods.filter(n => n.region === r.id).length;
    });
    return c;
  }, [enrichedNeighborhoods]);

  const featured = enrichedNeighborhoods.find(n => n.name === 'Montrose') || enrichedNeighborhoods[0];

  if (locationsLoading || neighborhoodsLoading) {
    return <div className="listing-page"><div className="listing-loading">Loading neighborhoods…</div></div>;
  }

  return (
    <div className="listing-page">
      <NeighborhoodHero featured={featured} totalCount={enrichedNeighborhoods.length} />

      <RegionTabs active={activeRegion} onChange={setActiveRegion} counts={counts} />

      <RegionCopy activeRegion={activeRegion} />

      <div className="nb-view-controls">
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${view === 'photo' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => setView('photo')}
          >Photo</button>
          <button
            className={`view-toggle__btn${view === 'map' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => setView('map')}
          >Map</button>
          <button
            className={`view-toggle__btn${view === 'az' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => setView('az')}
          >A–Z</button>
        </div>
        <span className="listing-toolbar__count">{filtered.length} neighborhoods</span>
      </div>

      {view === 'photo' && <NeighborhoodGrid neighborhoods={filtered} tileStyle="photo" />}
      {view === 'map' && <CityMap neighborhoods={enrichedNeighborhoods} />}
      {view === 'az' && <AZDirectory neighborhoods={enrichedNeighborhoods} />}
    </div>
  );
};

export default Neighborhoods;
