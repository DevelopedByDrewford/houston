import { Link, useParams } from 'react-router-dom';

import SpotCard from '../components/SpotCard';
import neighborhoodBlurbs from '../data/neighborhoods';
import { NEIGHBORHOOD_META, REGIONS } from '../data/neighborhood-regions';
import { useLocations } from '../contexts/LocationsContext';

const slugify = (text) => {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

// ── Hero ────────────────────────────────────────────────

const NeighborhoodHero = ({ name, tag, blurb, img, region, spotCount }) => (
  <section className="nbp-hero">
    <div className="nbp-hero__meta">
      <Link to="/atlas" className="nbp-hero__back">← Atlas</Link>
      <span className="nbp-hero__meta-divider" />
      {region && <span className="nbp-hero__region">{region.label}</span>}
    </div>
    <div className="nbp-hero__content">
      <div className="nbp-hero__left">
        <h1 className="nbp-hero__title">{name}</h1>
        {tag && <div className="nbp-hero__tag">{tag}</div>}
        {blurb && <p className="nbp-hero__blurb">{blurb}</p>}
        <div className="nbp-hero__count">
          <span className="nbp-hero__count-num">{spotCount}</span>
          <span className="nbp-hero__count-label">spots</span>
        </div>
      </div>
      {img && (
        <figure className="nbp-hero__figure">
          <img src={img} alt={name} className="nbp-hero__img" />
          <div className="nbp-hero__gradient" />
        </figure>
      )}
    </div>
  </section>
);

// ── Nearby tile ─────────────────────────────────────────

const NearbyTile = ({ name, img, tag }) => (
  <Link to={`/atlas/${slugify(name)}`} className="nbp-nearby__tile">
    <img src={img} alt={name} className="nbp-nearby__tile-img" />
    <div className="nbp-nearby__tile-gradient" />
    <div className="nbp-nearby__tile-info">
      {tag && <div className="nbp-nearby__tile-tag">{tag}</div>}
      <div className="nbp-nearby__tile-name">{name}</div>
    </div>
  </Link>
);

// ── Page ────────────────────────────────────────────────

const NeighborhoodPage = ({ setLat, setLon, setZoom }) => {
  const { slug } = useParams();
  const { locations, loading } = useLocations();

  if (loading) {
    return <div className="listing-page"><div className="listing-loading">Loading…</div></div>;
  }

  const matchedLoc = locations.find(loc => slugify(loc.neighborhood) === slug);
  if (!matchedLoc) {
    return <div className="listing-page" style={{ padding: '4rem 2rem', fontFamily: 'var(--mono)' }}>Neighborhood not found.</div>;
  }

  const neighborhoodName = matchedLoc.neighborhood;

  const allSpots = locations
    .filter(loc => loc.neighborhood === neighborhoodName)
    .sort((a, b) => a.name.localeCompare(b.name));

  const blurbObj = neighborhoodBlurbs.find(n => n.name === neighborhoodName) || {};
  const meta = NEIGHBORHOOD_META.find(n => n.name === neighborhoodName) || {};
  const region = REGIONS.find(r => r.id === meta.region);

  const heroImg = blurbObj.img || meta.img;

  const nearbyWithData = (blurbObj.nearby || []).map(name => {
    const b = neighborhoodBlurbs.find(n => n.name === name) || {};
    const m = NEIGHBORHOOD_META.find(n => n.name === name) || {};
    return { name, img: b.img || m.img, tag: m.tag || '' };
  }).filter(n => n.img);

  return (
    <div className="listing-page">
      <NeighborhoodHero
        name={neighborhoodName}
        tag={meta.tag}
        blurb={blurbObj.blurb}
        img={heroImg}
        region={region}
        spotCount={allSpots.length}
      />

      <section className="nbp-spots">
        <div className="nbp-spots__header">
          <span className="nbp-spots__label">All spots in {neighborhoodName}</span>
          <span className="nbp-spots__count">{allSpots.length} results</span>
        </div>
        <div className="spot-grid">
          {allSpots.map((item, i) => (
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

      {nearbyWithData.length > 0 && (
        <section className="nbp-nearby">
          <div className="nbp-nearby__header">
            <span className="nbp-nearby__label">Nearby neighborhoods</span>
          </div>
          <div className="nbp-nearby__grid">
            {nearbyWithData.map(n => (
              <NearbyTile key={n.name} name={n.name} img={n.img} tag={n.tag} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NeighborhoodPage;
