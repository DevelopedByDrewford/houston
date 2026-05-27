import { Link } from 'react-router-dom';

const slugify = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SpotCard = ({ item, index, setLat, setLon, setZoom }) => {
  const catLabel = Array.isArray(item.subcategory)
    ? item.subcategory[0]
    : (item.category || '');

  const handleMapClick = () => {
    if (!item.coordinates || !setLat) return;
    setLat(item.coordinates[0]);
    setLon(item.coordinates[1]);
    setZoom(17);
  };

  return (
    <article className="spot-card">
      <a
        className="spot-card__img-wrap"
        href={item.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.img && (
          <img className="spot-card__img" src={item.img} alt={item.name} />
        )}
        {catLabel && (
          <span className="spot-card__category-tag">{catLabel}</span>
        )}
      </a>

      <div className="spot-card__body">
        <div className="spot-card__header">
          <a
            className="spot-card__name"
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.name}
          </a>
          <span className="spot-card__index">№ {String(index + 1).padStart(3, '0')}</span>
        </div>

        <Link
          to={`/neighborhoods/${slugify(item.neighborhood)}`}
          className="spot-card__neighborhood"
        >
          {item.neighborhood}
        </Link>

        {item.blurb && <p className="spot-card__blurb">{item.blurb}</p>}

        {item.badges && item.badges.length > 0 && (
          <div className="spot-card__badges">
            {item.badges.slice(0, 3).map(b => (
              <span key={b} className="spot-card__badge">{b}</span>
            ))}
          </div>
        )}

        {item.coordinates && (
          <button className="spot-card__map-btn" onClick={handleMapClick}>
            View on map
          </button>
        )}
      </div>
    </article>
  );
};

export default SpotCard;
