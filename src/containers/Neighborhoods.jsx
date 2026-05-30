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

// Approximate geographic centers [lat, lng] for known Houston neighborhoods.
// Bounding box: lng -95.92→-94.97, lat 29.44→30.28
const NEIGHBORHOOD_GEO = {
  'Acres Home':           [29.87, -95.47],
  'Airline':              [29.83, -95.37],
  'Astrodome Area':       [29.69, -95.40],
  'Atascocita':           [29.97, -95.17],
  'Bellaire':             [29.71, -95.46],
  'Blalock Market':       [29.77, -95.51],
  'Central Northwest':    [29.84, -95.44],
  'Chinatown':            [29.70, -95.50],
  'Cinco Ranch':          [29.74, -95.76],
  'CityCentre':           [29.77, -95.56],
  'Cypress':              [29.97, -95.65],
  'Deerbrook':            [29.97, -95.17],
  'Downtown':             [29.76, -95.37],
  'EaDo':                 [29.74, -95.36],
  'East Aldine':          [29.87, -95.27],
  'Eastwood':             [29.73, -95.32],
  'Energy Corridor':      [29.76, -95.66],
  'First Ward':           [29.77, -95.38],
  'Fourth Ward':          [29.76, -95.40],
  'Galleria':             [29.74, -95.46],
  'Greater Fifth Ward':   [29.78, -95.33],
  'Greenspoint':          [29.95, -95.41],
  'Greenway':             [29.73, -95.43],
  'Gulfgate':             [29.68, -95.31],
  'Heights':              [29.80, -95.41],
  'Houston Gardens':      [29.88, -95.28],
  'Humble':               [29.99, -95.26],
  'Hyde Park':            [29.74, -95.39],
  'Independence Heights': [29.83, -95.42],
  'Jersey Village':       [29.88, -95.57],
  'Katy':                 [29.79, -95.82],
  'Kemah':                [29.54, -95.02],
  'Little York':          [29.85, -95.33],
  'Memorial Park':        [29.76, -95.43],
  'Mid West':             [29.73, -95.49],
  'Midtown':              [29.74, -95.38],
  'Montrose':             [29.74, -95.40],
  'Museum District':      [29.72, -95.39],
  'Northside':            [29.81, -95.37],
  'Northwest Houston':    [29.86, -95.52],
  'Oak Forest':           [29.82, -95.44],
  'Rice Village':         [29.72, -95.42],
  'River Oaks':           [29.75, -95.43],
  'Rosenberg':            [29.56, -95.81],
  'Second Ward':          [29.75, -95.34],
  'South Central':        [29.71, -95.38],
  'South Side':           [29.67, -95.37],
  'Southeast Houston':    [29.67, -95.28],
  'Spring':               [30.07, -95.42],
  'Stafford':             [29.62, -95.56],
  'Sugar Land':           [29.60, -95.63],
  'Summerwood':           [29.96, -95.17],
  'The Woodlands':        [30.17, -95.47],
  'Todd Mission':         [30.13, -95.87],
  'Tomball':              [30.09, -95.62],
  'University Place':     [29.72, -95.41],
  'Uptown':               [29.74, -95.46],
  'Washington':           [29.77, -95.39],
  'Webster':              [29.54, -95.12],
  'West University Place':[29.71, -95.43],
  'Westside':             [29.74, -95.58],
  'Willowbrook':          [29.91, -95.55],
};

const GEO_LNG_MIN = -95.92, GEO_LNG_MAX = -94.97;
const GEO_LAT_MIN = 29.44,  GEO_LAT_MAX = 30.28;

function geoToXY(lat, lng) {
  const x = (lng - GEO_LNG_MIN) / (GEO_LNG_MAX - GEO_LNG_MIN) * 100;
  const y = (GEO_LAT_MAX - lat) / (GEO_LAT_MAX - GEO_LAT_MIN) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

const CityMap = ({ neighborhoods }) => {
  const [hoverIdx, setHoverIdx] = useState(null);

  const positions = useMemo(() => {
    return neighborhoods.map(n => {
      const coords = NEIGHBORHOOD_GEO[n.name];
      if (coords) return geoToXY(coords[0], coords[1]);
      return { x: 50, y: 50 };
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
          {/* TX-99 Grand Parkway — outermost loop, NW at Katy, north through The Woodlands, NE near Humble/Kingwood, east near Baytown, SE at League City, south at Pearland, SW at Sugar Land */}
          <path d="M 6 33 C 14 22, 28 13, 47 11 C 62 9, 76 13, 88 19 C 93 23, 97 29, 97 36 C 96 41, 93 47, 91 50 C 80 52, 68 52, 59 51 C 46 51, 34 50, 21 49 C 12 46, 5 40, 6 33 Z" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1 1.5"/>
          {/* I-10 — dips south through Energy Corridor, rises north at Heights/610W, dips through downtown, levels east */}
          <path d="M -2 33 C 15 33, 28 35, 37 35 C 42 35, 44 32, 47 32 C 51 33, 55 35, 58 35 C 72 34, 88 34, 102 34" fill="none" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          {/* I-45 — straight south from The Woodlands through Greenspoint to downtown, then bends southeast toward Galveston */}
          <path d="M 50 -1 C 51 6 54 12 54 22 C 56 28 57 31 58 35 C 59 38 62 40 64 42 C 72 44 80 48 91 56" fill="none" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          {/* I-59/I-69 — SW Freeway from Rosenberg/Sugar Land northeast through Greenway to downtown, then Eastex Freeway northeast toward Humble/Kingwood */}
          <path d="M 17 56 C 21 51 26 47 31 45 C 38 42 44 39 49 37 C 52 36 55 35 58 35 C 62 33 65 27 69 20 C 73 13 78 7 82 -2" fill="none" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          {/* TX-249 — Tomball Parkway, mostly north from Spring Branch through Willowbrook to Tomball */}
          <path d="M 41 35 C 40 29, 38 24, 37 21 C 35 15, 32 9, 29 0" fill="none" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.35"/>
          {/* Buffalo Bayou — enters west at y≈36 (lat 29.74), bends north at Heights/Shepherd (y≈33), returns through downtown, exits east toward Ship Channel */}
          <path
            d="M -2 36 C 20 36, 40 35, 50 35 C 52 34, 54 33, 56 35 C 58 36, 65 37, 75 37 C 82 37, 90 36, 102 36"
            fill="none" stroke="rgba(80,130,180,0.55)" strokeWidth=".8"/>
          {/* Loop 610 — roughly rectangular, NW corner near Heights/I-10W, NE near Fifth Ward, SE/SW at South Loop */}
          <path d="M 49 32 C 56 32, 64 32, 67 33 C 67 35, 67 38, 67 41 C 62 41, 54 41, 47 41 C 47 39, 47 35, 49 32 Z" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.4" strokeDasharray="0.8 0.8"/>
          {/* Beltway 8 — NW near I-10W, north arc through TX-249/I-45N/I-69N, east near I-10E, south arc through I-69S/I-45S/I-69SW, closes at NW */}
          <path d="M 24 34 C 28 28, 34 26, 39 25 C 45 22, 51 21, 54 21 C 62 21, 70 21, 74 21 C 80 24, 86 30, 88 34 C 87 37, 85 41, 82 44 C 75 45, 66 45, 57 45 C 50 45, 44 44, 39 44 C 33 42, 27 39, 24 34 Z" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.35" strokeDasharray="0.6 0.8"/>
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
