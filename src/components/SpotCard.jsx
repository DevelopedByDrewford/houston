import { Link } from 'react-router-dom';
import generateLocationSlug from '../utils/slug';

const slugifyNeighborhood = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SpotCard = ({ item, index, setLat, setLon, setZoom }) => {
  const catLabel = Array.isArray(item.subcategory)
    ? item.subcategory[0]
    : (item.category || '');

  const locationSlug = generateLocationSlug(item);

  const handleMapClick = () => {
    if (!item.coordinates || !setLat) return;
    setLat(item.coordinates[0]);
    setLon(item.coordinates[1]);
    setZoom(17);
  };

  return (
    <article className="spot-card">
      <Link
        className="spot-card__img-wrap"
        to={`/location/${locationSlug}`}
      >
        {item.img && (
          <img className="spot-card__img" src={item.img} alt={item.name} />
        )}
        {catLabel && (
          <span className="spot-card__category-tag">{catLabel}</span>
        )}
      </Link>

      <div className="spot-card__body">
        <div className="spot-card__header">
          <Link
            className="spot-card__name"
            to={`/location/${locationSlug}`}
          >
            {item.name}
          </Link>
          <span className="spot-card__index">№ {String(index + 1).padStart(3, '0')}</span>
        </div>

        <Link
          to={`/atlas/${slugifyNeighborhood(item.neighborhood)}`}
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
