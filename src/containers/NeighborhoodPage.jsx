import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import SpotCard from '../components/SpotCard';
import neighborhoodBlurbs from '../data/neighborhoods';
import { NEIGHBORHOOD_META, REGIONS } from '../data/neighborhood-regions';
import { useLocations } from '../contexts/LocationsContext';

const slugify = (text) => {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

// ── Breadcrumb ───────────────────────────────────────────

const Breadcrumb = ({ region, name }) => (
  <div className="nbp-crumb">
    <Link to="/atlas" className="nbp-crumb__link">Atlas</Link>
    <span className="nbp-crumb__sep">/</span>
    {region && <span className="nbp-crumb__seg">{region.label}</span>}
    {region && <span className="nbp-crumb__sep">/</span>}
    <span className="nbp-crumb__seg nbp-crumb__seg--active">{name}</span>
  </div>
);

// ── Cover Hero (21:9) ────────────────────────────────────

const CoverHero = ({ name, tag, img, region, spotCount }) => (
  <section className="nbp-cover">
    <div className="nbp-cover__frame">
      <img src={img} alt={name} className="nbp-cover__img" />
      <div className="nbp-cover__overlay" />

      <div className="nbp-cover__chips">
        {region && (
          <span className="nbp-cover__chip nbp-cover__chip--paper">{region.label}</span>
        )}
        <span className="nbp-cover__chip nbp-cover__chip--dark">{spotCount} spots indexed</span>
      </div>

      <div className="nbp-cover__bottom">
        {tag && <div className="nbp-cover__tag">{tag}</div>}
        <h1 className="nbp-cover__title">{name}</h1>
      </div>
    </div>
  </section>
);

// ── Lede + Facts ─────────────────────────────────────────

const LedeFacts = ({ blurb, spotCount, region, tag, innerLoop }) => {
  if (!blurb) return null;
  const first = blurb[0];
  const rest = blurb.slice(1);
  const facts = [
    { label: 'Spots indexed', value: spotCount },
    { label: 'Region',        value: region?.label || '—' },
    { label: 'Vibe',          value: tag || '—' },
    { label: 'Location',      value: innerLoop ? 'Inside Loop' : 'Outside Loop' },
  ];

  return (
    <section className="nbp-lede-facts">
      <div className="nbp-lede-facts__inner">
        <p className="nbp-lede">
          <span className="nbp-lede__dropcap" aria-hidden="true">{first}</span>
          {rest}
        </p>
        <div className="nbp-facts">
          {facts.map((f, i) => (
            <div key={f.label} className={`nbp-fact${i % 2 === 1 ? ' nbp-fact--right' : ''}`}>
              <div className="nbp-fact__value">{f.value}</div>
              <div className="nbp-fact__label">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Section header (§ N, Title — subtitle) ───────────────

const SectionHdr = ({ n, title, sub, right }) => (
  <div className="nbp-section-hdr">
    <div className="nbp-section-hdr__left">
      <span className="nbp-section-hdr__num">§ {n}</span>
      <h2 className="nbp-section-hdr__title">{title}</h2>
      {sub && <span className="nbp-section-hdr__sub">— {sub}</span>}
    </div>
    {right && <div className="nbp-section-hdr__right">{right}</div>}
  </div>
);

// ── Spots section (§A) ───────────────────────────────────

const SpotsSection = ({ spots, setLat, setLon, setZoom }) => {
  const [filter, setFilter] = useState('All');

  const cats = ['All', ...Array.from(new Set(
    spots.map(s => Array.isArray(s.subcategory) ? s.subcategory[0] : s.category).filter(Boolean)
  ))];

  const shown = filter === 'All'
    ? spots
    : spots.filter(s => {
        const cat = Array.isArray(s.subcategory) ? s.subcategory[0] : s.category;
        return cat === filter;
      });

  const countLabel = shown.length === spots.length
    ? `${spots.length} spots`
    : `${shown.length} of ${spots.length}`;

  return (
    <section className="nbp-spots">
      <SectionHdr
        n="A"
        title="The spots"
        sub="every place indexed here"
        right={<span className="nbp-spots__count-label">{countLabel}</span>}
      />

      <div className="nbp-spots__filters">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`nbp-filter-chip${filter === c ? ' nbp-filter-chip--active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="spot-grid">
        {shown.map((item, i) => (
          <SpotCard
            key={item.name}
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

// ── Nearby (§C) ──────────────────────────────────────────

const NearbySection = ({ nearby, regionLabel }) => {
  if (!nearby.length) return null;
  return (
    <section className="nbp-nearby">
      <SectionHdr
        n="C"
        title="Nearby"
        sub={regionLabel ? `more of ${regionLabel}` : 'more neighborhoods'}
        right={
          <Link to="/atlas" className="nbp-nearby__all-link">All neighborhoods →</Link>
        }
      />
      <div className="nbp-nearby__grid">
        {nearby.map(n => (
          <Link key={n.name} to={`/atlas/${slugify(n.name)}`} className="nbp-nearby__tile">
            <img src={n.img} alt={n.name} className="nbp-nearby__tile-img" />
            <div className="nbp-nearby__tile-overlay" />
            {n.count != null && (
              <span className="nbp-nearby__tile-count">{n.count} ›</span>
            )}
            <div className="nbp-nearby__tile-bottom">
              <div className="nbp-nearby__tile-name">{n.name}</div>
              {n.tag && <div className="nbp-nearby__tile-tag">{n.tag}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ── Stub fallback ────────────────────────────────────────

const StubNote = ({ name, spotCount }) => (
  <section className="nbp-stub">
    <div className="nbp-stub__box">
      <svg className="nbp-stub__compass" viewBox="0 0 40 40" width={44} height={44}>
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1"/>
        <path d="M20 4 L22 19 L20 36 L18 19 Z" fill="currentColor"/>
        <path d="M4 20 L19 22 L36 20 L19 18 Z" fill="currentColor" opacity="0.55"/>
        <circle cx="20" cy="20" r="1.4" fill="currentColor"/>
      </svg>
      <div>
        <div className="nbp-stub__heading">The full {name} entry is being written.</div>
        <p className="nbp-stub__body">
          {spotCount} spot{spotCount !== 1 ? 's' : ''} {spotCount !== 1 ? 'are' : 'is'} already indexed
          here — walking notes and curated picks are next in the queue. The nearby neighborhoods
          below will get you oriented in the meantime.
        </p>
      </div>
    </div>
  </section>
);

// ── Page ─────────────────────────────────────────────────

const NeighborhoodPage = ({ setLat, setLon, setZoom }) => {
  const { slug } = useParams();
  const { locations, loading } = useLocations();

  if (loading) {
    return <div className="listing-page"><div className="listing-loading">Loading…</div></div>;
  }

  const matchedLoc = locations.find(loc => slugify(loc.neighborhood) === slug);
  if (!matchedLoc) {
    return (
      <div className="listing-page" style={{ padding: '4rem 2rem', fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
        Neighborhood not found.
      </div>
    );
  }

  const neighborhoodName = matchedLoc.neighborhood;

  const allSpots = locations
    .filter(loc => loc.neighborhood === neighborhoodName)
    .sort((a, b) => a.name.localeCompare(b.name));

  const blurbObj = neighborhoodBlurbs.find(n => n.name === neighborhoodName) || {};
  const meta     = NEIGHBORHOOD_META.find(n => n.name === neighborhoodName) || {};
  const region   = REGIONS.find(r => r.id === meta.region);
  const heroImg  = blurbObj.img || meta.img;

  const nearbyWithData = (blurbObj.nearby || []).map(name => {
    const b = neighborhoodBlurbs.find(n => n.name === name) || {};
    const m = NEIGHBORHOOD_META.find(n => n.name === name) || {};
    return { name, img: b.img || m.img, tag: m.tag || '', count: m.count };
  }).filter(n => n.img).slice(0, 4);

  return (
    <div className="listing-page">
      <Breadcrumb region={region} name={neighborhoodName} />

      <CoverHero
        name={neighborhoodName}
        tag={meta.tag}
        img={heroImg}
        region={region}
        spotCount={allSpots.length}
      />

      <LedeFacts
        blurb={blurbObj.blurb}
        spotCount={allSpots.length}
        region={region}
        tag={meta.tag}
        innerLoop={blurbObj.innerLoop}
      />

      {allSpots.length > 0 ? (
        <SpotsSection
          spots={allSpots}
          setLat={setLat}
          setLon={setLon}
          setZoom={setZoom}
        />
      ) : (
        <StubNote name={neighborhoodName} spotCount={0} />
      )}

      <NearbySection nearby={nearbyWithData} regionLabel={region?.label} />
    </div>
  );
};

export default NeighborhoodPage;
